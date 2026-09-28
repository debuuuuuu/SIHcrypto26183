import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  INVESTIGATION_TOOL_DEFINITIONS,
  executeInvestigationTool,
} from '@/lib/investigationTools';
import {
  DEMO_WALLETS,
  DEMO_TRANSACTIONS,
  DEMO_EVIDENCE,
  DEMO_DETECTIONS,
  DEMO_CASE,
} from '@/data/demoInvestigation';
import { AIResponse, ConversationMessage, FocusAction } from '@/types/ai';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const MAX_TOOL_CALLS = 12;

const SYSTEM_PROMPT = `You are the MONOMER AI Investigator.

You analyze a cryptocurrency fraud investigation using only structured information returned by MONOMER investigation tools.

Case ID: INV-DEMO-2026-001
Suspect Wallet ID: suspect (Address: 0x7A92d044e1837bF2D)

INVESTIGATION RULES:
1. Never invent transactions, wallets, addresses, blockchain events, evidence, risk scores, or criminal identities.
2. If information is not available through the tools, explicitly state that the MONOMER investigation dataset does not contain enough verified information to answer.
3. Reference verified identifiers directly in your explanation:
   - Evidence IDs: EVD-001, EVD-002, EVD-003, EVD-004, EVD-005, EVD-006
   - Transaction IDs: TX-DEMO-001 through TX-DEMO-008
   - Wallets: suspect, walletB, walletC, walletD, bridge, exchange
4. Treat tool results as the authoritative ground truth.
5. Only invoke functions that are declared in the provided tools list. Do NOT invent fake tool names (such as "JSON").
6. Call ONLY the 1 to 2 tools directly relevant to the user query (e.g. get_wallet_transactions for fund tracking, get_cross_chain_events for bridge activity, get_risk_assessment for risk score). Do not query all tools at once.
7. Once tool data is returned, immediately synthesize and output your concise, professional, evidence-grounded answer.`;

// -----------------------------------------------------------------------------
// Server-Side Evidence & Entity Sanitizer (Section 21)
// -----------------------------------------------------------------------------
function validateAndSanitizeResponse(
  raw: any,
  mode: 'live' | 'demo',
  toolsUsed: string[],
  agentSteps: string[]
): AIResponse {
  // Validate evidence IDs
  const validEvidence = new Set(DEMO_EVIDENCE.map((e) => e.id));
  const cleanEvidenceIds = Array.isArray(raw.evidenceIds)
    ? raw.evidenceIds.filter((id: string) => validEvidence.has(id))
    : [];

  // Validate transaction IDs
  const validTxs = new Set(DEMO_TRANSACTIONS.map((t) => t.id));
  const cleanTxIds = Array.isArray(raw.transactionIds)
    ? raw.transactionIds.filter((id: string) => validTxs.has(id))
    : [];

  // Validate wallet IDs
  const validWallets = new Set(Object.keys(DEMO_WALLETS));
  const cleanWalletIds = Array.isArray(raw.walletIds)
    ? raw.walletIds.filter((id: string) => validWallets.has(id))
    : [];

  // Ensure every cited transaction's source and target nodes are in cleanWalletIds
  for (const txId of cleanTxIds) {
    const tx = DEMO_TRANSACTIONS.find((t) => t.id === txId);
    if (tx) {
      if (!cleanWalletIds.includes(tx.from)) cleanWalletIds.push(tx.from);
      if (!cleanWalletIds.includes(tx.to)) cleanWalletIds.push(tx.to);
    }
  }

  // Ensure that connecting edges between cited wallets are included for flow continuity
  for (const tx of DEMO_TRANSACTIONS) {
    if (cleanWalletIds.includes(tx.from) && cleanWalletIds.includes(tx.to)) {
      if (!cleanTxIds.includes(tx.id)) {
        cleanTxIds.push(tx.id);
      }
    }
  }

  // Validate focus action
  let cleanFocusAction: FocusAction | null = null;
  if (raw.focusAction && typeof raw.focusAction === 'object') {
    const { type, target } = raw.focusAction;
    if (type === 'focus_wallet' && validWallets.has(target)) {
      cleanFocusAction = { type, target };
    } else if (type === 'focus_transaction' && validTxs.has(target)) {
      cleanFocusAction = { type, target };
    } else if (
      type === 'focus_detection' &&
      DEMO_DETECTIONS.some((d) => d.id === target)
    ) {
      cleanFocusAction = { type, target };
    }
  }

  return {
    mode,
    answer:
      typeof raw.answer === 'string' && raw.answer.trim().length > 0
        ? raw.answer
        : 'The investigation dataset does not contain sufficient verified evidence to answer this question.',
    evidenceIds: cleanEvidenceIds,
    transactionIds: cleanTxIds,
    walletIds: cleanWalletIds,
    toolsUsed: Array.from(new Set(toolsUsed)),
    agentSteps: agentSteps.length > 0 ? agentSteps : ['Completed evidence analysis'],
    focusAction: cleanFocusAction,
    confidence: raw.confidence === 'low' || raw.confidence === 'medium' ? raw.confidence : 'high',
  };
}

// -----------------------------------------------------------------------------
// Fallback / Demo AI Mode Engine (Sections 22 & 23)
// -----------------------------------------------------------------------------
function executeFallbackInvestigation(
  query: string,
  history: ConversationMessage[] = []
): AIResponse {
  const normalized = query.toLowerCase().trim();
  const toolsUsed: string[] = [];
  const agentSteps: string[] = [
    'Understanding investigation query',
    'Identifying required evidence sources',
  ];

  // Check multi-turn context: Did user ask about "second wallet"?
  const isSecondWalletQuery =
    normalized.includes('second wallet') ||
    normalized.includes('second address') ||
    normalized.includes('wallet c');

  // 1. Where did the money go? / Flow distribution
  if (
    normalized.includes('where did the money go') ||
    normalized.includes('follow the funds') ||
    normalized.includes('what happened to the $2,000') ||
    normalized.includes('how was the money distributed') ||
    normalized.includes('transaction flow') ||
    (normalized.includes('money') && normalized.includes('go'))
  ) {
    toolsUsed.push('get_wallet_transactions', 'calculate_amount_percentage', 'get_cross_chain_events');
    agentSteps.push(
      'Querying suspect wallet transactions',
      'Calculating fund allocation percentages',
      'Tracing downstream cross-chain movement',
      'Correlating transaction evidence',
      'Preparing evidence-grounded answer'
    );

    const answer =
      `The $2,000 USDT received by the suspect wallet was split across three outgoing transfers within 24 seconds:\n\n` +
      `• $800 USDT (40.0%) → Wallet B (0x82BC...41A)\n` +
      `• $700 USDT (35.0%) → Wallet C (0x19DE...7C2)\n` +
      `• $500 USDT (25.0%) → Wallet D (0x44AF...91B)\n\n` +
      `Wallet C subsequently routed its $700 through the Demo Bridge to Polygon, where approximately $698 net arrived at 0xP0LY...82A before being deposited into Demo Exchange. Wallet B forwarded $760 onward on Ethereum.`;

    return validateAndSanitizeResponse(
      {
        answer,
        evidenceIds: ['EVD-001', 'EVD-002', 'EVD-003', 'EVD-004', 'EVD-005'],
        transactionIds: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-004', 'TX-DEMO-005', 'TX-DEMO-006'],
        walletIds: ['suspect', 'walletB', 'walletC', 'walletD', 'bridge', 'polygonWallet'],
        focusAction: { type: 'focus_wallet', target: 'suspect' },
        confidence: 'high',
      },
      'demo',
      toolsUsed,
      agentSteps
    );
  }

  // 2. Second wallet / Wallet C investigation
  if (isSecondWalletQuery || normalized.includes('wallet c')) {
    toolsUsed.push('get_wallet', 'get_wallet_transactions', 'get_cross_chain_events', 'get_evidence_for_wallet');
    agentSteps.push(
      'Resolving target: Wallet C (second intermediary)',
      'Retrieving Wallet C transactions',
      'Querying cross-chain bridge events',
      'Retrieving sealed evidence records',
      'Correlating behavioral patterns',
      'Preparing answer'
    );

    const answer =
      `Wallet C (0x19DEf83910c41b7C2) received $700 USDT (35% of stolen funds) from the suspect at 10:33:29 UTC (TX-DEMO-003).\n\n` +
      `93 seconds later at 10:35:02 UTC, Wallet C deposited the entire $700 into the Demo Bridge contract (TX-DEMO-005) to initiate a cross-chain transfer to Polygon PoS.\n\n` +
      `This makes Wallet C the critical bridge feeder entity in the money laundering flow, connecting the Ethereum fan-out to Layer-2 liquidation.`;

    return validateAndSanitizeResponse(
      {
        answer,
        evidenceIds: ['EVD-003', 'EVD-004'],
        transactionIds: ['TX-DEMO-003', 'TX-DEMO-005', 'TX-DEMO-006'],
        walletIds: ['walletC', 'bridge', 'polygonWallet'],
        focusAction: { type: 'focus_wallet', target: 'walletC' },
        confidence: 'high',
      },
      'demo',
      toolsUsed,
      agentSteps
    );
  }

  // 3. Wallet B
  if (normalized.includes('wallet b')) {
    toolsUsed.push('get_wallet', 'get_wallet_transactions', 'get_evidence_for_wallet');
    agentSteps.push(
      'Resolving target: Wallet B',
      'Retrieving Wallet B transactions',
      'Analyzing onward layering transfer',
      'Preparing answer'
    );

    const answer =
      `Wallet B (0x82BCf419081249A) received the largest single allocation of $800 USDT (40%) from the suspect at 10:33:17 UTC (TX-DEMO-002).\n\n` +
      `At 10:37:45 UTC (4 minutes later), Wallet B forwarded $760 USDT downstream to 0xDOWN...a99 (TX-DEMO-007), retaining $40 in simulated gas reserves. This triggered the Rapid Movement and Layering detections.`;

    return validateAndSanitizeResponse(
      {
        answer,
        evidenceIds: ['EVD-002'],
        transactionIds: ['TX-DEMO-002', 'TX-DEMO-007'],
        walletIds: ['walletB', 'suspect'],
        focusAction: { type: 'focus_wallet', target: 'walletB' },
        confidence: 'high',
      },
      'demo',
      toolsUsed,
      agentSteps
    );
  }

  // 4. Cross-chain movement
  if (
    normalized.includes('cross-chain') ||
    normalized.includes('cross chain') ||
    normalized.includes('bridge') ||
    normalized.includes('polygon') ||
    normalized.includes('leave ethereum')
  ) {
    toolsUsed.push('get_cross_chain_events', 'get_evidence', 'focus_transaction');
    agentSteps.push(
      'Querying cross-chain bridge events',
      'Retrieving deposit and claim transaction pair',
      'Calculating cross-chain transit latency',
      'Isolating cross-chain flow',
      'Preparing answer'
    );

    const answer =
      `Yes, funds crossed from Ethereum to Polygon PoS via Demo Bridge:\n\n` +
      `• Source Deposit: Wallet C sent $700 USDT to Demo Bridge on Ethereum at 10:35:02 UTC (TX-DEMO-005).\n` +
      `• Destination Claim: $698 net USDT ($2 fee deducted) was minted to Polygon Wallet (0xP0LY...82A) at 10:36:11 UTC (TX-DEMO-006).\n` +
      `• Transit Interval: 69 seconds.\n` +
      `• Cross-Chain Association Confidence: 89%.`;

    return validateAndSanitizeResponse(
      {
        answer,
        evidenceIds: ['EVD-004'],
        transactionIds: ['TX-DEMO-005', 'TX-DEMO-006'],
        walletIds: ['walletC', 'bridge', 'polygonWallet'],
        focusAction: { type: 'focus_transaction', target: 'TX-DEMO-005' },
        confidence: 'high',
      },
      'demo',
      toolsUsed,
      agentSteps
    );
  }

  // 5. Why is this case high risk / risk assessment
  if (
    normalized.includes('why is the risk 78') ||
    normalized.includes('why is this case high risk') ||
    normalized.includes('risk assessment') ||
    normalized.includes('risk signals') ||
    normalized.includes('risk score') ||
    normalized.includes('risk 78')
  ) {
    toolsUsed.push('get_risk_assessment', 'get_risk_signals');
    agentSteps.push(
      'Querying official case risk assessment',
      'Retrieving weighted risk signal breakdown',
      'Analyzing signal contributions',
      'Preparing answer'
    );

    const answer =
      `The official MONOMER Risk Assessment scores this case at 78 / 100 (HIGH RISK). The calculated breakdown consists of five weighted behavioral signals:\n\n` +
      `1. Rapid Movement (+22 / 25): Complete fund disbursement occurred within 135 seconds of receipt.\n` +
      `2. Fan-Out Dispersal (+18 / 20): Systematic 3-way split from one parent wallet into Wallets B, C, and D.\n` +
      `3. Cross-Chain Traversal (+15 / 20): Bridging across networks (Ethereum → Polygon) via Demo Bridge.\n` +
      `4. Exchange Liquidation (+13 / 15): Direct deposit into a centralized exchange hotwallet.\n` +
      `5. Entity Clustering (+10 / 20): Common parent funding patterns across intermediary nodes.`;

    return validateAndSanitizeResponse(
      {
        answer,
        evidenceIds: ['EVD-002', 'EVD-003', 'EVD-004', 'EVD-005'],
        transactionIds: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-005', 'TX-DEMO-008'],
        walletIds: ['suspect', 'walletB', 'walletC', 'exchange'],
        focusAction: { type: 'focus_wallet', target: 'suspect' },
        confidence: 'high',
      },
      'demo',
      toolsUsed,
      agentSteps
    );
  }

  // 6. Suspicious patterns detected
  if (
    normalized.includes('pattern') ||
    normalized.includes('detection') ||
    normalized.includes('fan-out') ||
    normalized.includes('fan out') ||
    normalized.includes('rapid movement')
  ) {
    toolsUsed.push('get_detection_patterns', 'get_evidence_for_pattern');
    agentSteps.push(
      'Retrieving verified behavioral pattern detections',
      'Querying confidence ratings and affected graph edges',
      'Correlating detection evidence',
      'Preparing answer'
    );

    const answer =
      `MONOMER detected 5 verified behavioral patterns in this case:\n\n` +
      `01. Rapid Movement (94% confidence) — 100% of incoming funds forwarded within 2.2 minutes.\n` +
      `02. Fan-Out Pattern (91% confidence) — Atomized 3-way split from suspect to Wallets B, C, and D.\n` +
      `03. Cross-Chain Hop (89% confidence) — Ethereum to Polygon transfer via Demo Bridge.\n` +
      `04. Layering Behavior (87% confidence) — Secondary downstream forward from Wallet B.\n` +
      `05. Exchange Liquidation (96% confidence) — Final deposit into centralized exchange hotwallet.`;

    return validateAndSanitizeResponse(
      {
        answer,
        evidenceIds: ['EVD-002', 'EVD-003', 'EVD-004', 'EVD-005', 'EVD-006'],
        transactionIds: ['TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-005', 'TX-DEMO-007', 'TX-DEMO-008'],
        walletIds: ['suspect', 'walletB', 'walletC', 'exchange'],
        focusAction: { type: 'focus_detection', target: 'det-002' },
        confidence: 'high',
      },
      'demo',
      toolsUsed,
      agentSteps
    );
  }

  // 7. Evidence
  if (
    normalized.includes('evidence') ||
    normalized.includes('proof') ||
    normalized.includes('court') ||
    normalized.includes('artifacts')
  ) {
    toolsUsed.push('get_investigation_summary', 'get_evidence');
    agentSteps.push(
      'Querying sealed evidence registry',
      'Auditing cryptographic hashes and proof types',
      'Preparing evidence summary'
    );

    const answer =
      `The MONOMER evidence registry contains 6 sealed forensic records supporting this investigation:\n\n` +
      `• EVD-001: Initial victim fraudulent transfer ($2,000 USDT)\n` +
      `• EVD-002: Rapid fan-out transaction burst (TX-DEMO-002 to 004)\n` +
      `• EVD-003: Wallet C bridge feeder deposit ($700 USDT)\n` +
      `• EVD-004: Cross-chain bridge event pairing (Ethereum ↔ Polygon)\n` +
      `• EVD-005: Exchange deposit hotwallet intake ($680 USDT)\n` +
      `• EVD-006: Cryptographic proof of entity clustering and common gas origins`;

    return validateAndSanitizeResponse(
      {
        answer,
        evidenceIds: ['EVD-001', 'EVD-002', 'EVD-003', 'EVD-004', 'EVD-005', 'EVD-006'],
        transactionIds: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-005', 'TX-DEMO-008'],
        walletIds: ['suspect', 'walletC', 'polygonWallet', 'exchange'],
        focusAction: null,
        confidence: 'high',
      },
      'demo',
      toolsUsed,
      agentSteps
    );
  }

  // 8. Unsupported / Real-world identity query (Section 40 Test 6)
  if (
    normalized.includes('who owns') ||
    normalized.includes('real life') ||
    normalized.includes('real person') ||
    normalized.includes('identity') ||
    normalized.includes('criminal record') ||
    normalized.includes('name of the suspect')
  ) {
    toolsUsed.push('get_wallet');
    agentSteps.push(
      'Querying wallet profile records',
      'Checking for verified off-chain KYC identity records',
      'Evaluating data availability constraints',
      'Preparing answer'
    );

    const answer =
      `The current MONOMER investigation dataset does not contain enough verified information to identify the real-world owner or legal identity of this wallet.\n\n` +
      `On-chain intelligence confirms pseudonym 0x7A92d044e1837bF2D executed fraudulent fund dispersal, but identity resolution requires an official subpoena served to the destination exchange (0xEXCH...401, TX-DEMO-008).`;

    return validateAndSanitizeResponse(
      {
        answer,
        evidenceIds: ['EVD-005'],
        transactionIds: ['TX-DEMO-008'],
        walletIds: ['suspect', 'exchange'],
        focusAction: null,
        confidence: 'high',
      },
      'demo',
      toolsUsed,
      agentSteps
    );
  }

  // 9. General Summary / Briefing
  toolsUsed.push('get_investigation_summary', 'get_timeline');
  agentSteps.push(
    'Retrieving case summary and timeline',
    'Correlating primary analytical findings',
    'Preparing executive briefing'
  );

  const answer =
    `Case ${DEMO_CASE.caseId} (${DEMO_CASE.caseName}) tracks the fraudulent transfer of $2,000 USDT originating from Victim 0xVIC7...cf1 at 10:31:04 UTC.\n\n` +
    `Within 24 seconds, suspect wallet 0x7A92...F2D atomized the sum into Wallets B ($800), C ($700), and D ($500). Wallet C bridged $700 onto Polygon PoS, reaching the destination exchange deposit address at 10:41:52 UTC.\n\n` +
    `The overall investigation carries a 78/100 HIGH RISK score across 5 confirmed laundering patterns and 6 sealed forensic evidence records.`;

  return validateAndSanitizeResponse(
    {
      answer,
      evidenceIds: ['EVD-001', 'EVD-002', 'EVD-004', 'EVD-005'],
      transactionIds: ['TX-DEMO-001', 'TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-005', 'TX-DEMO-008'],
      walletIds: ['victim', 'suspect', 'walletB', 'walletC', 'exchange'],
      focusAction: { type: 'focus_wallet', target: 'suspect' },
      confidence: 'high',
    },
    'demo',
    toolsUsed,
    agentSteps
  );
}

// -----------------------------------------------------------------------------
// POST Handler
// -----------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      try {
        const text = await req.text();
        body = JSON.parse(text);
      } catch {
        body = {};
      }
    }

    const query: string = (body?.query || '').trim();
    const conversationHistory: ConversationMessage[] = Array.isArray(body?.conversationHistory)
      ? body.conversationHistory
      : [];

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required.' },
        { status: 400 }
      );
    }

    const apiKey = (process.env.LLM_API_KEY || process.env.OPENAI_API_KEY || '').trim();
    const model = process.env.LLM_MODEL || 'gpt-4o-mini';
    const baseURL = process.env.LLM_BASE_URL || 'https://api.openai.com/v1';

    // If no API key configured, run deterministic fallback demo mode immediately
    if (!apiKey) {
      const fallbackResponse = executeFallbackInvestigation(query, conversationHistory);
      return NextResponse.json(fallbackResponse);
    }

    // Live AI Mode with real LLM tool loop
    try {
      const openai = new OpenAI({
        apiKey,
        baseURL,
        timeout: 30000,
        maxRetries: 1,
      });

      const toolsUsed: string[] = [];
      const agentSteps: string[] = [
        'Understanding investigation query',
        'Identifying required investigation tools',
      ];

      // Build conversation messages for OpenAI
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: SYSTEM_PROMPT },
      ];

      // Append limited prior history (up to last 6 turns)
      const recentHistory = conversationHistory.slice(-6);
      for (const item of recentHistory) {
        if (item.sender === 'user') {
          messages.push({ role: 'user', content: item.content });
        } else if (item.sender === 'assistant') {
          messages.push({ role: 'assistant', content: item.content });
        }
      }

      // Add current query
      messages.push({ role: 'user', content: query });

      let toolCallsCount = 0;
      let finalContent = '';

      // Tool Calling Execution Loop
      while (toolCallsCount < MAX_TOOL_CALLS) {
        const response = await openai.chat.completions.create({
          model,
          messages,
          tools: INVESTIGATION_TOOL_DEFINITIONS as any,
          tool_choice: 'auto',
          temperature: 0.1,
        });

        const choice = response.choices[0];
        if (!choice) break;

        const assistantMsg = choice.message;
        messages.push(assistantMsg);

        // If the model produced tool calls, execute them
        if (assistantMsg.tool_calls && assistantMsg.tool_calls.length > 0) {
          for (const tc of assistantMsg.tool_calls) {
            toolCallsCount++;
            if (tc.type !== 'function') continue;
            const functionName = tc.function.name;
            let args: Record<string, any> = {};
            try {
              args = JSON.parse(tc.function.arguments || '{}');
            } catch {
              args = {};
            }

            toolsUsed.push(functionName);

            // Record observable agent activity step
            if (functionName === 'get_wallet') {
              agentSteps.push(`Querying wallet: ${args.walletId || 'suspect'}`);
            } else if (functionName === 'get_wallet_transactions') {
              agentSteps.push(`Retrieving transactions for: ${args.walletId || 'suspect'}`);
            } else if (functionName === 'get_cross_chain_events') {
              agentSteps.push('Retrieving cross-chain bridge events');
            } else if (functionName === 'get_risk_assessment' || functionName === 'get_risk_signals') {
              agentSteps.push('Retrieving official risk score breakdown');
            } else if (functionName === 'get_detection_patterns' || functionName === 'get_detection') {
              agentSteps.push('Retrieving behavioral pattern detections');
            } else if (functionName.startsWith('get_evidence')) {
              agentSteps.push('Correlating forensic evidence records');
            } else {
              agentSteps.push(`Executed tool: ${functionName}`);
            }

            // Execute local deterministic tool
            const toolResult = executeInvestigationTool(functionName, args);

            // Append tool response
            messages.push({
              role: 'tool',
              tool_call_id: tc.id,
              content: JSON.stringify(toolResult),
            });
          }

          if (assistantMsg.content) {
            finalContent = assistantMsg.content;
          }
        } else {
          // Model finished tool calling and produced final answer
          finalContent = assistantMsg.content || '';
          agentSteps.push('Synthesizing evidence-grounded findings');
          break;
        }
      }

      // If tools were called but the model has not yet synthesized its final text, request the synthesis explicitly
      if (!finalContent || finalContent.trim().length === 0) {
        try {
          const synthesisResp = await openai.chat.completions.create({
            model,
            messages,
            tool_choice: 'none',
            temperature: 0.1,
          });
          finalContent = synthesisResp.choices[0]?.message?.content || '';
          agentSteps.push('Synthesizing evidence-grounded findings');
        } catch (synthErr) {
          console.warn('[MONOMER AI Synthesis Warning]:', synthErr);
        }
      }

      // Parse JSON from final response or treat as natural language text
      let parsedResponse: any = null;
      try {
        let cleaned = finalContent.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```[a-z]*\s*/i, '').replace(/\s*```$/, '');
        }
        parsedResponse = JSON.parse(cleaned);
      } catch {
        parsedResponse = {
          answer: finalContent || 'Analysis completed with verified evidence records.',
        };
      }

      // Ensure answer text is clean and normalize unicode dashes to standard ASCII hyphens
      let answerText = typeof parsedResponse.answer === 'string' ? parsedResponse.answer : finalContent;
      answerText = answerText.replace(/[\u2010-\u2015]/g, '-');
      const combinedText = `${answerText} ${query} ${JSON.stringify(parsedResponse)}`.replace(/[\u2010-\u2015]/g, '-');

      // Extract Evidence IDs (e.g. EVD-001)
      const evMatches = combinedText.match(/EVD-00[1-6]/g) || [];
      const extractedEvidence = Array.from(
        new Set([...(Array.isArray(parsedResponse.evidenceIds) ? parsedResponse.evidenceIds : []), ...evMatches])
      );

      // Extract Transaction IDs (e.g. TX-DEMO-001)
      const txMatches = combinedText.match(/TX-DEMO-00[1-8]/g) || [];
      const extractedTxs = Array.from(
        new Set([...(Array.isArray(parsedResponse.transactionIds) ? parsedResponse.transactionIds : []), ...txMatches])
      );

      // Extract Wallet IDs
      const walletMatches: string[] = [];
      if (/suspect|0x7A92/i.test(combinedText)) walletMatches.push('suspect');
      if (/walletB|0x82BC/i.test(combinedText)) walletMatches.push('walletB');
      if (/walletC|0x19DE/i.test(combinedText)) walletMatches.push('walletC');
      if (/walletD|0x44AF/i.test(combinedText)) walletMatches.push('walletD');
      if (/bridge|0xP0LY/i.test(combinedText)) walletMatches.push('bridge');
      if (/exchange|0xEXCH/i.test(combinedText)) walletMatches.push('exchange');
      const extractedWallets = Array.from(
        new Set([...(Array.isArray(parsedResponse.walletIds) ? parsedResponse.walletIds : []), ...walletMatches])
      );

      // Cross-correlate extracted transactions and wallets to verified evidence in DEMO_EVIDENCE
      for (const ev of DEMO_EVIDENCE) {
        const matchesTx = Boolean(ev.sourceTxId && extractedTxs.includes(ev.sourceTxId));
        const matchesWallet = Boolean(
          ev.relatedEntities?.some((entity) =>
            extractedWallets.some((w) => {
              if (w === 'suspect') return false;
              const walletObj = DEMO_WALLETS[w];
              return (
                entity.toLowerCase().includes(w.toLowerCase()) ||
                (walletObj && entity.toLowerCase().includes(walletObj.address.toLowerCase()))
              );
            })
          )
        );
        if (matchesTx || matchesWallet) {
          if (!extractedEvidence.includes(ev.id)) {
            extractedEvidence.push(ev.id);
          }
        }
      }

      // Extract or infer Focus Action
      let deducedFocusAction = parsedResponse.focusAction || null;
      if (!deducedFocusAction) {
        if (/walletC/i.test(query) || (extractedWallets.includes('walletC') && !extractedWallets.includes('walletB'))) {
          deducedFocusAction = { type: 'focus_wallet', target: 'walletC' };
        } else if (/walletB/i.test(query) || /second wallet/i.test(query) || (extractedWallets.includes('walletB') && !extractedWallets.includes('walletC'))) {
          deducedFocusAction = { type: 'focus_wallet', target: 'walletB' };
        } else if (/walletD/i.test(query)) {
          deducedFocusAction = { type: 'focus_wallet', target: 'walletD' };
        } else if (/cross-chain|bridge/i.test(query) && extractedWallets.includes('walletC')) {
          deducedFocusAction = { type: 'focus_wallet', target: 'walletC' };
        }
      }

      parsedResponse.answer = answerText;
      parsedResponse.evidenceIds = extractedEvidence;
      parsedResponse.transactionIds = extractedTxs;
      parsedResponse.walletIds = extractedWallets;
      parsedResponse.focusAction = deducedFocusAction;

      const validated = validateAndSanitizeResponse(
        parsedResponse,
        'live',
        toolsUsed,
        agentSteps
      );

      return NextResponse.json(validated);
    } catch (liveError: any) {
      console.error('[MONOMER AI Live Error]:', liveError?.message || liveError);
      // Fallback seamlessly to deterministic demo mode
      const fallbackResponse = executeFallbackInvestigation(query, conversationHistory);
      return NextResponse.json(fallbackResponse);
    }
  } catch (err: any) {
    console.error('[MONOMER AI General Error]:', err);
    return NextResponse.json(
      {
        error: 'MONOMER AI is temporarily unavailable. The investigation data remains available through the dashboard.',
      },
      { status: 500 }
    );
  }
}
