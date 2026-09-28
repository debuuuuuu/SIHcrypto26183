'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  Copy,
  Check,
  Eye,
  Terminal,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CircleDot,
  CheckCircle2,
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
  'Which exchange holds the funds?',
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
      timestamp: '14:21:00 UTC',
      content:
        'MONOMER AI Investigator initialized. Operating as an evidence-grounded agent with direct programmatic access to verified ledger records, transaction topologies, cross-chain bridge logs, and FIU-IND clustering engines. Enter an operational query or select a preset below.',
      toolsUsed: ['init_investigation_layer'],
      agentSteps: [
        'Initialized investigation tool layer',
        'Loaded forensic case 2026/NCRP/MH/09128',
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
    } catch (err: any) {
      console.error('Investigation error:', err);
      const errorMsg: ExtendedAiMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toISOString().substring(11, 19) + ' UTC',
        content:
          'MONOMER AI service temporarily unreachable. Forensic records remain verified and accessible directly via the dashboard tables and graph inspector.',
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
        timestamp: '14:21:00 UTC',
        content:
          'Console buffer cleared. MONOMER AI Investigator is online. Enter an investigation query below or execute a preset command.',
        toolsUsed: ['init_investigation_layer'],
        agentSteps: ['Console cleared', 'Awaiting investigator query'],
        mode: aiStatus.mode,
      },
    ]);
  };

  return (
    <div className="h-full flex flex-col bg-obsidian-950 text-sand-100 p-4 md:p-6 overflow-hidden select-none font-sans">
      {/* Top Tactical Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-obsidian-750 gap-3 mb-4 shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
              AI INVESTIGATOR / EVIDENCE COPILOT
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-[10px] font-mono text-sand-300">
              CASE: 2026/NCRP/MH/09128
            </span>
            <span className="text-zinc-600">•</span>
            <span className="inline-flex items-center space-x-1 font-mono text-[10px] text-sand-100">
              <span className="w-1.5 h-1.5 rounded-full bg-sand-100" />
              <span>{aiStatus.mode === 'live' ? 'LIVE AGENT' : 'DEMO COPILOT'}</span>
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold font-sans text-sand-100 tracking-tight mt-0.5">
            Forensic Command Console &amp; Autonomous Copilot
          </h2>
          <p className="text-xs text-zinc-400 font-sans">
            Grounded reasoning over multi-chain transaction graphs, bridge logs, and VASP off-ramps
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <button
            onClick={handleReset}
            className="text-xs font-mono text-zinc-400 hover:text-sand-100 border border-obsidian-750 hover:border-sand-300 px-3 py-1.5 rounded-[4px] bg-obsidian-900 transition flex items-center space-x-1.5 cursor-pointer"
            title="Clear console buffer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>CLEAR CONSOLE</span>
          </button>
        </div>
      </div>

      {/* Suggested Command Chips */}
      <div className="mb-4 shrink-0 space-y-1.5">
        <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider font-bold">
          PRESET INVESTIGATOR COMMANDS
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUERIES.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs font-mono bg-obsidian-900 hover:bg-obsidian-850 border border-obsidian-750 hover:border-sand-300 text-zinc-300 hover:text-sand-100 px-2.5 py-1 rounded-[4px] transition cursor-pointer disabled:opacity-50"
            >
              &gt; {q}
            </button>
          ))}
        </div>
      </div>

      {/* Console Stream Buffer */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 text-xs font-mono">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isActivityExpanded = expandedActivityId === msg.id;

          if (isUser) {
            return (
              <div key={msg.id} className="py-2 border-l-2 border-sand-300 pl-3 space-y-1 bg-obsidian-900/40 rounded-r-[4px]">
                <div className="flex items-center space-x-2 text-[10px] text-zinc-500">
                  <span className="font-bold uppercase text-sand-300">INVESTIGATOR COMMAND</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div className="text-sand-100 text-xs font-mono font-bold">
                  &gt; {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className="bg-obsidian-900 border border-obsidian-750 rounded-[4px] p-4 space-y-3"
            >
              {/* Message Meta Header */}
              <div className="flex items-center justify-between font-mono text-[10px] pb-2 border-b border-obsidian-750 text-zinc-500">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sand-100 uppercase tracking-wider">
                    MONOMER EVIDENCE ENGINE
                  </span>
                  {msg.mode && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-[4px] bg-obsidian-850 text-zinc-400 border border-obsidian-750 uppercase">
                      {msg.mode}
                    </span>
                  )}
                </div>
                <span>{msg.timestamp}</span>
              </div>

              {/* Main Content */}
              <div className="text-zinc-300 font-sans text-xs leading-relaxed">
                <InvestigationMarkdown content={msg.content} />
              </div>

              {/* Observable Agent Activity */}
              {msg.agentSteps && msg.agentSteps.length > 0 && (
                <div className="pt-2 border-t border-obsidian-750">
                  <button
                    onClick={() =>
                      setExpandedActivityId(isActivityExpanded ? null : msg.id)
                    }
                    className="w-full flex items-center justify-between text-[11px] font-mono text-zinc-400 hover:text-sand-100 py-1 transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Terminal className="w-3.5 h-3.5" />
                      <span className="uppercase font-bold tracking-wider text-[10px]">
                        EXECUTION PIPELINE ({msg.toolsUsed?.length || 0} TOOLS CALLED)
                      </span>
                    </div>
                    {isActivityExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isActivityExpanded && (
                    <div className="mt-2 p-3 bg-obsidian-850 border border-obsidian-750 rounded-[4px] space-y-2.5 font-mono text-[11px]">
                      <div className="space-y-1.5">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">
                          PIPELINE TELEMETRY
                        </span>
                        {msg.agentSteps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start space-x-2 text-zinc-300"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-sand-100 shrink-0 mt-0.5" />
                            <span className="leading-tight">{step}</span>
                          </div>
                        ))}
                      </div>

                      {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                        <div className="pt-2 border-t border-obsidian-750 space-y-1">
                          <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold">
                            CALLED HEURISTICS
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {msg.toolsUsed.map((tool, tIdx) => (
                              <code
                                key={tIdx}
                                className="text-[10px] px-1.5 py-0.5 bg-obsidian-900 border border-obsidian-750 text-sand-300 rounded-[4px]"
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

              {/* Citations (Evidence, Transactions, Wallets) */}
              {((msg.evidenceIds && msg.evidenceIds.length > 0) ||
                (msg.transactionIds && msg.transactionIds.length > 0) ||
                (msg.walletIds && msg.walletIds.length > 0)) && (
                <div className="pt-2 border-t border-obsidian-750 space-y-2 font-mono">
                  {/* Evidence Citations */}
                  {msg.evidenceIds && msg.evidenceIds.length > 0 && (
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold mb-1">
                        CITED EVIDENCE ARTIFACTS
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.evidenceIds.map((evdId, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              if (onFocusTab) onFocusTab('evidence');
                            }}
                            className="inline-flex items-center space-x-1 bg-obsidian-850 hover:bg-obsidian-750 px-2 py-0.5 rounded-[4px] border border-obsidian-750 hover:border-sand-300 text-[10px] text-sand-100 font-bold transition cursor-pointer"
                            title={`Inspect evidence record ${evdId}`}
                          >
                            <ShieldCheck className="w-3 h-3 text-sand-300" />
                            <span>{evdId}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transaction References */}
                  {msg.transactionIds && msg.transactionIds.length > 0 && (
                    <div>
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold mb-1">
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
                            className="bg-obsidian-850 hover:bg-obsidian-750 px-2 py-0.5 rounded-[4px] border border-obsidian-750 hover:border-sand-300 text-[10px] text-sand-100 transition cursor-pointer"
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
                      <span className="text-[9px] text-zinc-500 uppercase tracking-wider block font-bold mb-1">
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
                            className="bg-obsidian-850 hover:bg-obsidian-750 px-2 py-0.5 rounded-[4px] border border-obsidian-750 hover:border-sand-300 text-[10px] text-sand-300 transition cursor-pointer"
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

              {/* Action Bar (Highlight Flow & Copy) */}
              <div className="pt-2 flex items-center justify-between border-t border-obsidian-750">
                {(msg.walletIds && msg.walletIds.length > 0) ||
                (msg.transactionIds && msg.transactionIds.length > 0) ? (
                  <button
                    onClick={() => {
                      if (onHighlightFlow) {
                        onHighlightFlow(msg.walletIds || [], msg.transactionIds || []);
                      }
                      if (onFocusTab) onFocusTab('graph');
                    }}
                    className="flex items-center space-x-1.5 text-[11px] font-mono font-bold text-sand-100 hover:text-sand-300 transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>[ HIGHLIGHT FLOW ON GRAPH ]</span>
                  </button>
                ) : (
                  <span />
                )}

                <button
                  onClick={() => handleCopy(msg.id, msg.content)}
                  className="text-zinc-500 hover:text-sand-100 p-1 cursor-pointer transition-colors"
                  title="Copy response"
                >
                  {copiedId === msg.id ? (
                    <Check className="w-3.5 h-3.5 text-sand-100" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="bg-obsidian-900 border border-obsidian-750 rounded-[4px] p-4 text-zinc-400 space-y-2 font-mono">
            <div className="flex items-center space-x-2 text-xs font-bold text-sand-100">
              <CircleDot className="w-3.5 h-3.5 animate-spin text-sand-100" />
              <span>MONOMER AI Executing Graph Reasoner...</span>
            </div>
            <div className="space-y-1 text-[11px] text-zinc-500 pl-5">
              <div>○ Resolving investigation query semantics...</div>
              <div>○ Querying multi-chain ledger &amp; VASP registry...</div>
              <div>○ Generating grounded forensic assessment...</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Command Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputValue);
        }}
        className="shrink-0 flex items-center gap-2 pt-2 border-t border-obsidian-750"
      >
        <span className="text-zinc-500 font-mono text-xs select-none pl-1">
          COMMAND &gt;
        </span>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask investigator (e.g. 'Which exchange holds the funds?', 'Explain cross-chain movement')..."
          disabled={isLoading}
          className="flex-1 bg-obsidian-900 border border-obsidian-750 focus:border-sand-300 rounded-[4px] px-3.5 py-2 text-xs font-mono text-sand-100 placeholder-zinc-500 outline-none transition disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="bg-sand-100 hover:bg-sand-300 text-obsidian-950 px-4 py-2 rounded-[4px] text-xs font-bold font-mono transition shrink-0 cursor-pointer disabled:opacity-40"
        >
          {isLoading ? 'QUERYING...' : 'EXECUTE'}
        </button>
      </form>
    </div>
  );
};
