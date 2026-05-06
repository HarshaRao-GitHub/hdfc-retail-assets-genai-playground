import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  BorderStyle, ShadingType, PageBreak,
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';

import { LAB_EXPERIMENTS, PROMPT_LADDERS } from '../data/prompt-templates';
import { FIELD_SALES_LAB_EXPERIMENTS } from '../data/field-sales-prompts';
import {
  FIELD_OBJECTION_SCENARIOS,
  PROSPECT_RESEARCH_SCENARIOS,
  CLOSING_SCENARIOS,
} from '../data/field-sales-scenarios';
import {
  ROLE_PLAY_PERSONAS,
  DEAL_SCORER_TEMPLATES,
  LOBBY_MODE_SCENARIOS,
  INDUSTRY_NEWS_ITEMS,
} from '../data/field-sales-advanced';
import { FIELD_SALES_USE_CASES } from '../data/field-sales-use-cases';
import { USE_CASES } from '../data/use-cases';
import {
  MYTHS_VS_REALITY,
  OBJECTION_SCENARIOS,
  HALLUCINATION_EXAMPLES,
  HITL_SCENARIOS,
  SYSTEM_VS_USER_EXAMPLES,
} from '../data/advanced-features';
import {
  FACILITATION_GUIDE,
  VOC_SCENARIOS,
  BUILD_BUY_EXAMPLES,
  THIRTY_DAY_PLAN_TEMPLATE,
} from '../data/facilitation-guide';

const BLUE = '003366';
const GRAY = '666666';
const LIGHT_BG = 'F0F4F8';

function heading1(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
    children: [new TextRun({ text, bold: true, size: 32, color: BLUE, font: 'Calibri' })],
  });
}

function heading2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, size: 26, color: BLUE, font: 'Calibri' })],
  });
}

function heading3(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, color: '333333', font: 'Calibri' })],
  });
}

function labelP(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 120, after: 60 },
    children: [new TextRun({ text, bold: true, size: 20, color: BLUE, font: 'Calibri' })],
  });
}

function bodyP(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 80 },
    children: [new TextRun({ text, size: 20, color: '333333', font: 'Calibri' })],
  });
}

function promptBox(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 60, after: 120 },
    indent: { left: 360 },
    shading: { type: ShadingType.SOLID, color: LIGHT_BG },
    border: {
      left: { style: BorderStyle.SINGLE, size: 6, color: BLUE },
    },
    children: [new TextRun({ text, size: 19, italics: true, color: '444444', font: 'Calibri' })],
  });
}

function divider(): Paragraph {
  return new Paragraph({
    spacing: { before: 100, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
    children: [new TextRun({ text: '', size: 10 })],
  });
}

function pb(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] });
}

async function main() {
  const s: Paragraph[] = [];

  // COVER
  s.push(new Paragraph({ spacing: { before: 2000 }, children: [] }));
  s.push(new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'HDFC Retail Assets', size: 44, bold: true, color: BLUE, font: 'Calibri' })],
  }));
  s.push(new Paragraph({ alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'GenAI Playground — Complete Prompt Catalog', size: 36, bold: true, color: BLUE, font: 'Calibri' })],
  }));
  s.push(new Paragraph({ spacing: { before: 400 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'All prompts, scenarios, templates, and use cases organized by category', size: 22, color: GRAY, font: 'Calibri' })],
  }));
  s.push(new Paragraph({ spacing: { before: 200 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Version 3.2 | May 2026 | Internal — Confidential', size: 20, color: GRAY, font: 'Calibri' })],
  }));
  s.push(new Paragraph({ spacing: { before: 100 }, alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Synthetic Training Data — No real customer data', size: 18, color: '999999', font: 'Calibri' })],
  }));

  // TOC
  s.push(pb());
  s.push(heading1('Table of Contents'));
  const toc = [
    '1. Prompt Lab — CRAFT Experiments (L1-L4)',
    '2. Prompt Lab — 10-Theme Prompt Ladders (L1-L3)',
    '3. Field Sales — CRAFT Experiments (L1-L4)',
    '4. Field Sales — Objection Handling Scenarios',
    '5. Field Sales — Prospect Research Scenarios',
    '6. Field Sales — Closing Strategy Scenarios',
    '7. Field Sales — Role-Play Personas',
    '8. Field Sales — Deal Scorer Templates',
    '9. Field Sales — Lobby Mode Scenarios',
    '10. Field Sales — Industry News Intelligence',
    '11. Field Sales — Use Cases & Sample Prompts',
    '12. Leadership — Use Cases & Sample Prompts',
    '13. Leadership — Myths vs Reality',
    '14. Leadership — Objection Scenarios (Advanced)',
    '15. Leadership — Hallucination Detection Examples',
    '16. Leadership — Human-in-the-Loop Scenarios',
    '17. Leadership — System vs User Prompt Examples',
    '18. Facilitation Guide — Exercises & Prompts',
    '19. VOC (Voice of Customer) Scenarios',
    '20. Build vs Buy Decision Examples',
    '21. 30-Day GenAI Action Plan Prompts',
  ];
  toc.forEach(t => s.push(bodyP(t)));

  // === 1. LAB EXPERIMENTS ===
  s.push(pb());
  s.push(heading1('1. Prompt Lab — CRAFT Experiments (L1-L4)'));
  s.push(bodyP('Three progressive experiments demonstrating how prompt quality transforms AI output quality. Each experiment shows the same question at four levels of sophistication.'));

  LAB_EXPERIMENTS.forEach((exp, i) => {
    s.push(heading2(`Experiment ${i + 1}: ${exp.theme}`));
    s.push(bodyP(exp.description));
    exp.levels.forEach(level => {
      s.push(labelP(`${level.tag} — ${level.label}`));
      s.push(promptBox(level.prompt));
    });
    s.push(divider());
  });

  // === 2. PROMPT LADDERS ===
  s.push(pb());
  s.push(heading1('2. Prompt Lab — 10-Theme Prompt Ladders (L1-L3)'));
  s.push(bodyP('Ten banking themes with three levels of prompt sophistication, showing how adding context, analysis requirements, and format specifications dramatically improves AI output.'));

  PROMPT_LADDERS.forEach((ladder, i) => {
    s.push(heading2(`Theme ${i + 1}: ${ladder.theme}`));
    ladder.levels.forEach((p, j) => {
      s.push(labelP(`Level ${j + 1}: ${p.label}`));
      s.push(promptBox(p.prompt));
    });
    s.push(divider());
  });

  // === 3. FIELD SALES LAB EXPERIMENTS ===
  s.push(pb());
  s.push(heading1('3. Field Sales — CRAFT Experiments (L1-L4)'));
  s.push(bodyP('Six field-sales-specific experiments with anchor scenarios and four levels of prompt sophistication.'));

  FIELD_SALES_LAB_EXPERIMENTS.forEach((exp, i) => {
    s.push(heading2(`Experiment ${i + 1}: ${exp.theme}`));
    s.push(bodyP(exp.description));
    if (exp.anchorScenario) {
      s.push(labelP('Anchor Scenario'));
      s.push(promptBox(exp.anchorScenario));
    }
    exp.levels.forEach(level => {
      s.push(labelP(`${level.tag} — ${level.label}`));
      s.push(promptBox(level.prompt));
    });
    s.push(divider());
  });

  // === 4. OBJECTION SCENARIOS ===
  s.push(pb());
  s.push(heading1('4. Field Sales — Objection Handling Scenarios'));
  s.push(bodyP(`${FIELD_OBJECTION_SCENARIOS.length} real-world customer objections with context, competitor mentions, and suggested approaches.`));

  FIELD_OBJECTION_SCENARIOS.forEach((sc, i) => {
    s.push(heading3(`${i + 1}. ${sc.product} — ${sc.category.toUpperCase()}`));
    s.push(labelP('Product'));
    s.push(bodyP(sc.product));
    s.push(labelP('Customer Objection'));
    s.push(promptBox(sc.objection));
    s.push(labelP('Customer Context'));
    s.push(bodyP(sc.customerContext));
    s.push(labelP('Competitor Mentioned'));
    s.push(bodyP(sc.competitorMentioned));
    s.push(labelP('Suggested Approach'));
    s.push(bodyP(sc.suggestedApproach));
    s.push(divider());
  });

  // === 5. PROSPECT RESEARCH ===
  s.push(pb());
  s.push(heading1('5. Field Sales — Prospect Research Scenarios'));
  s.push(bodyP(`${PROSPECT_RESEARCH_SCENARIOS.length} prospect research prompts for different industries and client types.`));

  PROSPECT_RESEARCH_SCENARIOS.forEach((sc, i) => {
    s.push(heading3(`${i + 1}. ${sc.title}`));
    s.push(labelP('Category'));
    s.push(bodyP(sc.category));
    s.push(labelP('Product Focus'));
    s.push(bodyP(sc.productFocus));
    s.push(labelP('Customer Profile'));
    s.push(bodyP(sc.customerProfile));
    s.push(labelP('Meeting Context'));
    s.push(bodyP(sc.meetingContext));
    s.push(labelP('Research Prompt'));
    s.push(promptBox(sc.researchPrompt));
    s.push(divider());
  });

  // === 6. CLOSING SCENARIOS ===
  s.push(pb());
  s.push(heading1('6. Field Sales — Closing Strategy Scenarios'));
  s.push(bodyP(`${CLOSING_SCENARIOS.length} closing strategy prompts for different deal types and customer situations.`));

  CLOSING_SCENARIOS.forEach((sc, i) => {
    s.push(heading3(`${i + 1}. ${sc.title}`));
    s.push(labelP('Situation'));
    s.push(bodyP(sc.situation));
    s.push(labelP('Products'));
    s.push(bodyP(sc.products.join(', ')));
    s.push(labelP('Challenge'));
    s.push(bodyP(sc.challenge));
    s.push(labelP('Closing Prompt'));
    s.push(promptBox(sc.prompt));
    s.push(divider());
  });

  // === 7. ROLE-PLAY PERSONAS ===
  s.push(pb());
  s.push(heading1('7. Field Sales — Role-Play Personas'));
  s.push(bodyP(`${ROLE_PLAY_PERSONAS.length} customer personas for AI-powered role-play simulations.`));

  ROLE_PLAY_PERSONAS.forEach((p: any, i: number) => {
    s.push(heading3(`${i + 1}. ${p.name}`));
    s.push(labelP('Company'));
    s.push(bodyP(p.company));
    s.push(labelP('Industry'));
    s.push(bodyP(p.industry));
    s.push(labelP('Difficulty'));
    s.push(bodyP(p.difficulty));
    s.push(labelP('Product Interest'));
    s.push(bodyP(p.product_interest));
    s.push(labelP('Personality'));
    s.push(bodyP(p.personality));
    s.push(labelP('Objection Style'));
    s.push(bodyP(p.objection_style));
    s.push(labelP('Opening Line'));
    s.push(promptBox(p.opening));
    s.push(labelP('Hidden Triggers'));
    s.push(bodyP(p.hidden_triggers.join('; ')));
    s.push(divider());
  });

  // === 8. DEAL SCORER TEMPLATES ===
  s.push(pb());
  s.push(heading1('8. Field Sales — Deal Scorer Templates'));
  s.push(bodyP(`${DEAL_SCORER_TEMPLATES.length} deal analysis templates for AI-powered win probability scoring.`));

  DEAL_SCORER_TEMPLATES.forEach((t: any, i: number) => {
    s.push(heading3(`${i + 1}. ${t.label}`));
    s.push(labelP('Deal Template'));
    s.push(promptBox(t.template));
    s.push(divider());
  });

  // === 9. LOBBY MODE ===
  s.push(pb());
  s.push(heading1('9. Field Sales — Lobby Mode Scenarios'));
  s.push(bodyP(`${LOBBY_MODE_SCENARIOS.length - 1} pre-configured meeting prep scenarios for quick briefings.`));

  LOBBY_MODE_SCENARIOS.forEach((sc: any, i: number) => {
    if (sc.id === 'custom') return;
    s.push(heading3(`${i + 1}. ${sc.label}`));
    s.push(labelP('Industry'));
    s.push(bodyP(sc.industry));
    s.push(labelP('Company Type'));
    s.push(bodyP(sc.company_type));
    s.push(labelP('Product'));
    s.push(bodyP(sc.product));
    s.push(divider());
  });

  // === 10. INDUSTRY NEWS ===
  s.push(pb());
  s.push(heading1('10. Field Sales — Industry News Intelligence'));
  s.push(bodyP(`${INDUSTRY_NEWS_ITEMS.length} industry intelligence items with sales implications.`));

  INDUSTRY_NEWS_ITEMS.forEach((n: any, i: number) => {
    s.push(heading3(`${i + 1}. ${n.sector}`));
    s.push(labelP('Headline'));
    s.push(bodyP(n.headline));
    s.push(labelP('Sales Implication'));
    s.push(promptBox(n.implication));
    s.push(divider());
  });

  // === 11. FIELD SALES USE CASES ===
  s.push(pb());
  s.push(heading1('11. Field Sales — Use Cases & Sample Prompts'));
  s.push(bodyP(`${FIELD_SALES_USE_CASES.length} field sales use cases with sample prompts organized by sales lifecycle stage.`));

  FIELD_SALES_USE_CASES.forEach((uc, i) => {
    s.push(heading3(`${i + 1}. ${uc.title}`));
    s.push(labelP('Category'));
    s.push(bodyP(uc.category));
    s.push(labelP('Description'));
    s.push(bodyP(uc.description));
    s.push(labelP('Anchor Scenario'));
    s.push(bodyP(uc.anchorScenario));
    s.push(labelP('Sample Prompt'));
    s.push(promptBox(uc.samplePrompt));
    s.push(divider());
  });

  // === 12. LEADERSHIP USE CASES ===
  s.push(pb());
  s.push(heading1('12. Leadership — Use Cases & Sample Prompts'));
  s.push(bodyP(`${USE_CASES.length} leadership use cases across Sales, Product, Portfolio, Service, and cross-functional categories.`));

  USE_CASES.forEach((uc, i) => {
    s.push(heading3(`${i + 1}. ${uc.title}`));
    s.push(labelP('Category'));
    s.push(bodyP(uc.category));
    s.push(labelP('Audience'));
    s.push(bodyP(uc.audience.join(', ')));
    s.push(labelP('Coverage Level'));
    s.push(bodyP(uc.coverageLevel));
    s.push(labelP('Description'));
    s.push(bodyP(uc.description));
    s.push(labelP('Sample Prompt'));
    s.push(promptBox(uc.samplePrompt));
    s.push(divider());
  });

  // === 13. MYTHS VS REALITY ===
  s.push(pb());
  s.push(heading1('13. Leadership — Myths vs Reality'));
  s.push(bodyP('Common myths about GenAI in banking with evidence-based reality checks and practical takeaways.'));

  MYTHS_VS_REALITY.forEach((m, i) => {
    s.push(heading3(`Myth ${i + 1}: "${m.myth}"`));
    s.push(labelP('Reality'));
    s.push(bodyP(m.reality));
    s.push(labelP('Takeaway'));
    s.push(bodyP(m.takeaway));
    s.push(divider());
  });

  // === 14. OBJECTION SCENARIOS (ADVANCED) ===
  s.push(pb());
  s.push(heading1('14. Leadership — Objection Scenarios (Advanced)'));
  s.push(bodyP(`${OBJECTION_SCENARIOS.length} customer objection scenarios with multi-strategy responses.`));

  OBJECTION_SCENARIOS.forEach((sc, i) => {
    s.push(heading3(`${i + 1}. ${sc.category.toUpperCase()} Objection`));
    s.push(labelP('Objection'));
    s.push(promptBox(sc.objection));
    s.push(labelP('Customer Context'));
    s.push(bodyP(sc.customerContext));
    sc.strategies.forEach((st, j) => {
      s.push(labelP(`Strategy ${j + 1}: ${st.label}`));
      s.push(bodyP(st.response));
    });
    s.push(divider());
  });

  // === 15. HALLUCINATION EXAMPLES ===
  s.push(pb());
  s.push(heading1('15. Leadership — Hallucination Detection Examples'));
  s.push(bodyP(`${HALLUCINATION_EXAMPLES.length} examples of AI hallucinations in banking context with detection methods.`));

  HALLUCINATION_EXAMPLES.forEach((h, i) => {
    s.push(heading3(`Example ${i + 1}: ${h.title}`));
    s.push(labelP('AI Output (with hallucination)'));
    s.push(promptBox(h.aiOutput));
    s.push(labelP('Hallucination Identified'));
    s.push(bodyP(h.hallucination));
    s.push(labelP('Why It Happened'));
    s.push(bodyP(h.whyItHappened));
    s.push(labelP('How to Detect'));
    s.push(bodyP(h.howToDetect));
    s.push(labelP('Verification Rule'));
    s.push(bodyP(h.verificationRule));
    s.push(labelP('Correct Information'));
    s.push(bodyP(h.correctInfo));
    s.push(divider());
  });

  // === 16. HITL SCENARIOS ===
  s.push(pb());
  s.push(heading1('16. Leadership — Human-in-the-Loop Scenarios'));
  s.push(bodyP(`${HITL_SCENARIOS.length} scenarios demonstrating where human review is critical before AI output goes to customers.`));

  HITL_SCENARIOS.forEach((sc, i) => {
    s.push(heading3(`${i + 1}. ${sc.title}`));
    s.push(labelP('Context'));
    s.push(bodyP(sc.context));
    s.push(labelP('Approver Role'));
    s.push(bodyP(sc.approverRole));
    s.push(labelP('AI Draft Prompt'));
    s.push(promptBox(sc.aiDraftPrompt));
    s.push(labelP('Review Checkpoints'));
    sc.reviewCheckpoints.forEach(cp => {
      s.push(bodyP(`  • ${cp}`));
    });
    s.push(labelP('Risk if Skipped'));
    s.push(bodyP(sc.riskIfSkipped));
    s.push(divider());
  });

  // === 17. SYSTEM VS USER ===
  s.push(pb());
  s.push(heading1('17. Leadership — System vs User Prompt Examples'));
  s.push(bodyP(`${SYSTEM_VS_USER_EXAMPLES.length} examples showing how system prompts set guardrails and user prompts drive specific tasks.`));

  SYSTEM_VS_USER_EXAMPLES.forEach((ex, i) => {
    s.push(heading3(`${i + 1}. ${ex.title}`));
    s.push(labelP('Description'));
    s.push(bodyP(ex.description));
    s.push(labelP('System Prompt'));
    s.push(promptBox(ex.systemPrompt));
    s.push(labelP('System Purpose'));
    s.push(bodyP(ex.systemPurpose));
    s.push(labelP('User Prompt (Bad)'));
    s.push(promptBox(ex.userPromptBad));
    s.push(labelP('User Prompt (Good)'));
    s.push(promptBox(ex.userPromptGood));
    s.push(labelP('Output Difference'));
    s.push(bodyP(ex.outputDifference));
    s.push(divider());
  });

  // === 18. FACILITATION GUIDE ===
  s.push(pb());
  s.push(heading1('18. Facilitation Guide — Exercises & Prompts'));
  s.push(bodyP(`${FACILITATION_GUIDE.length} facilitation exercises with live prompts, pushback responses, and key takeaways.`));

  FACILITATION_GUIDE.forEach((fg, i) => {
    s.push(heading3(`${i + 1}. ${fg.title}`));
    s.push(labelP('Intent'));
    s.push(bodyP(fg.intent));
    s.push(labelP('Facilitation Tips'));
    fg.facilitationTips.forEach(tip => {
      s.push(bodyP(`  • ${tip}`));
    });
    if (fg.liveExercisePrompt) {
      s.push(labelP('Live Exercise Prompt'));
      s.push(promptBox(fg.liveExercisePrompt));
    }
    if (fg.pushbacks && fg.pushbacks.length > 0) {
      s.push(labelP('Common Pushbacks & Responses'));
      fg.pushbacks.forEach(pb => {
        s.push(bodyP(`  Q: ${pb.question}`));
        s.push(bodyP(`  A: ${pb.response}`));
      });
    }
    s.push(labelP('Key Takeaway'));
    s.push(bodyP(fg.keyTakeaway));
    s.push(divider());
  });

  // === 19. VOC SCENARIOS ===
  s.push(pb());
  s.push(heading1('19. VOC (Voice of Customer) Scenarios'));
  s.push(bodyP(`${VOC_SCENARIOS.length} customer voice scenarios for AI-powered sentiment analysis and response generation.`));

  VOC_SCENARIOS.forEach((v, i) => {
    s.push(heading3(`${i + 1}. ${v.title}`));
    s.push(labelP('Customer Message'));
    s.push(promptBox(v.customerMessage));
    s.push(labelP('Expected Analysis'));
    const ea = v.expectedAnalysis as any;
    if (ea) {
      s.push(bodyP(`  Pain Point: ${ea.painPoint || 'N/A'}`));
      s.push(bodyP(`  Urgency: ${ea.urgency || 'N/A'}`));
      s.push(bodyP(`  Resolution: ${ea.resolution || 'N/A'}`));
    }
    s.push(divider());
  });

  // === 20. BUILD VS BUY ===
  s.push(pb());
  s.push(heading1('20. Build vs Buy Decision Examples'));
  s.push(bodyP(`${BUILD_BUY_EXAMPLES.length} use cases with build vs buy decision framework for GenAI in banking.`));

  BUILD_BUY_EXAMPLES.forEach((b, i) => {
    s.push(heading3(`${i + 1}. ${b.useCase}`));
    s.push(labelP('Decision'));
    s.push(bodyP(b.decision));
    s.push(labelP('Data Sensitivity'));
    s.push(bodyP(b.dataSensitivity));
    s.push(labelP('Build Complexity'));
    s.push(bodyP(b.buildComplexity));
    s.push(labelP('Regulatory Readiness'));
    s.push(bodyP(b.regulatoryReady));
    s.push(labelP('Reasoning'));
    s.push(bodyP(b.reasoning));
    s.push(divider());
  });

  // === 21. 30-DAY PLAN ===
  s.push(pb());
  s.push(heading1('21. 30-Day GenAI Action Plan Prompts'));
  s.push(bodyP('Structured action plan for leaders to begin using GenAI in their daily workflow within 30 days.'));

  THIRTY_DAY_PLAN_TEMPLATE.forEach((week, i) => {
    s.push(heading2(`${week.week}: ${(week as any).theme || week.label}`));
    s.push(bodyP(week.description));
    week.prompts.forEach((p, j) => {
      s.push(labelP(`Prompt ${j + 1}`));
      s.push(promptBox(p));
    });
    s.push(labelP('Success Metric'));
    s.push(bodyP(week.successMetric));
    s.push(divider());
  });

  // FOOTER
  s.push(pb());
  s.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 2000 },
    children: [new TextRun({ text: 'End of Prompt Catalog', size: 28, bold: true, color: BLUE, font: 'Calibri' })],
  }));
  s.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 },
    children: [new TextRun({ text: 'HDFC Bank — Retail Assets Group | GenAI Playground', size: 20, color: GRAY, font: 'Calibri' })],
  }));
  s.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 },
    children: [new TextRun({ text: 'All data is synthetic. No real customer information.', size: 18, color: '999999', font: 'Calibri' })],
  }));

  // Stats
  let promptCount = 0;
  promptCount += LAB_EXPERIMENTS.reduce((c, e) => c + e.levels.length, 0);
  promptCount += PROMPT_LADDERS.reduce((c, l) => c + l.levels.length, 0);
  promptCount += FIELD_SALES_LAB_EXPERIMENTS.reduce((c, e) => c + e.levels.length + (e.anchorScenario ? 1 : 0), 0);
  promptCount += FIELD_OBJECTION_SCENARIOS.length;
  promptCount += PROSPECT_RESEARCH_SCENARIOS.length;
  promptCount += CLOSING_SCENARIOS.length;
  promptCount += ROLE_PLAY_PERSONAS.length;
  promptCount += DEAL_SCORER_TEMPLATES.length;
  promptCount += LOBBY_MODE_SCENARIOS.length;
  promptCount += INDUSTRY_NEWS_ITEMS.length;
  promptCount += FIELD_SALES_USE_CASES.length;
  promptCount += USE_CASES.length;
  promptCount += MYTHS_VS_REALITY.length;
  promptCount += OBJECTION_SCENARIOS.length;
  promptCount += HALLUCINATION_EXAMPLES.length;
  promptCount += HITL_SCENARIOS.length;
  promptCount += SYSTEM_VS_USER_EXAMPLES.length;
  promptCount += FACILITATION_GUIDE.length;
  promptCount += VOC_SCENARIOS.length;
  promptCount += BUILD_BUY_EXAMPLES.length;
  promptCount += THIRTY_DAY_PLAN_TEMPLATE.reduce((c, w) => c + w.prompts.length, 0);

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 20 } },
      },
    },
    sections: [{ children: s }],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(__dirname, '..', 'HDFC-Prompt-Catalog.docx');
  fs.writeFileSync(outPath, buffer);
  console.log(`Word document generated: ${outPath}`);
  console.log(`Size: ${(buffer.length / 1024).toFixed(1)} KB`);
  console.log(`Total prompt items cataloged: ${promptCount}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
