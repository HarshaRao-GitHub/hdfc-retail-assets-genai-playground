import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { getAnthropicClient, getModelId, callWithRetry } from '@/lib/anthropic';
import { getOperationById, getDepartmentById } from '@/data/doc-intelligence-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

type MessageParam = Anthropic.MessageParam;
type TextBlockParam = Anthropic.TextBlockParam;
type ImageBlockParam = Anthropic.ImageBlockParam;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ImageAttachment {
  base64: string;
  media_type: string;
  label: string;
}

interface UploadedDoc {
  filename: string;
  text: string;
  images?: ImageAttachment[];
}

interface DocIntelRequest {
  operation: string;
  department?: string;
  messages: ChatMessage[];
  uploadedTexts: UploadedDoc[];
  options?: {
    outputFormat?: 'table' | 'json' | 'bullets' | 'narrative';
    summaryType?: 'executive' | 'section' | 'action-items' | 'risk';
    comparisonMode?: 'delta' | 'missing' | 'risk-impact';
  };
}

function buildSystemPrompt(req: DocIntelRequest): string {
  const operation = getOperationById(req.operation);
  if (!operation) {
    return 'You are an HDFC Retail Assets Document Intelligence Agent. Analyze the uploaded mortgage and banking documents and provide structured, actionable insights. Always ground your answers in the document content. Use SYNTHETIC data only.';
  }

  const parts: string[] = [operation.systemPromptTemplate];

  parts.push(
    '',
    '## CRITICAL: Document Grounding & Retrieval Protocol',
    'You are operating as a document-grounded retrieval agent for HDFC Retail Assets. Follow these rules STRICTLY:',
    '',
    '### Reading Protocol',
    '1. Before answering ANY question, read the ENTIRE uploaded document content thoroughly — every section, table, row, paragraph, heading, footnote, and annotation.',
    '2. For tabular data (CSV, Excel), scan EVERY row and column — do not skip or sample. The answer may be in any row.',
    '3. For PDFs and long documents, pay equal attention to the beginning, middle, and end.',
    '4. For images/visual content provided, extract ALL visible text, numbers, labels, annotations, and structural elements.',
    '',
    '### Answering Protocol',
    '1. ALWAYS answer based on what is ACTUALLY in the documents. Never fabricate, hallucinate, or assume information not present.',
    '2. For every claim or data point, cite the source: document name, section/heading, row number, or page reference.',
    '3. Use DIRECT QUOTES from the document when they support your answer — format as blockquotes (> quote).',
    '4. If the exact answer is not in the documents, say "This information is not found in the uploaded documents" — do NOT make up an answer.',
    '5. If you find PARTIAL information, share what you found and clearly state what is missing.',
    '6. When the user asks about specific values, numbers, dates, or names — extract them EXACTLY as written.',
    '',
    '### Extraction Protocol',
    '1. When extracting information, be EXHAUSTIVE — extract ALL instances, not just the first one found.',
    '2. For structured data requests, scan the ENTIRE document and compile a complete list.',
    '3. Preserve the original terminology, abbreviations, and conventions used in the document.',
    '4. If data exists in both text AND tables/images, cross-reference and include both sources.',
    '5. For numerical data, preserve original units, decimal precision, and formatting.',
    '6. When the user asks "how many" or "list all", count and list EVERY matching item.',
    '',
    '### HDFC Retail Assets Context',
    '- You are operating in the HDFC Retail Assets domain — home loans, loans against property (LAP), balance transfers, top-up loans.',
    '- Key stakeholders: Sales, Product, Portfolio Management, Service, Credit, Collections teams.',
    '- Regulatory framework: RBI housing loan guidelines, NHB norms, RERA, PMAY-CLSS, KYC/AML requirements.',
    '- Always use SYNTHETIC data. Include disclaimer: "Analysis based on synthetic data — subject to bank policy approval."',
  );

  if (req.department) {
    const dept = getDepartmentById(req.department);
    if (dept) {
      parts.push(
        '',
        `## Department Context: ${dept.label}`,
        `You are operating in the context of the ${dept.label} department.`,
        `Typical documents in this department: ${dept.typicalDocs}`,
        `Tailor your analysis, terminology, and recommendations to this department's needs.`
      );
    }
  }

  if (req.options?.outputFormat) {
    const fmtInstructions: Record<string, string> = {
      table: 'Present your output primarily in Markdown tables with clear headers and aligned columns.',
      json: 'Structure your output as formatted JSON objects where applicable, with clear keys and values.',
      bullets: 'Use concise bullet points organized in hierarchical lists for your output.',
      narrative: 'Write your output as a flowing narrative with clear section headings and paragraphs.',
    };
    parts.push('', `## Output Format Preference`, fmtInstructions[req.options.outputFormat] || '');
  }

  if (req.options?.summaryType && req.operation === 'summarize') {
    parts.push('', `## Summary Type Requested: ${req.options.summaryType}`, `Focus your summarization on producing a "${req.options.summaryType}" style summary.`);
  }

  if (req.options?.comparisonMode && req.operation === 'compare') {
    const modeInstructions: Record<string, string> = {
      delta: 'Focus on identifying all changes/differences between the documents.',
      missing: 'Focus on identifying what is present in one document but missing from the other.',
      'risk-impact': 'Focus on assessing the risk impact of differences between documents.',
    };
    parts.push('', `## Comparison Mode: ${req.options.comparisonMode}`, modeInstructions[req.options.comparisonMode] || '');
  }

  parts.push(
    '',
    '## Visual Content Analysis',
    'If images, diagrams, charts, or screenshots are provided:',
    '1. Analyze ALL visual content thoroughly — extract every piece of text, number, label, and annotation.',
    '2. For property documents/photographs: identify property details, condition, dimensions, and any visible information.',
    '3. For financial documents in images: extract ALL data points, amounts, dates, and signatures.',
    '4. For tables in images: reconstruct them COMPLETELY as markdown tables.',
    '5. For charts/graphs: extract ALL data points, axis values, legends, trends — reconstruct as a data table.',
    '6. IMPORTANT: Integrate visual content findings with text content.',
  );

  const isVisualizationOp = req.operation === 'visualize';
  if (isVisualizationOp) {
    parts.push(
      '',
      '## Visualization & Chart Output Requirements',
      'This is a VISUALIZATION operation — produce rich visual charts alongside data analysis.',
      '1. Include Mermaid diagrams using ```mermaid code blocks: pie charts for distributions, flowcharts for processes, Gantt for timelines. Do NOT use xychart-beta or quadrantChart. Do NOT use emojis or special Unicode inside Mermaid — ONLY plain ASCII text.',
      '2. Present ALL quantitative data in well-formatted markdown tables.',
      '3. Use ## and ### headers for professional document structure.',
      '4. Start with an Executive Summary (3-5 key findings).',
      '5. End with numbered, specific, actionable recommendations.',
      '6. For data-heavy documents, produce at least 2 Mermaid visualizations.',
    );
  } else {
    parts.push(
      '',
      '## Output Formatting',
      '1. Use ## and ### headers for clear document structure.',
      '2. Present data in well-formatted markdown tables when it improves clarity.',
      '3. Use bullet points for lists and key findings.',
      '4. Use blockquotes (>) for direct citations from documents.',
      '5. PRIORITIZE ACCURACY AND COMPLETENESS over visual formatting.',
      '6. Only include Mermaid charts if the user explicitly asks for visualization.',
    );
  }

  return parts.join('\n');
}

const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

function buildDocumentContext(docs: UploadedDoc[]): { documentText: string; allImages: ImageAttachment[]; docCount: number; docNames: string[] } {
  const allImages: ImageAttachment[] = [];
  const docBlocks: string[] = [];
  const docNames: string[] = [];

  for (const doc of docs) {
    docNames.push(doc.filename);

    if (doc.text?.trim()) {
      const lines = doc.text.trim().split('\n');
      const lineCount = lines.length;
      const charCount = doc.text.trim().length;

      docBlocks.push(
        `══════════════════════════════════════════════════════════`,
        `DOCUMENT: ${doc.filename}`,
        `Size: ${charCount.toLocaleString()} characters | ${lineCount.toLocaleString()} lines`,
        `══════════════════════════════════════════════════════════`,
        '',
        doc.text.trim(),
        '',
        `═══ END OF "${doc.filename}" ═══`,
      );
    }

    if (doc.images?.length) {
      for (const img of doc.images) {
        if (img.base64 && img.media_type) {
          allImages.push(img);
        }
      }
    }
  }

  const documentText = docBlocks.length > 0
    ? [
        '──────────────────────────────────────────────────────────────',
        '                 UPLOADED DOCUMENT CONTENT                    ',
        `  ${docs.length} document(s): ${docNames.join(', ')}`,
        '  IMPORTANT: Read ALL content below carefully before answering.',
        '──────────────────────────────────────────────────────────────',
        '',
        docBlocks.join('\n\n'),
      ].join('\n')
    : '';

  return { documentText, allImages, docCount: docs.length, docNames };
}

function buildConversationMessages(body: DocIntelRequest): MessageParam[] {
  const incomingMsgs = Array.isArray(body.messages) ? body.messages : [];
  if (incomingMsgs.length === 0) return [];

  const docs = body.uploadedTexts?.length ? body.uploadedTexts : [];
  const { documentText, allImages, docCount, docNames } = buildDocumentContext(docs);
  const hasDocContext = documentText.length > 0 || allImages.length > 0;

  const result: MessageParam[] = [];

  for (let i = 0; i < incomingMsgs.length; i++) {
    const msg = incomingMsgs[i];

    if (i === 0 && msg.role === 'user' && hasDocContext) {
      const contentBlocks: (TextBlockParam | ImageBlockParam)[] = [];

      if (documentText) {
        contentBlocks.push({ type: 'text', text: documentText });
      }

      if (allImages.length > 0) {
        contentBlocks.push({
          type: 'text',
          text: `\n── VISUAL CONTENT: ${allImages.length} image(s) attached ──\nAnalyze each image below carefully. Extract ALL visible text, numbers, labels, annotations, and structural elements.`,
        });

        for (const img of allImages) {
          const mt = SUPPORTED_IMAGE_TYPES.has(img.media_type)
            ? img.media_type as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
            : 'image/png';

          contentBlocks.push({
            type: 'image',
            source: {
              type: 'base64',
              media_type: mt,
              data: img.base64,
            },
          });
          contentBlocks.push({
            type: 'text',
            text: `[Image: ${img.label}] — Extract all information from this image.`,
          });
        }
      }

      contentBlocks.push({
        type: 'text',
        text: `\n── USER QUERY ──\n${msg.content}\n\nIMPORTANT: Answer this query by carefully reading ALL ${docCount} uploaded document(s) (${docNames.join(', ')})${allImages.length > 0 ? ` and analyzing all ${allImages.length} attached image(s)` : ''}. Ground every answer in the actual document content. Cite specific sections, rows, or passages.`,
      });

      result.push({ role: 'user', content: contentBlocks });
    } else if (msg.role === 'user' && hasDocContext && i > 0) {
      result.push({
        role: 'user',
        content: `${msg.content}\n\n[Refer to the ${docCount} uploaded document(s) — ${docNames.join(', ')} — provided at the start of this conversation. Search the FULL document content to answer accurately. Cite sources.]`,
      });
    } else {
      result.push({ role: msg.role, content: msg.content });
    }
  }

  return result;
}

export async function POST(req: NextRequest) {
  let body: DocIntelRequest;
  try {
    body = (await req.json()) as DocIntelRequest;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!body.operation) {
    return new Response('Missing operation', { status: 400 });
  }

  const systemPrompt = buildSystemPrompt(body);
  const conversationMessages = buildConversationMessages(body);

  if (conversationMessages.length === 0) {
    const encoder = new TextEncoder();
    const errStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: 'No messages provided' })}\n\n`));
        controller.close();
      },
    });
    return new Response(errStream, {
      headers: { 'Content-Type': 'text/event-stream; charset=utf-8' },
    });
  }

  const encoder = new TextEncoder();
  function sse(event: string, data: unknown): Uint8Array {
    return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const client = getAnthropicClient();
        const model = getModelId();
        const liveStart = Date.now();

        let totalInputTokens = 0;
        let totalOutputTokens = 0;

        const stream = await callWithRetry(
          () => client.messages.create({
            model,
            max_tokens: 128000,
            system: systemPrompt,
            messages: conversationMessages,
            stream: true,
          }),
          (attempt, max, err) => {
            controller.enqueue(sse('retry', { attempt, max, message: `API busy (${err.message}), retrying ${attempt}/${max}...` }));
          }
        );

        for await (const event of stream) {
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            controller.enqueue(sse('text_delta', event.delta.text));
          }
          if (event.type === 'message_delta' && event.usage) {
            totalOutputTokens = event.usage.output_tokens ?? 0;
          }
          if (event.type === 'message_start' && event.message?.usage) {
            totalInputTokens = event.message.usage.input_tokens ?? 0;
          }
        }

        const elapsedS = parseFloat(((Date.now() - liveStart) / 1000).toFixed(1));
        const totalCost = totalInputTokens * 3 / 1_000_000 + totalOutputTokens * 15 / 1_000_000;

        controller.enqueue(sse('usage', {
          input_tokens: totalInputTokens,
          output_tokens: totalOutputTokens,
          total_tokens: totalInputTokens + totalOutputTokens,
          tool_calls: 0,
          api_turns: 1,
          model,
          response_time_s: elapsedS,
          estimated_cost_usd: parseFloat(totalCost.toFixed(4)),
        }));

        controller.enqueue(sse('done', {}));
        controller.close();
      } catch (err) {
        console.error('Doc intelligence error:', err);
        controller.enqueue(sse('error', { message: err instanceof Error ? err.message : 'Unknown error' }));
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Workbench-Mode': 'live',
      'X-Workbench-Model': getModelId(),
    },
  });
}
