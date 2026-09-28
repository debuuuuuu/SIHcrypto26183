export type AIMode = 'live' | 'demo';

export interface ConversationMessage {
  id?: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export type FocusActionType = 'focus_wallet' | 'focus_transaction' | 'focus_detection';

export interface FocusAction {
  type: FocusActionType;
  target: string;
}

export interface AIResponse {
  mode: AIMode;
  answer: string;
  evidenceIds: string[];
  transactionIds: string[];
  walletIds: string[];
  toolsUsed: string[];
  agentSteps: string[];
  focusAction?: FocusAction | null;
  confidence: 'high' | 'medium' | 'low';
}

export interface AIStatus {
  mode: AIMode;
  model: string;
  provider?: string;
}
