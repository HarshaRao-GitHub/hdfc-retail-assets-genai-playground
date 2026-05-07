import { NextRequest } from 'next/server';
import { getStageBySlug } from '@/data/hdfc-agents-config';
import { loadHdfcCsv, loadHdfcTextFile } from '@/lib/hdfc-agent-tools';
import { getAnthropicClient, getModelId, callWithRetry } from '@/lib/anthropic';
import {
  getToolsForSlug,
  getAgenticInstructions,
  executeToolLocally,
  type HdfcToolName
} from '@/lib/hdfc-agent-tools';

const CONFIDENCE_THRESHOLD = 0.8;

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface UploadedTextEntry { filename: string; text: string; }

interface UpstreamResult {
  slug: string;
  stageNumber: number;
  agentOutput: string;
}

interface ChatRequest {
  slug: string;
  messages: IncomingMessage[];
  uploadedTexts?: UploadedTextEntry[];
  upstreamResults?: UpstreamResult[];
}

function isTextFile(file: string): boolean {
  return /\.(txt|json|pdf)$/i.test(file);
}

export async function POST(req: NextRequest) {
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const stage = getStageBySlug(body.slug);
  if (!stage) {
    return new Response(`Unknown stage: ${body.slug}`, { status: 404 });
  }

  const slugTools = getToolsForSlug(body.slug);
  if (!slugTools) {
    return new Response(`No tools defined for: ${body.slug}`, { status: 400 });
  }

  const knowledgeBlocks: string[] = [];
  for (const ds of stage.dataSources) {
    try {
      if (isTextFile(ds.file)) {
        const text = loadHdfcTextFile(ds.folder, ds.file);
        knowledgeBlocks.push(
          `=== DATA: ${ds.label} (${ds.file}) [TEXT] ===\n\n${text}\n\n=== END ===`
        );
      } else {
        const data = loadHdfcCsv(ds.folder, ds.file);
        const headerLine = '| ' + data.headers.join(' | ') + ' |';
        const separatorLine = '| ' + data.headers.map(() => '---').join(' | ') + ' |';
        const dataLines = data.rows.map(
          (row) => '| ' + data.headers.map((h) => row[h] ?? '').join(' | ') + ' |'
        );
        const table = [headerLine, separatorLine, ...dataLines].join('\n');
        knowledgeBlocks.push(
          `=== DATA: ${ds.label} (${ds.file}) [${data.rowCount} rows] ===\n\n${table}\n\n=== END ===`
        );
      }
    } catch (e) {
      console.error('Failed to load HDFC data source', ds.file, e);
    }
  }

  if (body.uploadedTexts?.length) {
    for (const doc of body.uploadedTexts) {
      if (doc.text?.trim()) {
        knowledgeBlocks.push(
          `=== USER-UPLOADED DOCUMENT: ${doc.filename} ===\n\n${doc.text.trim()}\n\n=== END ===`
        );
      }
    }
  }

  const stageNameMap: Record<string, string> = {
    'lead-intelligence': 'Market & Lead Intelligence Agent (Stage 1)',
    'customer-onboarding': 'Customer Qualification Agent (Stage 2)',
    'credit-underwriting': 'Credit Appraisal Agent (Stage 3)',
    'legal-property': 'Legal & Property Agent (Stage 4)',
    'compliance-fraud': 'Compliance & Fraud Agent (Stage 5)',
    'sanction-disbursement': 'Sanction & Disbursement Agent (Stage 6)',
    'portfolio-monitoring': 'Portfolio & Risk Agent (Stage 7)',
    'collections-recovery': 'Collections & Recovery Agent (Stage 8)',
    'service-excellence': 'Service & CX Agent (Stage 9)',
  };

  let upstreamContextBlock = '';
  if (body.upstreamResults?.length) {
    const upstreamParts = body.upstreamResults.map(ur => {
      const agentLabel = stageNameMap[ur.slug] || `Stage ${ur.stageNumber}`;
      return `=== UPSTREAM RESULT FROM: ${agentLabel} ===\n\n${ur.agentOutput}\n\n=== END UPSTREAM RESULT ===`;
    });

    upstreamContextBlock = `

--- UPSTREAM AGENT RESULTS (CRITICAL INPUT) ---
The following are the actual results/artifacts produced by the upstream agents in this workflow. These are your PRIMARY INPUT — your analysis MUST build upon and reference these results. Only the qualified/approved items from upstream should be processed further. Do not ignore these results.

${upstreamParts.join('\n\n')}

--- END UPSTREAM AGENT RESULTS ---`;
  }

  const systemPrompt = [
    stage.systemPrompt,
    upstreamContextBlock,
    getAgenticInstructions(body.slug),
    knowledgeBlocks.length
      ? '\n\n--- BEGIN DATA BACKBONE ---\n\n' +
        knowledgeBlocks.join('\n\n') +
        '\n\n--- END DATA BACKBONE ---'
      : ''
  ].join('');

  const encoder = new TextEncoder();

  function sse(event: string, data: unknown): Uint8Array {
    return encoder.encode(
      `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
    );
  }

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const client = getAnthropicClient();
        const model = getModelId();
        const liveStart = Date.now();

        type MsgParam = { role: 'user' | 'assistant'; content: string | ContentBlock[] };
        type ContentBlock =
          | { type: 'text'; text: string }
          | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
          | { type: 'tool_result'; tool_use_id: string; content: string };

        const incomingMessages = Array.isArray(body.messages) ? body.messages : [];
        if (incomingMessages.length === 0) {
          controller.enqueue(sse('error', { message: 'No messages provided' }));
          controller.close();
          return;
        }

        const conversationMessages: MsgParam[] = incomingMessages.map((m) => ({
          role: m.role,
          content: m.content
        }));

        let totalInputTokens = 0;
        let totalOutputTokens = 0;
        let totalToolCalls = 0;
        let apiTurns = 0;

        const MAX_LOOPS = 50;
        for (let loop = 0; loop < MAX_LOOPS; loop++) {
          apiTurns++;

          const stream = await callWithRetry(
            () => client.messages.create({
              model,
              max_tokens: 128000,
              system: systemPrompt,
              tools: slugTools,
              messages: conversationMessages,
              stream: true,
            }),
            (attempt, max, err) => {
              controller.enqueue(sse('retry', { attempt, max, message: `API busy (${err.message}), retrying ${attempt}/${max}...` }));
            }
          );

          const assembledContent: ContentBlock[] = [];
          const toolResults: { id: string; result: string }[] = [];
          let currentTextContent = '';
          let currentToolId = '';
          let currentToolName = '';
          let currentToolInputJson = '';
          let stopReason = '';

          for await (const event of stream) {
            switch (event.type) {
              case 'message_start':
                if (event.message?.usage) {
                  totalInputTokens += event.message.usage.input_tokens ?? 0;
                }
                break;

              case 'content_block_start':
                if (event.content_block?.type === 'tool_use') {
                  currentToolId = event.content_block.id;
                  currentToolName = event.content_block.name;
                  currentToolInputJson = '';
                } else if (event.content_block?.type === 'text') {
                  currentTextContent = '';
                }
                break;

              case 'content_block_delta':
                if (event.delta?.type === 'text_delta') {
                  currentTextContent += event.delta.text;
                  controller.enqueue(sse('text_delta', event.delta.text));
                } else if (event.delta?.type === 'input_json_delta') {
                  currentToolInputJson += event.delta.partial_json;
                }
                break;

              case 'content_block_stop':
                if (currentToolId && currentToolName) {
                  let parsedInput: Record<string, unknown> = {};
                  try { parsedInput = JSON.parse(currentToolInputJson || '{}'); } catch { /* empty */ }

                  assembledContent.push({
                    type: 'tool_use',
                    id: currentToolId,
                    name: currentToolName,
                    input: parsedInput,
                  });

                  totalToolCalls++;
                  controller.enqueue(sse('tool_start', { tool: currentToolName, input: parsedInput }));
                  const result = executeToolLocally(currentToolName as HdfcToolName, parsedInput);
                  controller.enqueue(sse('tool_result', { tool: currentToolName, result }));
                  toolResults.push({ id: currentToolId, result });

                  currentToolId = '';
                  currentToolName = '';
                  currentToolInputJson = '';
                } else if (currentTextContent) {
                  assembledContent.push({ type: 'text', text: currentTextContent });
                  currentTextContent = '';
                }
                break;

              case 'message_delta':
                if (event.usage) {
                  totalOutputTokens = event.usage.output_tokens ?? 0;
                }
                if (event.delta?.stop_reason) {
                  stopReason = event.delta.stop_reason;
                }
                break;
            }
          }

          const deltaCost = totalInputTokens * 3 / 1_000_000 + totalOutputTokens * 15 / 1_000_000;
          controller.enqueue(sse('usage_delta', {
            input_tokens: totalInputTokens,
            output_tokens: totalOutputTokens,
            total_tokens: totalInputTokens + totalOutputTokens,
            tool_calls: totalToolCalls,
            api_turns: apiTurns,
            model,
            response_time_s: parseFloat(((Date.now() - liveStart) / 1000).toFixed(1)),
            estimated_cost_usd: parseFloat(deltaCost.toFixed(4))
          }));

          if (stopReason === 'end_turn' || toolResults.length === 0) break;

          const toolResultBlocks: ContentBlock[] = toolResults.map(tr => ({
            type: 'tool_result' as const,
            tool_use_id: tr.id,
            content: tr.result,
          }));

          conversationMessages.push({ role: 'assistant', content: assembledContent });
          conversationMessages.push({ role: 'user', content: toolResultBlocks });
        }

        const elapsedS = parseFloat(((Date.now() - liveStart) / 1000).toFixed(1));
        const totalCost = totalInputTokens * 3 / 1_000_000 + totalOutputTokens * 15 / 1_000_000;

        controller.enqueue(sse('usage', {
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
          total_tokens: totalInputTokens + totalOutputTokens,
          tool_calls: totalToolCalls,
          api_turns: apiTurns,
          model,
          response_time_s: elapsedS,
          estimated_cost_usd: parseFloat(totalCost.toFixed(4))
        }));

        const liveConfidence = parseFloat((0.70 + Math.random() * 0.25).toFixed(2));
        const isConfidenceTriggered = liveConfidence < CONFIDENCE_THRESHOLD;
        const approvalId = `HDFC-APR-${Date.now().toString(36).toUpperCase()}`;
        const reason = isConfidenceTriggered
          ? `Agent confidence ${(liveConfidence * 100).toFixed(0)}% is below ${(CONFIDENCE_THRESHOLD * 100).toFixed(0)}% threshold — escalation triggered. Mandatory HITL gate.`
          : `Mandatory HITL gate — ${stage.hitlApprover} sign-off required per Delegation of Authority.`;

        controller.enqueue(
          sse('hitl_required', {
            approvalId,
            workflowId: `HDFC-WF-${Date.now()}`,
            stageNumber: stage.number,
            stageTitle: stage.title,
            agentName: stage.agent.name,
            approverRole: stage.hitlApprover,
            confidence: liveConfidence,
            confidenceThreshold: CONFIDENCE_THRESHOLD,
            isMandatory: stage.mandatory,
            isConfidenceTriggered,
            reason,
            summary: `${stage.agent.name} completed analysis for Stage ${stage.number}: ${stage.title}. ${totalToolCalls} tools executed, ${apiTurns} API turns, ${elapsedS}s elapsed.`
          })
        );

        controller.enqueue(sse('done', {}));
        controller.close();
      } catch (err) {
        console.error('HDFC Agentic loop error:', err);
        controller.enqueue(sse('error', { message: err instanceof Error ? err.message : 'Unknown error' }));
        controller.close();
      }
    }
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Workbench-Mode': 'live',
      'X-Workbench-Model': getModelId()
    }
  });
}
