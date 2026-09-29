# MONOMER // Comprehensive Website Architecture & AI Interaction Click-Map

> **System Purpose**: Automated cryptocurrency fraud tracing, VASP (Virtual Asset Service Provider) attribution, and Section 65B Indian Evidence Act court-admissible forensic reporting for Law Enforcement Agencies (LEAs).  
> **Live Production Deployment**: [https://monomer-investigation.vercel.app](https://monomer-investigation.vercel.app)  
> **Direct Deployment URL**: [https://monomer-investigation-8zv58wq23-de-v8s-projects.vercel.app](https://monomer-investigation-8zv58wq23-de-v8s-projects.vercel.app)  
> **Target Audience / AI Agents**: This document provides an exhaustive, machine-readable breakdown of every page, view, component, button, click action, state transition, and backend API across the MONOMER platform.

---

## 1. High-Level System Architecture & State Machine

The entire frontend is structured as a single-page state machine in [`src/app/page.tsx`](file:///c:/coding/sih%20demo/src/app/page.tsx) with persistent synchronization via URL parameters (`?screen=dashboard`).

```
                    ┌────────────────────────┐
                    │      SCREEN: LANDING   │
                    │ (StartInvestigation)   │
                    └───────────┬────────────┘
                                │ Click "Investigate" / "Enter Dashboard"
                                ▼
                    ┌────────────────────────┐
                    │      SCREEN: LOADING   │
                    │ (InvestigationLoading) │
                    └───────────┬────────────┘
                                │ Auto-completes in ~2.5s or click "Skip"
                                ▼
                    ┌────────────────────────┐
                    │     SCREEN: DASHBOARD  │
                    │ (Main Forensic Suite)  │
                    └────────────────────────┘
```

### Top-Level State Variables:
* `currentScreen`: `'landing' | 'loading' | 'dashboard'`
* `activeTab`: `'overview' | 'graph' | 'timeline' | 'detections' | 'vasp' | 'crosschain' | 'privacy' | 'evidence' | 'ai'`
* `selectedWalletId`: `string | null` (Active focused wallet entity, defaults to `'suspect'`)
* `selectedTransactionId`: `string | null` (Active focused transaction)
* `activeDetectionId`: `string | null` (Active heuristic pattern filter)
* `highlightedNodeIds`: `string[]` (Nodes highlighted by AI or tracers)
* `highlightedEdgeIds`: `string[]` (Edges highlighted by AI or tracers)
* `isRightPanelOpen`: `boolean` (Controls `WalletIntelligencePanel`)
* `isAlertsOpen`: `boolean` (Controls `AlertsDrawer`)
* `isReportModalOpen`: `boolean` (Controls `InvestigationReportModal`)

---

## 2. Screen 1: Landing & Ingestion Portal (`StartInvestigation.tsx`)

File: [`src/components/landing/StartInvestigation.tsx`](file:///c:/coding/sih%20demo/src/components/landing/StartInvestigation.tsx)

### Visual Layout:
1. **Brand Hero**: Title "MONOMER // Real-Time VASP Attribution & Evidence Core".
2. **Live Telemetry HUD (4 Stat Cards)**:
   * **VASP Clusters**: `1.42M+` (FIU-IND Registry)
   * **Trace Latency**: `< 850ms` (High-Speed RPC)
   * **Attribution Rate**: `99.4%` (Multi-Input Clustering)
   * **LEA Gateway**: `NCRP / SYG` (Sec 65B BSA Compliant)
3. **Tab Switcher Buttons**:
   * `[ NCRP & SAHYOG Ingestion ]` (Tab `ncrp`)
   * `[ Live Multi-Chain Indexer ]` (Tab `live`)
   * `[ Target Manual Entry ]` (Tab `manual`)

---

### Tab 1: NCRP & SAHYOG Ingestion
Pre-loaded with official sample NCRP cyber fraud complaints (from [`src/lib/ncrpRegistry.ts`](file:///c:/coding/sih%20demo/src/lib/ncrpRegistry.ts)).

| Element / Button | Click Event / Trigger | Exact System Behavior |
| :--- | :--- | :--- |
| **Complaint Card** (`2026/NCRP/MH/09128` - Sextortion / Task Fraud) | Click card container | Sets `selectedNcrpAck` to this complaint; highlights card with blue/sand border. |
| **Complaint Card** (`2026/NCRP/DL/04412` - Fake Crypto Investment Scam) | Click card container | Selects Delhi complaint; updates selected state. |
| **Complaint Card** (`2026/NCRP/KA/07831` - Part-Time Job Telegram Scam) | Click card container | Selects Karnataka complaint; updates selected state. |
| **[ Investigate ] Button** (Inside individual complaint card) | `handleLaunchNcrp(complaint)` | Hydrates case with this complaint's data, transitions `currentScreen -> 'loading'`, runs attribution sequence. |
| **[ Ingest Complaint & Run Attribution ] Button** (Bottom Primary) | `handleLaunchNcrp(selectedComplaint)` | Launches investigation with currently selected complaint; moves to loading screen. |
| **[ Enter Dashboard ] Button** (Bottom Secondary) | `onStartDemo()` | Loads default `DEMO_CASE`, transitions to `'loading'`, opens dashboard directly. |

---

### Tab 2: Live Multi-Chain Indexer
Queries real-time blockchain addresses via public JSON-RPC nodes.

| Element / Button | Click Event / Trigger | Exact System Behavior |
| :--- | :--- | :--- |
| **Blockchain Selector Pills** (`Ethereum L1`, `Polygon PoS`, `Arbitrum`, `BNB Chain`, `TRON`) | `onClick={() => setChain(c.id)}` | Sets target chain; updates input placeholder and RPC target network. |
| **Target Address Input Field** | Text entry | Accepts any `0x...` EVM address or `T...` TRC-20 address. |
| **Sample Address Chips** (`Suspect Fraud Hotwallet`, `Tornado Cash Mixer`, `Binance Deposit Cluster`) | Click chip | Auto-fills the input field with corresponding address and auto-selects its chain. |
| **[ Run Real-Time RPC Multi-Chain Trace ] Button** | Form submit `handleLiveTraceSubmit` | Initiates real RPC index query via `/api/blockchain/trace`, sets `currentCase.status = 'LIVE RPC INDEXED'`, transitions to `'loading'`. |

---

### Tab 3: Target Manual Entry
Allows custom forensic scoping (Hops, Min Threshold, Time Range).

| Element / Button | Click Event / Trigger | Exact System Behavior |
| :--- | :--- | :--- |
| **Address Input** | Text entry | Sets target wallet address. |
| **Chain Dropdown** | Select change | Sets blockchain (`Ethereum`, `Polygon`, etc.). |
| **Investigation Timeframe Dropdown** | Select change | Filters transactions (`Last 24 Hours`, `Last 7 Days`, `Last 30 Days`, `All Time`). |
| **Max Traversal Hops Slider** | Range slide (1 to 6) | Adjusts graph traversal depth. |
| **Min Amount Filter Input** | Numeric entry | Excludes dust spam transactions below threshold (e.g., `< $50 USDT`). |
| **[ Initialize Forensic Investigation ] Button** | Form submit `handleManualSubmit` | Configures case parameters and transitions to `'loading'`. |

---

## 3. Screen 2: Loading & Attribution Screen (`InvestigationLoading.tsx`)

File: [`src/components/loading/InvestigationLoading.tsx`](file:///c:/coding/sih%20demo/src/components/loading/InvestigationLoading.tsx)

### Visual Elements & Actions:
* **Animated Radar HUD**: Visual pulse scanning current target address.
* **9-Step Sequence**: Automatically advances through 9 forensic steps (Resolving coordinates -> Querying RPC -> Tracing peel chains -> Multi-input clustering -> VASP identification -> FIU-IND matching -> Bridge analysis -> Risk scoring -> Dossier sealing).
* **Fast-Forward Button (`[ Skip ]`)**:
  * **Trigger**: Clicking `[ Skip ]` immediately clears the timer and executes `onComplete()`, transitioning directly into `currentScreen = 'dashboard'`.

---

## 4. Screen 3: Main Dashboard Shell & Navigation

Files: [`src/components/layout/Header.tsx`](file:///c:/coding/sih%20demo/src/components/layout/Header.tsx) and [`src/app/page.tsx`](file:///c:/coding/sih%20demo/src/app/page.tsx)

### Top Header Bar:
| Element / Button | Trigger | Exact Behavior |
| :--- | :--- | :--- |
| **Logo / "MONOMER"** | `onClick={handleReset}` | Resets investigation state and navigates back to `landing` screen. |
| **Dossier Case ID Tag** (`#CASE-2026-0921-X9`) | Display / Tooltip | Shows unique LEA case identifier. |
| **NCRP Badge** (`NCRP: 2026/NCRP/MH/09128`) | Display / Tooltip | Displays active Indian National Cybercrime Reporting Portal complaint reference. |
| **"Live RPC" Status Indicator** | Tooltip | Indicates active blockchain network health. |
| **Alerts Bell Icon (`[ Bell (Count) ]`)** | `onClick={onToggleAlerts}` | Opens the right-side `AlertsDrawer` containing live on-chain warnings. |
| **`[ Export Dossier / JSON ]` Button** | `onClick={handleExport}` | Copies complete forensic case JSON to user's clipboard and flashes a "COPIED" notification. |
| **`[ Section 65B Dossier ]` Button** | `onClick={onOpenReport}` | Opens the printable `InvestigationReportModal`. |

---

### Left Navigation Sidebar:

The sidebar is divided into 3 functional groups:

#### Group 1: `CASE`
1. **Overview (`id: 'overview'`)**:
   * **Click**: Sets `activeTab = 'overview'`. Renders executive summary, victim-to-suspect timeline, risk assessment, and incident metrics.
2. **Graph (`id: 'graph'`)**:
   * **Click**: Sets `activeTab = 'graph'`. Renders the interactive 2D node-edge canvas (`TransactionGraph`).
3. **Timeline (`id: 'timeline'`)**:
   * **Click**: Sets `activeTab = 'timeline'`. Renders chronological sequence of all 8 transactions with block heights and timestamps.

#### Group 2: `ANALYSIS`
4. **Detections (`id: 'detections'`)**:
   * **Click**: Sets `activeTab = 'detections'`. Lists all 5 confirmed heuristic behavioral patterns (Fan-out, Cross-chain, Mixer taint, etc.).
5. **VASP Clusters (`id: 'vasp'`)**:
   * **Click**: Sets `activeTab = 'vasp'`. Displays exchange identification, cluster address groups, FIU-IND registration status, and legal subpoena contacts.
6. **Cross-Chain (`id: 'crosschain'`)**:
   * **Click**: Sets `activeTab = 'crosschain'`. Detailed analysis of the Ethereum-to-Polygon bridge hop (Hop latency, Polygon contract address, destination hash).
7. **Mixers & Privacy (`id: 'privacy'`)**:
   * **Click**: Sets `activeTab = 'privacy'`. Tornado Cash / Railgun protocol de-anonymization and cold storage parking analysis.
8. **Evidence (`id: 'evidence'`)**:
   * **Click**: Sets `activeTab = 'evidence'`. Registry of all 6 cryptographically sealed evidence items with SHA-256 integrity hashes.

#### Group 3: `ASSIST`
9. **AI Investigator (`id: 'ai'`)**:
   * **Click**: Sets `activeTab = 'ai'`. AI Co-pilot assistant for asking investigative questions, identifying co-conspirators, and generating subpoena clauses.
10. **Report (`id: 'report'`)**:
    * **Click**: Opens `InvestigationReportModal` without leaving the current tab.

#### Bottom Sidebar Drawer:
* **`[ Real-Time Alerts (N) ]` Button**:
  * **Click**: Opens `AlertsDrawer` containing live high-priority forensic alerts.

---

## 5. Main Content Views (Tabs)

---

### View 1: Case Overview (`CaseOverviewView.tsx`)
File: [`src/components/overview/CaseOverviewView.tsx`](file:///c:/coding/sih%20demo/src/components/overview/CaseOverviewView.tsx)

| Clickable Element | Click Action / Target | Result |
| :--- | :--- | :--- |
| **`[ Inspect Identified VASP Cluster ]`** | `onNavigate('vasp')` | Switches active tab to `vasp`. |
| **`[ Inspect Privacy Protocol De-Anonymization ]`** | `onNavigate('privacy')` | Switches active tab to `privacy`. |
| **Victim Wallet Chip (`0xVIC7...cf1`)** | `onSelectWallet('victim')` | Opens `WalletIntelligencePanel` populated with Victim Wallet data. |
| **Suspect Primary Chip (`0x7A92...F2D`)** | `onSelectWallet('suspect')` | Opens `WalletIntelligencePanel` populated with Suspect Primary data. |
| **Exchange Endpoint Chip (`0xEXCH...4d401`)** | `onSelectWallet('exchange')` | Opens `WalletIntelligencePanel` populated with Exchange Hotwallet data. |
| **`[ Open Section 65B Formal Report ]`** | `onOpenReport()` | Opens `InvestigationReportModal`. |
| **Detection Row Cards** | `onNavigate('detections')` | Jumps to specific detection analysis. |

---

### View 2: Interactive Transaction Graph (`TransactionGraph.tsx`)
Files:
* Graph Engine: [`src/components/graph/TransactionGraph.tsx`](file:///c:/coding/sih%20demo/src/components/graph/TransactionGraph.tsx)
* Node Components: [`src/components/graph/CustomNodes.tsx`](file:///c:/coding/sih%20demo/src/components/graph/CustomNodes.tsx)
* Edge Components: [`src/components/graph/ForensicEdge.tsx`](file:///c:/coding/sih%20demo/src/components/graph/ForensicEdge.tsx)

#### A. Node Click Interactions:
* **Click any Wallet Node** (e.g. `victim`, `suspect`, `walletB`, `walletC`, `walletD`, `bridge`, `polygonWallet`, `exchange`):
  1. Triggers `onSelectWallet(walletId)`.
  2. Sets `selectedWalletId` in state.
  3. Node receives white/colored selection highlight ring and corner tactical reticles.
  4. Automatically opens the **`WalletIntelligencePanel`** on the right side with complete financial and KYC telemetry.

#### B. Edge (Transaction Filament) Click Interactions:
* **Click any Transaction Edge**:
  1. Triggers `onSelectTransaction(txId)`.
  2. Sets `selectedTransactionId` in state.
  3. Edge stroke thickens and highlights white.
  4. Auto-selects destination wallet in `WalletIntelligencePanel`.

#### C. Top Graph Toolbar Controls:

| Control Button | Icon / Name | Functionality |
| :--- | :--- | :--- |
| **Layout Toggle** | `[ FLOW / ORBITAL ]` | Switches between horizontal directional flow and concentric orbital topology. |
| **Chain Filter** | `[ ALL / ETH / POL ]` | Dims nodes/edges that do not belong to the selected blockchain network. |
| **Replay Flow** | `[ ⟲ Replay Flow ]` | Restarts the chronological money laundering reconstruction sequence from Hop 1. |
| **Splits Toggle** | `[ Splits (%) ]` | Toggles fund percentage badges on edges (`100%`, `40%`, `35%`, `25%`, `99.7%`). |
| **Amounts Toggle** | `[ Amounts ]` | Toggles transaction dollar labels (`$2,000 USDT`, `$800 USDT`, etc.). |
| **`[ Exit Path ]` Button** | `Zap Icon` | Toggles isolation of the primary laundering cash-out route (`victim -> suspect -> walletC -> bridge -> polygonWallet -> exchange`), dimming all unrelated nodes to 20% opacity. |
| **`🎯 Focus Entity...` Dropdown** | Dropdown Select | Centering camera pan directly onto the chosen wallet node with smooth zoom. |
| **`[ Auto Fit View ]`** | `Maximize2 Icon` | Re-centers and fits entire graph into the visible canvas area. |
| **`[ MiniMap ]` Toggle** | `Map Icon` | Shows/hides thumbnail navigation map in bottom-right corner. |
| **`[ Reset Graph ]`** | `RotateCcw Icon` | Resets all active filters, selections, and camera positions. |

#### D. Progressive Chronological Reconstruction HUD Player Bar (Bottom Floating Dock):

| HUD Element | Trigger | Exact Behavior |
| :--- | :--- | :--- |
| **`[ Play / Pause ]`** | `onClick={togglePlayback}` | Toggles automated step advancement across all 6 hops. |
| **`[ ⟲ Replay ]`** | `onClick={handleReplay}` | Resets step counter to 0 and begins sequential auto-play from Hop 1. |
| **`[ HOP 1 ]` to `[ HOP 6 ]` Scrubber** | `onClick={() => setReconstructionStep(idx)}` | Jumps directly to that hop phase; smoothly animates camera framing to the newly revealed entities. |
| **Telemetry Banner** | Display | Displays the active phase name (e.g. `CEX OFF-RAMP`), timestamp, and intelligence summary. |
| **`[ 1x / 2x / 4x ]` Speed Pill** | `onClick={cyclePlaybackSpeed}` | Cycles through animation delays (`950ms`, `475ms`, `238ms`). |
| **`[ SHOW ALL ]` Toggle** | `onClick={toggleShowAll}` | Disables sequential mode to reveal all 9 entities, 8 edges, and 2 network zones simultaneously. |

#### E. Forensic Node Anatomy & Click Actions (`ForensicNode`):

| Node Component | Interaction | Behavior |
| :--- | :--- | :--- |
| **Card Perimeter / Bezel** | `onClick={onSelect}` | Selects node, opens `WalletIntelligencePanel`, and highlights connected subgraphs. |
| **Header Icon & Title** | Display | Displays entity icon, label (`Wallet D`), and role (`Parking Wallet`). |
| **Category Pill** | Display | High-contrast status pill (`TARGET [HUB]`, `VICTIM`, `BRIDGE`, `CEX / KYC`, `RELAY`). |
| **Hardware Port Terminals** | Connection Anchor | Left `IN` and right `OUT` luminous circular socket pins without duplicate dots. Connected edges dock directly into terminal centers. |
| **Address Copy Button** | `onClick={handleCopy}` | Copies complete hexadecimal address to clipboard; flashes checkmark confirmation. |
| **Balance Row** | Display | High-contrast bold amount with currency token separated in monospace (`$500.00 USDT`). |
| **Threat Score Meter** | Display | Score numerical indicator (`52/100 • ELEVATED`) with grayscale gradient progress bar. |
| **Forensic Tags** | Display | Micro-capsules (`Intermediary D`, `Parking Wallet`, `+1`). |
| **`[ Inspect → ]` Button** | `onClick={onInspect}` | Opens the right-side `WalletIntelligencePanel` for deep on-chain telemetry. |

---

### View 3: Forensic Timeline (`InvestigationTimeline.tsx`)
File: [`src/components/timeline/InvestigationTimeline.tsx`](file:///c:/coding/sih%20demo/src/components/timeline/InvestigationTimeline.tsx)

* **Transaction Cards (TX-DEMO-001 through TX-DEMO-008)**:
  * **Clicking any Transaction Card**:
    1. Sets `selectedTransactionId`.
    2. Shows detailed gas telemetry, block number, method signature, and counterparty wallets.
  * **`[ Focus in Graph ]` Button**:
    1. Triggers `onFocusGraph()`.
    2. Navigates to `graph` tab.
    3. Auto-centers camera on that specific transaction.

---

### View 4: Detections View (`DetectionsView.tsx`)
File: [`src/components/detections/DetectionsView.tsx`](file:///c:/coding/sih%20demo/src/components/detections/DetectionsView.tsx)

Lists 5 heuristic behavioral laundering patterns:
1. `Rapid Fan-Out (Splitting)` (Confidence: 96%)
2. `Cross-Chain Bridge Hopping` (Confidence: 89%)
3. `CEX Off-Ramp Ingress` (Confidence: 94%)
4. `Cold Storage Parking` (Confidence: 78%)
5. `Layering Velocity Anomaly` (Confidence: 91%)

| Element | Click Action | Result |
| :--- | :--- | :--- |
| **Detection Item Card** | `onSelectDetection(id)` | Selects detection, auto-switches active tab to `graph`, and highlights ONLY the nodes/edges involved in that specific pattern. |
| **`[ Reset Graph Filter ]`** | `onSelectDetection(null)` | Clears filter and restores full graph. |

---

### View 5: VASP Clusters View (`VaspClusteringView.tsx`)
File: [`src/components/vasp/VaspClusteringView.tsx`](file:///c:/coding/sih%20demo/src/components/vasp/VaspClusteringView.tsx)

* **Cluster Summary Card**:
  * Identified Off-Ramp Cluster: `CLS-VASP-POLYGON-001` attributed to **Demo Exchange (Binance/WazirX equivalent)**.
  * Details: Deposit Forwarder `0x6d90...b21`, Hotwallet `0x28C...556D`, 99.4% confidence score.
* **Buttons & Actions**:
  * **`[ Copy Address ]`**: Copies hotwallet address to clipboard.
  * **`[ Generate VASP Subpoena Schedule ]`**: Opens `InvestigationReportModal` pre-focused on the Exchange Subpoena Section.
  * **`[ Copy LEA Law Enforcement Portal URL ]`**: Copies compliance contact portal link.
  * **`[ Inspect Wallet in Graph ]`**: Jumps to `graph` and focuses on the exchange hotwallet node.

---

### View 6: Mixers & Privacy Protocol View (`MixerAnalysisView.tsx`)
File: [`src/components/mixer/MixerAnalysisView.tsx`](file:///c:/coding/sih%20demo/src/components/mixer/MixerAnalysisView.tsx)

* **Privacy Protocols Analyzed**:
  * Tornado Cash 0.1 / 1.0 ETH Pools
  * Railgun Privacy Relayers
  * Dormant Cold Storage Parking (`walletD`)
* **Actions**:
  * **`[ Inspect Dormant Cold Wallet ]`**: Jumps to `graph` and selects `walletD`.
  * **`[ Export Taint Profile ]`**: Exports compliance taint score for Section 65B filing.

---

### View 7: Cross-Chain Analysis View (`CrossChainView.tsx`)
File: [`src/components/crosschain/CrossChainView.tsx`](file:///c:/coding/sih%20demo/src/components/crosschain/CrossChainView.tsx)

* **3-Stage Bridge Progression**:
  1. `Ethereum Mainnet` (Source tx hash: `0x7b3e...91fa`)
  2. `Polygon Bridge Gateway Contract` (Latency: 69 seconds)
  3. `Polygon PoS L2` (Destination tx hash: `0x4e83...311c`)
* **Actions**:
  * **`[ Copy Hash ]`**: Copies transaction hash.
  * **`[ Focus Entity in Graph ]`**: Selects bridge entity or Polygon recipient wallet in the graph view.

---

### View 8: Evidence Registry (`EvidenceRegistry.tsx`)
File: [`src/components/evidence/EvidenceRegistry.tsx`](file:///c:/coding/sih%20demo/src/components/evidence/EvidenceRegistry.tsx)

* **6 Cryptographically Sealed Items**:
  * Item 01: Victim Transaction Receipt (SHA-256 sealed)
  * Item 02: On-Chain Graph Topology Snapshot
  * Item 03: VASP Cluster Attribution Proof
  * Item 04: Cross-Chain State Proof
  * Item 05: Heuristic Detection Matrix
  * Item 06: Section 65B Certificate of Accuracy
* **Actions**:
  * **`[ Verify SHA-256 Hash ]`**: Simulates instant on-chain Merkle audit.
  * **`[ Download Sealed Artifact ]`**: Downloads JSON evidence package.

---

### View 9: AI Investigator Co-Pilot (`AiAssistantPanel.tsx`)
File: [`src/components/ai/AiAssistantPanel.tsx`](file:///c:/coding/sih%20demo/src/components/ai/AiAssistantPanel.tsx)

Integrated with real backend AI via `/api/ai/investigate`.

| Element | Click Action | Result |
| :--- | :--- | :--- |
| **Suggested Prompt Pills** (e.g. *"Who is the primary suspect?"*, *"Which exchange holds the funds?"*, *"Draft Section 91 CrPC notice"*) | Click chip | Auto-submits prompt to AI. |
| **Chat Input Field + Send Button** | Enter query and submit | Sends request to `/api/ai/investigate` (Groq / Llama 3 / OpenAI); streams response. |
| **`[ Highlight Flow in Graph ]` Button** (Inside AI responses) | `handleHighlightFlow(nodes, edges)` | Switches tab to `graph`, isolates exactly the entities identified by the AI, and highlights their fund flow. |

---

## 6. Drawers & Modals

---

### A. Right Drawer: Wallet Intelligence Panel (`WalletIntelligencePanel.tsx`)
File: [`src/components/intelligence/WalletIntelligencePanel.tsx`](file:///c:/coding/sih%20demo/src/components/intelligence/WalletIntelligencePanel.tsx)

Triggered whenever any wallet node is clicked on the graph or elsewhere.

* **Top Header**:
  * Entity name (e.g., `SUSPECT PRIMARY (0x7A92...F2D)`).
  * Role badge (`TARGET HUB`, `COMPLAINANT`, `CEX OFF-RAMP`, `COLD STORAGE`).
  * `[ X ]` Close Button: Closes the drawer.
* **Risk Score Gauge**: Visual gauge (e.g., `94/100 HIGH THREAT`).
* **Financial Metrics**: Balance, Inflow, Outflow, Chain, First Seen, Last Active.
* **Counterparty Breakdown**: List of sender/receiver addresses with fund flow amounts.
* **Section 65B Quick Actions**:
  * **`[ Copy Full Hex Address ]`**: Copies raw address to clipboard.
  * **`[ View on Etherscan / Polygonscan ]`**: Opens external block explorer.
  * **`[ Prepare Emergency Freeze Notice ]`**: Pre-populates freeze request to the identified VASP.

---

### B. Right Drawer: Real-Time Alerts Drawer (`AlertsDrawer.tsx`)
File: [`src/components/alerts/AlertsDrawer.tsx`](file:///c:/coding/sih%20demo/src/components/alerts/AlertsDrawer.tsx)

Triggered by clicking the bell icon in the header or the alert button in the sidebar.

* **Alert Items**:
  * Alert 1: `Critical: VASP Deposit Confirmed` ($698 USDT into Demo Exchange Hotwallet)
  * Alert 2: `Warning: Cross-Chain Bridge Ingress` (Ethereum to Polygon PoS)
  * Alert 3: `Notice: Rapid Fan-Out Velocity` (100% funds split in 24 seconds)
* **Actions per Alert**:
  * **`[ Mark Read ]`**: Clears unread badge.
  * **`[ Action (View VASP / Freeze Notice) ]`**: Auto-navigates to relevant tab (e.g., `vasp`).
  * **`[ Dispatch to LEA ]`**: Simulates official dispatch to state police cyber cell.

---

### C. Fullscreen Modal: Section 65B Court Dossier (`InvestigationReportModal.tsx`)
File: [`src/components/report/InvestigationReportModal.tsx`](file:///c:/coding/sih%20demo/src/components/report/InvestigationReportModal.tsx)

Triggered by clicking `[ Section 65B Dossier ]` or `[ Report ]`.

* **Dossier Content**:
  1. Court Heading: *IN THE COURT OF CHIEF METROPOLITAN MAGISTRATE / DESIGNATED CYBER COURT*
  2. Police Ref: FIR No., Police Station, NCRP Ack No.
  3. Complainant Statement & Initial Loss Breakdown
  4. Complete 8-Step Fund Movement Ledger with Tx Hashes & Timestamps
  5. VASP Exchange Attribution & Subpoena Notice Schedule
  6. Section 65B Indian Evidence Act / Section 63 BSA Certificate of Accuracy
  7. Investigating Officer Signature & Digital SHA-256 Hash Verification Seal
* **Action Buttons**:
  * **`[ Print / Save as PDF ]` Button**: Invokes browser `window.print()` using customized `@media print` CSS that formats a pristine A4 legal document.
  * **`[ Copy Markdown Report ]`**: Copies formatted report text to clipboard.
  * **`[ Close ]`**: Dismisses modal.

---

## 7. Backend API Endpoints Reference

| Endpoint | Method | Input Parameters | Output / Result |
| :--- | :--- | :--- | :--- |
| **`/api/ingest/ncrp`** | `POST` | `{ ackNumber, complainantName, lossAmountUSD, suspectAddress, crimeSubCategory }` | Registers complaint into database and returns hydrated case dossier. |
| **`/api/blockchain/trace`** | `GET` / `POST` | `?address=0x...&chain=Ethereum` | Queries public RPCs and returns live balance, transaction history, and counterparties. |
| **`/api/ai/investigate`** | `POST` | `{ message, history, caseContext }` | Calls Groq / Llama 3 / OpenAI and returns structured intelligence response with actionable flow highlights. |
| **`/api/ai/status`** | `GET` | None | Returns AI health, model availability, and latency status. |
| **`/dashboard`** | `GET` | `?screen=dashboard` | Direct entry route to main investigation dashboard. |

---

## 8. Summary of Colors & UI Restrictions

1. **Entire Application Shell**:
   * Uses exclusively: **Black** (`#08090b`), **White** (`#ffffff`), **Grays** (`#27272a`, `#3f3f46`, `#71717a`, `#a1a1aa`), and **Warm Sand / Stone** (`#ede8de`, `#d5cdbf`, `#332f27`).
   * No AI-generated neon gradients or glowing backgrounds.
2. **Interactive Graph Canvas (Sole Exception)**:
   * Styled like **Obsidian Graph View**:
     * 🔴 Suspect: Crimson (`#ef4444`)
     * 🔵 Victim: Cyan (`#06b6d4`)
     * 🟡 Layering: Amber Sand (`#f59e0b`)
     * 🟣 Bridge: Violet (`#a855f7`)
     * 🟢 VASP: Emerald (`#10b981`)
   * Features Obsidian focus-dimming (15% opacity on non-connected nodes during hover/click).
