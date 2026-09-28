'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  RotateCcw,
  Copy,
  Check,
  Eye,
  Bot,
  User,
  ChevronDown,
  ChevronRight,
  Terminal,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  AlertCircle,
  Clock,
  CheckCircle2,
  CircleDot,
} from 'lucide-react';
import { AIResponse, AIStatus, ConversationMessage, FocusAction } from '@/types/ai';
import { InvestigationMarkdown } from './InvestigationMarkdown';

interface ExtendedAiMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  mode?: 'live' | 'demo';
  evidenceIds?: string[];
  transactionIds?: string[];
  walletIds?: string[];
  toolsUsed?: string[];
  agentSteps?: string[];
  focusAction?: FocusAction | null;
  isError?: boolean;
}

interface AiAssistantPanelProps {
  onHighlightFlow?: (nodes: string[], edges: string[]) => void;
  onFocusTab?: (tab: string) => void;
  onSelectWallet?: (walletId: string) => void;
  onSelectTransaction?: (txId: string) => void;
}

const SUGGESTED_QUERIES = [
  'Where did the money go?',
  'Why is Wallet C suspicious?',
  'Show me the cross-chain movement.',
  'What happened after the suspect received the money?',
  'Why is this case high risk?',
  'Show me the strongest evidence.',
  'Explain the transaction flow.',
  'What happened to the second wallet?',
];

export const AiAssistantPanel: React.FC<AiAssistantPanelProps> = ({
  onHighlightFlow,
  onFocusTab,
  onSelectWallet,
  onSelectTransaction,
}) => {
  const [messages, setMessages] = useState<ExtendedAiMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      timestamp: '10:42:00 UTC',
      content:
        'MONOMER AI Investigator initialized. I operate as an evidence-grounded agent with direct access to MONOMER forensic records, transaction graphs, cross-chain bridge logs, and risk engines. Select a suggested query below or enter your question to begin.',
      toolsUsed: ['init_investigation_layer'],
      agentSteps: [
        'Initialized investigation tool layer',
        'Loaded forensic case INV-DEMO-2026-001',
        'Ready for investigator queries',
      ],
      mode: 'live',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<AIStatus>({ mode: 'demo', model: 'gpt-4o-mini' });
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check AI service status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch('/api/ai/status');
        if (res.ok) {
          const data: AIStatus = await res.json();
          setAiStatus(data);
        }
      } catch (err) {
        console.warn('Could not fetch AI status, running in Demo AI Mode', err);
      }
    }
    checkStatus();
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (queryText: string) => {
    const text = queryText.trim();
    if (!text || isLoading) return;

    const userMessageId = `usr-${Date.now()}`;
    const userMsg: ExtendedAiMessage = {
      id: userMessageId,
      sender: 'user',
      timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history for multi-turn contextual memory
      const conversationHistory: ConversationMessage[] = messages
        .filter((m) => !m.isError)
        .map((m) => ({
          sender: m.sender,
          content: m.content,
        }));

      const response = await fetch('/api/ai/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: AIResponse = await response.json();

      const assistantMsgId = `asst-${Date.now()}`;
      const assistantMsg: ExtendedAiMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        content: data.answer,
        mode: data.mode,
        evidenceIds: data.evidenceIds || [],
        transactionIds: data.transactionIds || [],
        walletIds: data.walletIds || [],
        toolsUsed: data.toolsUsed || [],
        agentSteps: data.agentSteps || [],
        focusAction: data.focusAction,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setExpandedActivityId(assistantMsgId);

      // Execute returned focusAction or highlight flow
      if (data.focusAction) {
        if (data.focusAction.type === 'focus_wallet' && onSelectWallet) {
          onSelectWallet(data.focusAction.target);
        } else if (data.focusAction.type === 'focus_transaction' && onSelectTransaction) {
          onSelectTransaction(data.focusAction.target);
        }
      }

      // Flow highlighting is available on-demand via the 'Highlight Affected Flow on Graph' button below the message.
    } catch (err: any) {
      console.error('Investigation error:', err);
      const errorMsg: ExtendedAiMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        content:
          'MONOMER AI is temporarily unavailable. The investigation data remains available through the dashboard.',
        isError: true,
        mode: 'demo',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'msg-init',
        sender: 'assistant',
        timestamp: '10:42:00 UTC',
        content:
          'Session cleared. MONOMER AI Investigator is ready. Ask any natural-language question about this case or select a query above.',
        toolsUsed: ['init_investigation_layer'],
        agentSteps: ['Session reset', 'Awaiting investigator query'],
        mode: aiStatus.mode,
      },
    ]);
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a] text-white p-5 overflow-hidden select-none font-sans">
      {/* Top Header with Mode Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222222] gap-3 mb-4 shrink-0">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="text-[10px] font-mono text-[#888888] uppercase tracking-wider">
              AI INVESTIGATOR
            </span>
            <span className="text-[#444444]">&bull;</span>

            {/* Live vs Demo Badge */}
            {aiStatus.mode === 'live' ? (
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-sm bg-[#ffffff] text-[#000000] text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#000000] animate-pulse" />
                <span>LIVE AI INVESTIGATOR</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-sm bg-[#1a1a1a] border border-[#333333] text-[#cccccc] text-[10px] font-mono font-medium uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#888888]" />
                <span>DEMO AI MODE</span>
              </span>
            )}
          </div>

          <h2 className="text-lg font-bold font-sans text-white tracking-tight mt-1">
            Evidence-Grounded Investigation Agent
          </h2>
          <p className="text-xs text-[#888888] font-normal">
            Autonomous tool-calling over Case INV-DEMO-2026-001 forensic records and verified ledger states
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleReset}
            className="text-xs font-mono text-[#888888] hover:text-white border border-[#2a2a2a] hover:border-[#444444] px-2.5 py-1.5 rounded-sm transition flex items-center space-x-1.5 cursor-pointer"
            title="Clear conversation history"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear Session</span>
          </button>
        </div>
      </div>

      {/* Suggested Questions Grid */}
      <div className="mb-4 shrink-0 space-y-1.5">
        <span className="text-[10px] font-mono text-[#777777] uppercase block font-semibold tracking-wider">
          SUGGESTED INVESTIGATION QUERIES
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs font-mono bg-[#141414] hover:bg-[#202020] border border-[#262626] hover:border-[#444444] text-[#cccccc] hover:text-white px-2.5 py-1 rounded-sm transition cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 text-xs font-sans">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isActivityExpanded = expandedActivityId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] rounded-sm p-4 space-y-3 ${
                  isUser
                    ? 'bg-[#ffffff] text-[#000000]'
                    : msg.isError
                    ? 'bg-[#181818] border border-[#444444] text-[#cccccc]'
                    : 'bg-[#121212] border border-[#242424] text-[#cccccc]'
                }`}
              >
                {/* Message Header */}
                <div
                  className={`flex items-center justify-between font-mono text-[10px] pb-1.5 border-b ${
                    isUser ? 'border-black/15 text-black/70' : 'border-[#242424] text-[#888888]'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-bold uppercase tracking-wider">
                      {isUser ? 'INVESTIGATOR' : 'MONOMER AI INVESTIGATOR'}
                    </span>
                    {!isUser && msg.mode && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#1c1c1c] text-[#888888] border border-[#2e2e2e]">
                        {msg.mode.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Main Content */}
                {isUser ? (
                  <div className="leading-relaxed whitespace-pre-line text-xs font-normal font-sans text-black">
                    {msg.content}
                  </div>
                ) : (
                  <InvestigationMarkdown content={msg.content} />
                )}

                {/* Observable Agent Activity Section (Section 14 & 26) */}
                {!isUser && msg.agentSteps && msg.agentSteps.length > 0 && (
                  <div className="pt-2 border-t border-[#222222]">
                    <button
                      onClick={() =>
                        setExpandedActivityId(isActivityExpanded ? null : msg.id)
                      }
                      className="w-full flex items-center justify-between text-[11px] font-mono text-[#888888] hover:text-white py-1 transition cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-3.5 h-3.5" />
                        <span className="uppercase font-bold tracking-wider text-[10px]">
                          AGENT ACTIVITY ({msg.toolsUsed?.length || 0} tools executed)
                        </span>
                      </div>
                      {isActivityExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {isActivityExpanded && (
                      <div className="mt-2 p-3 bg-[#0d0d0d] border border-[#262626] rounded-sm space-y-2.5 font-mono text-[11px]">
                        {/* Progressive Steps */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-[#666666] uppercase tracking-wider block font-bold">
                            EXECUTION PIPELINE
                          </span>
                          {msg.agentSteps.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-start space-x-2 text-[#cccccc]"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                              <span className="leading-tight">{step}</span>
                            </div>
                          ))}
                        </div>

                        {/* Tools Used */}
                        {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                          <div className="pt-2 border-t border-[#202020] space-y-1">
                            <span className="text-[9px] text-[#666666] uppercase tracking-wider block font-bold">
                              TOOLS CALLED
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {msg.toolsUsed.map((tool, tIdx) => (
                                <code
                                  key={tIdx}
                                  className="text-[10px] px-1.5 py-0.5 bg-[#161616] border border-[#2a2a2a] text-white rounded-sm"
                                >
                                  ✓ {tool}()
                                </code>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Clickable Evidence & Transaction Citations (Section 27) */}
                {!isUser &&
                  ((msg.evidenceIds && msg.evidenceIds.length > 0) ||
                    (msg.transactionIds && msg.transactionIds.length > 0) ||
                    (msg.walletIds && msg.walletIds.length > 0)) && (
                    <div className="pt-2 border-t border-[#222222] space-y-2 font-mono">
                      {/* Evidence Citations */}
                      {msg.evidenceIds && msg.evidenceIds.length > 0 && (
                        <div>
                          <span className="text-[9px] text-[#666666] uppercase tracking-wider block font-bold mb-1">
                            CITED EVIDENCE ARTIFACTS
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {msg.evidenceIds.map((evdId, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (onFocusTab) onFocusTab('evidence');
                                }}
                                className="inline-flex items-center space-x-1 bg-[#1a1a1a] hover:bg-[#242424] px-2 py-0.5 rounded-sm border border-[#333333] hover:border-[#555555] text-[10px] text-white font-bold transition cursor-pointer"
                                title={`Inspect evidence record ${evdId}`}
                              >
                                <ShieldCheck className="w-3 h-3 text-[#aaaaaa]" />
                                <span>{evdId}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Transaction References */}
                      {msg.transactionIds && msg.transactionIds.length > 0 && (
                        <div>
                          <span className="text-[9px] text-[#666666] uppercase tracking-wider block font-bold mb-1">
                            CITED TRANSACTIONS
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {msg.transactionIds.map((txId, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (onSelectTransaction) onSelectTransaction(txId);
                                  if (onHighlightFlow) onHighlightFlow([], [txId]);
                                  if (onFocusTab) onFocusTab('graph');
                                }}
                                className="bg-[#181818] hover:bg-[#262626] px-2 py-0.5 rounded-sm border border-[#2e2e2e] hover:border-[#444444] text-[10px] text-white transition cursor-pointer"
                                title={`Focus transaction ${txId}`}
                              >
                                {txId} &rarr;
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Wallet References */}
                      {msg.walletIds && msg.walletIds.length > 0 && (
                        <div>
                          <span className="text-[9px] text-[#666666] uppercase tracking-wider block font-bold mb-1">
                            AFFECTED ENTITIES
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {msg.walletIds.map((wId, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  if (onSelectWallet) onSelectWallet(wId);
                                  if (onHighlightFlow) onHighlightFlow([wId], []);
                                  if (onFocusTab) onFocusTab('graph');
                                }}
                                className="bg-[#161616] hover:bg-[#222222] px-2 py-0.5 rounded-sm border border-[#2a2a2a] hover:border-[#444444] text-[10px] text-[#dddddd] transition cursor-pointer"
                                title={`Focus wallet ${wId}`}
                              >
                                @{wId}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                {/* Footer Controls (Highlight Flow CTA & Copy) */}
                {!isUser && (
                  <div className="pt-2 flex items-center justify-between border-t border-[#222222]">
                    {(msg.walletIds && msg.walletIds.length > 0) ||
                    (msg.transactionIds && msg.transactionIds.length > 0) ? (
                      <button
                        onClick={() => {
                          if (onHighlightFlow) {
                            onHighlightFlow(msg.walletIds || [], msg.transactionIds || []);
                          }
                          if (onFocusTab) onFocusTab('graph');
                        }}
                        className="flex items-center space-x-1.5 text-[11px] font-mono text-white hover:text-[#cccccc] transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Highlight Affected Flow on Graph</span>
                      </button>
                    ) : (
                      <span />
                    )}

                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="text-[#888888] hover:text-white p-1 cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-white" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator with Observable Progress */}
        {isLoading && (
          <div className="flex items-start space-x-2.5 justify-start">
            <div className="max-w-[85%] rounded-sm p-4 bg-[#121212] border border-[#262626] text-[#cccccc] space-y-2 font-mono">
              <div className="flex items-center space-x-2 text-xs font-bold text-white">
                <CircleDot className="w-3.5 h-3.5 animate-spin text-white" />
                <span>MONOMER AI Analyzing Investigation...</span>
              </div>
              <div className="space-y-1 text-[11px] text-[#888888] pl-5">
                <div>○ Understanding investigation query...</div>
                <div>○ Identifying required evidence &amp; entities...</div>
                <div>○ Querying MONOMER investigation tools...</div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="shrink-0 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about transaction flows, risk factors, cross-chain bridge, or evidence..."
          disabled={isLoading}
          className="flex-1 bg-[#121212] border border-[#242424] focus:border-[#555555] rounded-sm px-3.5 py-2.5 text-xs font-mono text-white placeholder-[#555555] outline-none transition disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="bg-[#ffffff] hover:bg-[#e0e0e0] text-[#000000] px-4 py-2.5 rounded-sm text-xs font-bold font-mono transition shrink-0 cursor-pointer disabled:opacity-40"
        >
          {isLoading ? 'Querying...' : 'Send'}
        </button>
      </form>
    </div>
  );
};
