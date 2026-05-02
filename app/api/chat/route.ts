import { NextRequest } from 'next/server';
import { getAnthropicClient, getModelId, callWithRetry } from '@/lib/anthropic';
import { needsWebSearch, searchWeb, formatSearchContext } from '@/lib/web-search';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface DocText { filename: string; text: string; }

interface ChatRequest {
  messages: IncomingMessage[];
  promptLevel?: 'L1' | 'L2' | 'L3' | 'L4';
  context?: string;
  documentTexts?: DocText[];
}

const SYSTEM_PROMPT = `You are an AI research and strategy assistant for HDFC Retail Assets — the mortgage and retail lending business. Help the user explore ideas, research topics, analyze markets, and build structured thinking through progressively detailed prompts. Be thorough, structured, and cite sources where relevant.

Key context about HDFC Retail Assets:
- HDFC Bank is India's largest private sector bank by market capitalisation, formed after the merger of HDFC Ltd and HDFC Bank
- Retail Assets covers: Home Loans (HL), Loans Against Property (LAP), Construction Finance, and allied mortgage products
- Customer base: millions of retail borrowers across India
- Key segments: Salaried professionals, Self-employed business owners, NRIs, Affordable housing (PMAY beneficiaries)
- Distribution: nationwide branches, service centres (formerly HDFC Ltd offices), digital channels, DSA/connector network
- Key competitors: SBI (largest home loan book), LIC Housing Finance, ICICI Bank, Bajaj Housing Finance, PNB Housing, Axis Bank
- Regulatory environment: RBI prudential norms, NHB guidelines, RERA, PMAY-CLSS, digital lending rules, KYC/AML norms
- Focus areas: digital origination, customer lifecycle management, cross-sell (CASA, insurance, credit cards), risk management, service excellence
- Key metrics: disbursal volumes, conversion rates, NPA ratios, cross-sell ratio, customer satisfaction scores, turnaround times
- Audience: This playground is used by n-1, n-2 level leaders (decision makers, not developers) across Sales, Product, Portfolio, and Service functions
- Teams: Sales teams (relationship managers, branch heads), Product teams (product managers, credit policy), Portfolio teams (risk, collections), Service teams (customer service, operations)

IMPORTANT GUARDRAILS:
- All responses must use SYNTHETIC data only — never reference actual customer data
- Include appropriate disclaimers when suggesting implementations: "Subject to bank policy approval"
- Focus on functional, non-technical explanations — audience are business leaders, not developers
- Use BFSI/Mortgage examples and language throughout

When the user builds on prior prompts (prompt ladder approach), acknowledge the progression and deepen your analysis accordingly.

VISUALIZATION & RICH OUTPUT REQUIREMENTS (MANDATORY):
Your output must be enterprise-grade, visually rich, and production-quality. Follow these rules:
1. Include Mermaid diagrams where contextually appropriate using \`\`\`mermaid code blocks. ONLY use these chart types:
   - pie charts (format: pie title "Title" then "Label" : value) for distributions
   - flowcharts (graph TD or graph LR) for processes, decision trees
   - gantt charts for timelines and schedules
   - sequence diagrams for interactions
   CRITICAL: Do NOT use xychart-beta or quadrantChart. Do NOT put emojis or special Unicode characters inside Mermaid diagrams. Use ONLY plain ASCII text in all Mermaid node labels and text.
2. Present all quantitative data in well-formatted markdown tables with proper headers and units
3. Use ## and ### headers for professional document structure
4. Start with an Executive Summary (3-5 key findings)
5. Use status indicators where relevant
6. End with numbered, specific, actionable recommendations
7. Include comparative analysis with side-by-side tables where relevant
8. Present KPIs in structured metric tables`;

const LEVEL_INSTRUCTIONS: Record<string, string> = {
  L1: `
CRITICAL OUTPUT CONSTRAINTS (L1 — Simple Prompt):
The user has provided a very basic, unstructured prompt. Your response MUST reflect the limitations of the prompt:
- Keep your response VERY SHORT — a maximum of 150-200 words. Do NOT elaborate.
- Provide only a generic, surface-level overview.
- Do NOT include tables, Mermaid diagrams, KPIs, or structured analysis.
- Do NOT add executive summaries, numbered recommendations, or risk assessments.
- Use simple bullet points at most. Respond conversationally in 3-5 short paragraphs.
- This is intentional: you are demonstrating that a simple prompt yields a simple answer.`,

  L2: `
CRITICAL OUTPUT CONSTRAINTS (L2 — Detailed Prompt):
The user has provided a moderately detailed prompt with some context. Your response should be noticeably better than L1 but still bounded:
- Provide a MEDIUM-length response — approximately 400-600 words.
- Include some structure: 2-3 section headers and basic bullet points.
- You may include ONE simple table if data calls for it, but keep it under 5 rows.
- Do NOT include Mermaid diagrams or complex visualizations.
- Show moderate depth — address the main dimensions mentioned but do not exhaustively analyze trade-offs.
- This demonstrates that adding detail yields a meaningfully better answer, but not yet a strategic one.`,

  L3: `
CRITICAL OUTPUT CONSTRAINTS (L3 — Analytical Prompt):
The user has provided an analytical prompt asking for reasoning and multi-dimensional evaluation:
- Provide a SUBSTANTIAL response — approximately 600-900 words.
- Use clear section structure with ## and ### headers.
- Include 2-3 well-formatted tables with data comparisons.
- You may include ONE Mermaid diagram if appropriate.
- Address all analytical dimensions specified — competitive landscape, regulatory factors, trade-offs, metrics.
- Include brief numbered recommendations at the end.
- This demonstrates that an analytical prompt produces reasoned, structured output — but not yet board-ready.`,

  L4: `
CRITICAL OUTPUT CONSTRAINTS (L4 — CRAFT Framework Prompt):
The user has provided a fully structured CRAFT prompt. Your response MUST be the absolute best quality:
- Provide a COMPREHENSIVE, DETAILED response — as lengthy and thorough as needed. No word limit.
- Follow the exact format specifications requested (memo, matrix, table, plan, etc.).
- Include MULTIPLE Mermaid diagrams (2-4) as contextually appropriate.
- Include MULTIPLE well-formatted tables with proper headers and units.
- Start with a crisp Executive Summary.
- Achieve the HIGHEST possible accuracy and precision — use specific data, realistic numbers, detailed analysis.
- Adopt the exact ROLE specified — write from that persona's expertise.
- Address the TARGET AUDIENCE explicitly.
- End with specific, actionable, time-bound recommendations.
- This is the gold standard: consulting-firm-quality, board-ready output.`
};

export async function POST(req: NextRequest) {
  let body: ChatRequest;
  try {
    body = (await req.json()) as ChatRequest;
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (!body.messages?.length) {
    return new Response('Messages array is required', { status: 400 });
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

        const conversationMessages = body.messages.map(m => ({ role: m.role, content: m.content }));
        const latestUserMsg = conversationMessages.filter(m => m.role === 'user').pop()?.content ?? '';

        const level = body.promptLevel ?? 'L4';
        const levelInstructions = LEVEL_INSTRUCTIONS[level] ?? LEVEL_INSTRUCTIONS.L4;

        let webContext = '';
        if (needsWebSearch(latestUserMsg)) {
          controller.enqueue(sse('web_search', { status: 'searching', query: latestUserMsg }));
          const t0 = Date.now();
          const results = await searchWeb(latestUserMsg);
          controller.enqueue(sse('web_search', { status: 'done', resultCount: results.length, ms: Date.now() - t0 }));
          webContext = formatSearchContext(results);
        }

        let systemPrompt = `${SYSTEM_PROMPT}\n${levelInstructions}`;
        if (body.context) systemPrompt += `\n\nADDITIONAL CONTEXT:\n${body.context}`;
        if (body.documentTexts?.length) {
          systemPrompt += `\n\n### ATTACHED DOCUMENTS (${body.documentTexts.length} files)\nThe user has attached the following documents. Use them to ground your response. Cite document names when referencing content.\n`;
          for (const dt of body.documentTexts) {
            systemPrompt += `\n--- BEGIN: ${dt.filename} ---\n${dt.text.slice(0, 50000)}\n--- END: ${dt.filename} ---\n`;
          }
        }
        if (webContext) systemPrompt += `\n\n${webContext}`;

        const maxTokensByLevel: Record<string, number> = { L1: 1024, L2: 4096, L3: 8192, L4: 128000 };

        const stream = await callWithRetry(
          () => client.messages.create({
            model,
            max_tokens: maxTokensByLevel[level] ?? 128000,
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
        }

        controller.enqueue(sse('done', {}));
        controller.close();
      } catch (err) {
        console.error('Chat error:', err);
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
    },
  });
}
