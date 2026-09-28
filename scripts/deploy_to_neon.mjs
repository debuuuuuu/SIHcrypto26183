import pg from 'pg';
import fs from 'fs';
import path from 'path';
const { Client } = pg;

// Load .env.local if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [key, ...vals] = trimmed.split('=');
        const val = vals.join('=').trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = val;
        }
      }
    }
  }
}

loadEnv();

const connectionString =
  process.argv[2] ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  console.error('\nâŒ ERROR: No database connection string provided.');
  console.error('Usage: node scripts/deploy_to_neon.mjs <DATABASE_URL>');
  console.error('Or set DATABASE_URL or POSTGRES_URL in .env.local\n');
  process.exit(1);
}

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function deploy() {
  console.log('ðŸ”— Connecting to Neon Postgres...');
  await client.connect();

  // Read and execute schema
  const schemaPath = path.resolve(process.cwd(), 'scripts', 'neon_schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  console.log('ðŸ“‹ Creating tables and indexes...');
  await client.query(schemaSql);
  console.log('âœ… Schema created successfully.');

  console.log('ðŸŒ± Seeding example investigation data...');

  // 1. Seed Case
  const demoCase = {
    caseId: 'INV-DEMO-2026-001',
    caseName: 'Operation Broken Fan',
    targetAddress: '0x7A92d044e1837bF2D',
    startTime: '2026-09-21T10:31:04Z',
    endTime: '2026-09-21T10:41:52Z',
    status: 'ANALYSIS COMPLETE',
    chains: JSON.stringify(['Ethereum', 'Polygon']),
    totalValue: 2000,
    transactionCount: 8,
    walletCount: 9,
    riskScore: 78,
    classification: 'Financial Fraud / Fund Layering',
    reportingVictim: '0xVIC7a89104b92cf1',
    jurisdiction: 'Simulated Global / Multi-jurisdiction',
  };

  await client.query(
    `INSERT INTO cases (
      case_id, case_name, target_address, start_time, end_time, status,
      chains, total_value, transaction_count, wallet_count, risk_score,
      classification, reporting_victim, jurisdiction
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )
    ON CONFLICT (case_id) DO UPDATE SET
      case_name = EXCLUDED.case_name,
      status = EXCLUDED.status,
      risk_score = EXCLUDED.risk_score`,
    [
      demoCase.caseId, demoCase.caseName, demoCase.targetAddress,
      demoCase.startTime, demoCase.endTime, demoCase.status,
      demoCase.chains, demoCase.totalValue, demoCase.transactionCount,
      demoCase.walletCount, demoCase.riskScore, demoCase.classification,
      demoCase.reportingVictim, demoCase.jurisdiction
    ]
  );
  console.log('  âœ“ Inserted case: INV-DEMO-2026-001');

  // 2. Seed Wallets
  const wallets = [
    {
      id: 'victim',
      address: '0xVIC7a89104b92cf1',
      label: 'Victim',
      entityType: 'victim',
      chain: 'Ethereum',
      balance: '$0.00 USDT',
      riskScore: 5,
      tags: JSON.stringify(['Reporting Party', 'Defrauded Victim', 'Verified Inflow']),
      description: 'Originating wallet reporting an unauthorized fraudulent transfer of $2,000 USDT following phishing contract interaction.',
      totalReceived: '$2,000.00',
      totalSent: '$2,000.00',
      txCount: 1,
      firstSeen: '10:31:04 UTC',
      lastActive: '10:31:04 UTC',
      position: JSON.stringify({ x: 420, y: 40 }),
      associatedWallets: JSON.stringify(['0x7A92d044e1837bF2D']),
      detectedPatterns: JSON.stringify(['Initial Victim Outflow']),
      role: 'Reporting Victim',
    },
    {
      id: 'suspect',
      address: '0x7A92d044e1837bF2D',
      label: 'Suspect Wallet',
      entityType: 'suspect',
      chain: 'Ethereum',
      balance: '$0.00 USDT',
      riskScore: 78,
      tags: JSON.stringify(['Primary Suspect', 'Fund Aggregator', 'Fan-Out Dispatcher', 'High Risk']),
      description: 'Investigated target wallet that ingested $2,000 USDT and distributed 100% of the funds across 3 intermediary addresses within 24 seconds.',
      totalReceived: '$2,000.00',
      totalSent: '$2,000.00',
      txCount: 4,
      firstSeen: '10:31:04 UTC',
      lastActive: '10:33:41 UTC',
      position: JSON.stringify({ x: 420, y: 240 }),
      associatedWallets: JSON.stringify(['0xVIC7a89104b92cf1', '0x82BC9910a3746c41A', '0x19DEf4028b489a7C2', '0x44AF7039274c3991B']),
      detectedPatterns: JSON.stringify(['Rapid Movement', 'Fan-Out', 'Layering', 'Cluster Association']),
      role: 'Primary Suspect / Hub',
    },
    {
      id: 'walletB',
      address: '0x82BC9910a3746c41A',
      label: 'Wallet B',
      entityType: 'intermediary',
      chain: 'Ethereum',
      balance: '$40.00 USDT',
      riskScore: 68,
      tags: JSON.stringify(['Intermediary B', 'Rapid Transit', 'Layering Hop']),
      description: 'Intermediary address that received $800 from suspect and immediately forwarded $760 onward within 4 minutes.',
      totalReceived: '$800.00',
      totalSent: '$760.00',
      txCount: 2,
      firstSeen: '10:33:17 UTC',
      lastActive: '10:37:24 UTC',
      position: JSON.stringify({ x: 60, y: 450 }),
      associatedWallets: JSON.stringify(['0x7A92d044e1837bF2D', '0xDOWN7741e992b1a99']),
      detectedPatterns: JSON.stringify(['Rapid Movement', 'Layering']),
      role: 'Intermediary Relay',
    },
    {
      id: 'walletC',
      address: '0x19DEf4028b489a7C2',
      label: 'Wallet C',
      entityType: 'intermediary',
      chain: 'Ethereum',
      balance: '$0.00 USDT',
      riskScore: 72,
      tags: JSON.stringify(['Intermediary C', 'Bridge Feeder', 'Cross-Chain Vector']),
      description: 'Intermediary address that received $700 from suspect and initiated cross-chain bridge transfer to Polygon POS.',
      totalReceived: '$700.00',
      totalSent: '$700.00',
      txCount: 2,
      firstSeen: '10:33:28 UTC',
      lastActive: '10:35:02 UTC',
      position: JSON.stringify({ x: 420, y: 450 }),
      associatedWallets: JSON.stringify(['0x7A92d044e1837bF2D', '0xBR1Dge8841029c77E']),
      detectedPatterns: JSON.stringify(['Cross-Chain Bridge Movement', 'Layering']),
      role: 'Bridge Depositor',
    },
    {
      id: 'walletD',
      address: '0x44AF7039274c3991B',
      label: 'Wallet D',
      entityType: 'intermediary',
      chain: 'Ethereum',
      balance: '$500.00 USDT',
      riskScore: 55,
      tags: JSON.stringify(['Intermediary D', 'Dormant Reservoir', 'Unspent Funds']),
      description: 'Intermediary address that received $500 from suspect and has remained dormant with intact balance.',
      totalReceived: '$500.00',
      totalSent: '$0.00',
      txCount: 1,
      firstSeen: '10:33:41 UTC',
      lastActive: '10:33:41 UTC',
      position: JSON.stringify({ x: 780, y: 450 }),
      associatedWallets: JSON.stringify(['0x7A92d044e1837bF2D']),
      detectedPatterns: JSON.stringify(['Fan-Out Recipient', 'Dormant Asset Hold']),
      role: 'Dormant Holding Wallet',
    },
    {
      id: 'downstreamDest',
      address: '0xDOWN7741e992b1a99',
      label: 'Downstream Dest.',
      entityType: 'intermediary',
      chain: 'Ethereum',
      balance: '$760.00 USDT',
      riskScore: 62,
      tags: JSON.stringify(['Terminal Inflow', 'Secondary Hop', 'Ethereum Target']),
      description: 'Downstream destination receiving 95% of Wallet B funds ($760 USDT). Represents an active monitoring priority.',
      totalReceived: '$760.00',
      totalSent: '$0.00',
      txCount: 1,
      firstSeen: '10:37:24 UTC',
      lastActive: '10:37:24 UTC',
      position: JSON.stringify({ x: 60, y: 680 }),
      associatedWallets: JSON.stringify(['0x82BC9910a3746c41A']),
      detectedPatterns: JSON.stringify(['Layering Destination']),
      role: 'Secondary Intermediate Recipient',
    },
    {
      id: 'bridge',
      address: '0xBR1Dge8841029c77E',
      label: 'Demo Bridge Contract',
      entityType: 'bridge',
      chain: 'Ethereum',
      balance: 'Contract Pool',
      riskScore: 10,
      tags: JSON.stringify(['Smart Contract', 'Cross-Chain Bridge', 'Liquidity Protocol']),
      description: 'Verified smart contract protocol facilitating cross-chain message passing and token bridging between Ethereum and Polygon.',
      totalReceived: '$700.00',
      totalSent: '$698.00',
      txCount: 2,
      firstSeen: '10:35:02 UTC',
      lastActive: '10:36:11 UTC',
      position: JSON.stringify({ x: 420, y: 680 }),
      associatedWallets: JSON.stringify(['0x19DEf4028b489a7C2', '0xP0LY4910b8359d82A']),
      detectedPatterns: JSON.stringify(['Cross-Chain Bridge Hop']),
      role: 'Decentralized Bridge Protocol',
    },
    {
      id: 'polygonWallet',
      address: '0xP0LY4910b8359d82A',
      label: 'Polygon Wallet',
      entityType: 'polygon',
      chain: 'Polygon',
      balance: '$18.00 USDT',
      riskScore: 75,
      tags: JSON.stringify(['Cross-Chain Recipient', 'CEX Depositor', 'Polygon POS']),
      description: 'Polygon address that claimed bridged funds ($698 USDT) and routed $680 onwards to a centralized exchange deposit address within 5 minutes.',
      totalReceived: '$698.00',
      totalSent: '$680.00',
      txCount: 2,
      firstSeen: '10:36:11 UTC',
      lastActive: '10:41:52 UTC',
      position: JSON.stringify({ x: 420, y: 880 }),
      associatedWallets: JSON.stringify(['0xBR1Dge8841029c77E', '0xEXCH489201cb4d401']),
      detectedPatterns: JSON.stringify(['Cross-Chain Ingress', 'Rapid CEX Off-Ramp']),
      role: 'Cross-Chain Intermediary',
    },
    {
      id: 'exchange',
      address: '0xEXCH489201cb4d401',
      label: 'Demo Exchange',
      entityType: 'exchange',
      chain: 'Polygon',
      balance: 'Exchange Pool',
      riskScore: 15,
      tags: JSON.stringify(['Centralized Exchange', 'Deposit Hotwallet', 'KYC Point']),
      description: 'Identified Centralized Cryptocurrency Exchange (CEX) deposit hotwallet. Represents an actionable preservation and subpoena target.',
      totalReceived: '$680.00',
      totalSent: '$0.00',
      txCount: 1,
      firstSeen: '10:41:52 UTC',
      lastActive: '10:41:52 UTC',
      position: JSON.stringify({ x: 420, y: 1080 }),
      associatedWallets: JSON.stringify(['0xP0LY4910b8359d82A']),
      detectedPatterns: JSON.stringify(['Potential Cash-out / Off-Ramp Endpoint']),
      role: 'Exchange Off-Ramp Endpoint',
    },
  ];

  for (const w of wallets) {
    await client.query(
      `INSERT INTO wallets (
        id, address, label, entity_type, chain, balance, risk_score,
        tags, description, total_received, total_sent, tx_count,
        first_seen, last_active, position, associated_wallets,
        detected_patterns, role
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18
      )
      ON CONFLICT (id) DO UPDATE SET
        balance = EXCLUDED.balance,
        risk_score = EXCLUDED.risk_score,
        last_active = EXCLUDED.last_active`,
      [
        w.id, w.address, w.label, w.entityType, w.chain, w.balance, w.riskScore,
        w.tags, w.description, w.totalReceived, w.totalSent, w.txCount,
        w.firstSeen, w.lastActive, w.position, w.associatedWallets,
        w.detectedPatterns, w.role
      ]
    );
  }
  console.log(`  âœ“ Inserted ${wallets.length} wallets`);

  // 3. Seed Transactions
  const transactions = [
    {
      id: 'TX-DEMO-001',
      hash: '0x4f8a192bc70010e9f1a2340bceaa771098ef3241',
      from: 'victim',
      to: 'suspect',
      asset: 'USDT',
      amount: 2000,
      amountFormatted: '$2,000 USDT',
      timestamp: '10:31:04 UTC',
      status: 'flagged',
      hopIndex: 1,
      patternTag: 'INITIAL_TRANSFER',
      blockNumber: 19842101,
      chain: 'Ethereum',
      notes: 'Initial fraudulent transfer reported by victim following phishing engagement.',
    },
    {
      id: 'TX-DEMO-002',
      hash: '0x9e21da7782cc90141fbe0924ab119045bdf78120',
      from: 'suspect',
      to: 'walletB',
      asset: 'USDT',
      amount: 800,
      amountFormatted: '$800 USDT',
      timestamp: '10:33:17 UTC',
      status: 'flagged',
      hopIndex: 2,
      patternTag: 'FAN_OUT',
      blockNumber: 19842112,
      chain: 'Ethereum',
      notes: 'Tranche 1 of automated fan-out splitting (40.0% of inflow).',
    },
    {
      id: 'TX-DEMO-003',
      hash: '0x3c77e099274c3991bfb2810aa0492147cc192451',
      from: 'suspect',
      to: 'walletC',
      asset: 'USDT',
      amount: 700,
      amountFormatted: '$700 USDT',
      timestamp: '10:33:28 UTC',
      status: 'flagged',
      hopIndex: 2,
      patternTag: 'FAN_OUT',
      blockNumber: 19842113,
      chain: 'Ethereum',
      notes: 'Tranche 2 of automated fan-out splitting (35.0% of inflow).',
    },
    {
      id: 'TX-DEMO-004',
      hash: '0x8841bb029c771e89dfb38201a0984cfb771920ac',
      from: 'suspect',
      to: 'walletD',
      asset: 'USDT',
      amount: 500,
      amountFormatted: '$500 USDT',
      timestamp: '10:33:41 UTC',
      status: 'flagged',
      hopIndex: 2,
      patternTag: 'FAN_OUT',
      blockNumber: 19842114,
      chain: 'Ethereum',
      notes: 'Tranche 3 of automated fan-out splitting (25.0% of inflow).',
    },
    {
      id: 'TX-DEMO-005',
      hash: '0x2a5fe49b710034a1ceeb04882194bc02aa98e110',
      from: 'walletC',
      to: 'bridge',
      asset: 'USDT',
      amount: 700,
      amountFormatted: '$700 USDT',
      timestamp: '10:35:02 UTC',
      status: 'flagged',
      hopIndex: 3,
      patternTag: 'CROSS_CHAIN',
      blockNumber: 19842120,
      chain: 'Ethereum',
      notes: 'Bridge deposit initiating transfer from Ethereum to Polygon POS.',
    },
    {
      id: 'TX-DEMO-006',
      hash: '0x7b10294e993ef0d418291fbc789123ccae874019',
      from: 'bridge',
      to: 'polygonWallet',
      asset: 'USDT',
      amount: 698,
      amountFormatted: '$698 USDT',
      timestamp: '10:36:11 UTC',
      status: 'flagged',
      hopIndex: 4,
      patternTag: 'CROSS_CHAIN',
      blockNumber: 56981240,
      chain: 'Polygon',
      notes: 'Bridge release of 698 USDT (net $2 bridge fee) to Polygon wallet.',
    },
    {
      id: 'TX-DEMO-007',
      hash: '0x55dc901bce4710182aa1990bcde102377a0984cf',
      from: 'walletB',
      to: 'downstreamDest',
      asset: 'USDT',
      amount: 760,
      amountFormatted: '$760 USDT',
      timestamp: '10:37:24 UTC',
      status: 'flagged',
      hopIndex: 3,
      patternTag: 'RAPID_MOVEMENT',
      blockNumber: 19842131,
      chain: 'Ethereum',
      notes: 'Rapid onward transfer of 95% of received funds within 4 minutes.',
    },
    {
      id: 'TX-DEMO-008',
      hash: '0x19ca33084f7e29103cba781992039cf19a48df01',
      from: 'polygonWallet',
      to: 'exchange',
      asset: 'USDT',
      amount: 680,
      amountFormatted: '$680 USDT',
      timestamp: '10:41:52 UTC',
      status: 'flagged',
      hopIndex: 5,
      patternTag: 'EXCHANGE_INTERACTION',
      blockNumber: 56981272,
      chain: 'Polygon',
      notes: 'Deposit into Demo Exchange hotwallet for potential fiat off-ramping.',
    },
  ];

  for (const t of transactions) {
    await client.query(
      `INSERT INTO transactions (
        id, hash, from_wallet, to_wallet, asset, amount, amount_formatted,
        timestamp, status, hop_index, pattern_tag, block_number, chain, notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        notes = EXCLUDED.notes`,
      [t.id, t.hash, t.from, t.to, t.asset, t.amount, t.amountFormatted,
       t.timestamp, t.status, t.hopIndex, t.patternTag, t.blockNumber, t.chain, t.notes]
    );
  }
  console.log(`  âœ“ Inserted ${transactions.length} transactions`);

  // 4. Seed Cross-Chain Hop
  await client.query(
    `INSERT INTO cross_chain_hops (
      source_chain, target_chain, bridge_entity, bridge_tx_hash,
      claim_tx_hash, asset, amount, amount_formatted, latency_seconds,
      confidence, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    ['Ethereum', 'Polygon', 'Demo Bridge (0xBR1Dge8841029c77E)',
     '0x2a5fe49b710034a1ceeb04882194bc02aa98e110',
     '0x7b10294e993ef0d418291fbc789123ccae874019',
     'USDT', 698, '$700 â†’ $698 net USDT', 69, 89,
     'Cross-chain association is inferred from the simulated bridge event in this demonstration dataset.']
  );
  console.log('  âœ“ Inserted cross-chain hop');

  // 5. Seed Detection Patterns
  const detections = [
    {
      id: 'DET-001',
      title: 'Rapid Movement',
      description: 'Funds were redistributed across downstream destinations within minutes of initial receipt.',
      confidence: 94,
      severity: 'critical',
      affectedNodes: JSON.stringify(['suspect', 'walletB', 'walletC', 'downstreamDest']),
      affectedEdges: JSON.stringify(['TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-004', 'TX-DEMO-007']),
      indicators: JSON.stringify(['Inflow to outflow latency under 240 seconds', 'Wallet B drained 95.0% within 4 minutes', 'Zero holding period typical of automated laundering scripts']),
      evidenceIds: JSON.stringify(['EVD-002', 'EVD-003']),
    },
    {
      id: 'DET-002',
      title: 'Fan-Out',
      description: 'Funds were systematically partitioned across multiple intermediary wallets in rapid succession.',
      confidence: 91,
      severity: 'high',
      affectedNodes: JSON.stringify(['suspect', 'walletB', 'walletC', 'walletD']),
      affectedEdges: JSON.stringify(['TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-004']),
      indicators: JSON.stringify(['3 distinct recipient addresses triggered in 24 seconds', 'Division into $800, $700, and $500 tranches', 'Structural dispersal pattern designed to frustrate linear tracing']),
      evidenceIds: JSON.stringify(['EVD-002']),
    },
    {
      id: 'DET-003',
      title: 'Layering',
      description: 'Multiple sequential hops and intermediary routing hops detected to sever direct transaction linkage.',
      confidence: 87,
      severity: 'high',
      affectedNodes: JSON.stringify(['suspect', 'walletB', 'walletC', 'downstreamDest', 'polygonWallet']),
      affectedEdges: JSON.stringify(['TX-DEMO-002', 'TX-DEMO-003', 'TX-DEMO-005', 'TX-DEMO-007']),
      indicators: JSON.stringify(['Up to 5 execution hops from victim origin', 'Use of intermediary bridge feeder and secondary transit wallets', 'Fragmentation of audit trail across distinct cryptographic accounts']),
      evidenceIds: JSON.stringify(['EVD-002', 'EVD-003', 'EVD-004']),
    },
    {
      id: 'DET-004',
      title: 'Cross-Chain',
      description: 'Funds crossed from Ethereum Mainnet to Polygon POS network via smart contract bridge.',
      confidence: 89,
      severity: 'high',
      affectedNodes: JSON.stringify(['walletC', 'bridge', 'polygonWallet']),
      affectedEdges: JSON.stringify(['TX-DEMO-005', 'TX-DEMO-006']),
      indicators: JSON.stringify(['Ethereum L1 contract deposit of $700 USDT at 10:35:02 UTC', 'Bridge release of $698 USDT on Polygon POS 69 seconds later', 'Known bridging pattern intended to bypass EVM-single-chain monitors']),
      evidenceIds: JSON.stringify(['EVD-004']),
    },
    {
      id: 'DET-005',
      title: 'Exchange Off-Ramp Interaction',
      description: 'Bridged funds reached an identified centralized cryptocurrency exchange deposit hotwallet.',
      confidence: 96,
      severity: 'critical',
      affectedNodes: JSON.stringify(['polygonWallet', 'exchange']),
      affectedEdges: JSON.stringify(['TX-DEMO-008']),
      indicators: JSON.stringify(['Target deposit address tagged as CEX Liquidation Hotwallet', 'Final transfer of $680 USDT on Polygon POS at 10:41:52 UTC', 'High priority vector for legal subpoena and KYC asset preservation']),
      evidenceIds: JSON.stringify(['EVD-005']),
    },
  ];

  for (const d of detections) {
    await client.query(
      `INSERT INTO detection_patterns (
        id, title, description, confidence, severity,
        affected_nodes, affected_edges, indicators, evidence_ids
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        confidence = EXCLUDED.confidence,
        severity = EXCLUDED.severity`,
      [d.id, d.title, d.description, d.confidence, d.severity,
       d.affectedNodes, d.affectedEdges, d.indicators, d.evidenceIds]
    );
  }
  console.log(`  âœ“ Inserted ${detections.length} detection patterns`);

  // 6. Seed Risk Assessment
  const riskSignals = [
    {
      category: 'Rapid Movement',
      scoreContribution: 22,
      maxScore: 25,
      rationale: 'Funds redistributed within 3 minutes of receipt across intermediary wallets without normal holding latency.',
      severity: 'high',
    },
    {
      category: 'Fan-Out',
      scoreContribution: 18,
      maxScore: 20,
      rationale: 'Simultaneous 3-way fund splitting ($800, $700, $500) indicating structured laundering dispersal.',
      severity: 'high',
    },
    {
      category: 'Cross-chain',
      scoreContribution: 15,
      maxScore: 20,
      rationale: 'Movement of funds from Ethereum Mainnet to Polygon POS via liquidity bridge protocol.',
      severity: 'high',
    },
    {
      category: 'Exchange Off-ramp',
      scoreContribution: 13,
      maxScore: 20,
      rationale: 'Bridged funds deposited directly into centralized exchange hotwallet for fiat off-ramping.',
      severity: 'high',
    },
    {
      category: 'Cluster Association',
      scoreContribution: 10,
      maxScore: 15,
      rationale: 'Strong behavioral and temporal association with identified high-velocity intermediary addresses.',
      severity: 'medium',
    },
  ];

  await client.query(
    `INSERT INTO risk_assessments (
      case_id, score, max_score, level, explanation, signals, disclaimer
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'INV-DEMO-2026-001', 78, 100, 'HIGH',
      'The investigated wallet received approximately $2,000 and redistributed most of the funds across multiple intermediary wallets within a short period. A portion of the flow subsequently crossed chains and interacted with an exchange-linked destination.',
      JSON.stringify(riskSignals),
      'Assessment is based on observed transaction behavior and simulated intelligence available within this prototype. It does not constitute a definitive legal determination of criminal culpability.'
    ]
  );
  console.log('  âœ“ Inserted risk assessment');

  // 7. Seed Evidence Records
  const evidence = [
    {
      id: 'EVD-001',
      type: 'Initial Fraud Inflow',
      timestamp: '10:31:04 UTC',
      sourceHash: '0x4f8a192bc70010e9f1a2340bceaa771098ef3241',
      sourceTxId: 'TX-DEMO-001',
      description: 'Victim wallet (0xVIC7...91A) initiated a $2,000 USDT transfer to suspect wallet (0x7A92...F2D) following reported phishing authorization.',
      relatedEntities: JSON.stringify(['0xVIC7a89104b92cf1', '0x7A92d044e1837bF2D']),
      confidence: 100,
      proofType: 'Ethereum On-Chain Cryptographic Receipt',
    },
    {
      id: 'EVD-002',
      type: 'Automated Fan-Out Dispersal',
      timestamp: '10:33:17 - 10:33:41 UTC',
      sourceHash: '0x9e21da7782cc90141fbe0924ab119045bdf78120',
      sourceTxId: 'TX-DEMO-002, TX-DEMO-003, TX-DEMO-004',
      description: 'Suspect wallet distributed $2,000 into three tranches: $800 to Wallet B, $700 to Wallet C, and $500 to Wallet D within a 24-second window.',
      relatedEntities: JSON.stringify(['0x7A92d044e1837bF2D', '0x82BC9910a3746c41A', '0x19DEf4028b489a7C2', '0x44AF7039274c3991B']),
      confidence: 91,
      proofType: 'Multi-Tx Block Confirmation Sequence',
    },
    {
      id: 'EVD-003',
      type: 'Rapid Movement & Drain',
      timestamp: '10:37:24 UTC',
      sourceHash: '0x55dc901bce4710182aa1990bcde102377a0984cf',
      sourceTxId: 'TX-DEMO-007',
      description: 'Wallet B drained 95.0% ($760 of $800) of received funds to downstream address within 4 minutes of arrival, characteristic of pass-through relay accounts.',
      relatedEntities: JSON.stringify(['0x82BC9910a3746c41A', '0xDOWN7741e992b1a99']),
      confidence: 94,
      proofType: 'Temporal Delta Execution Record',
    },
    {
      id: 'EVD-004',
      type: 'Cross-Chain Bridge Movement',
      timestamp: '10:35:02 - 10:36:11 UTC',
      sourceHash: '0x2a5fe49b710034a1ceeb04882194bc02aa98e110',
      sourceTxId: 'TX-DEMO-005, TX-DEMO-006',
      description: 'Wallet C deposited $700 USDT into Demo Bridge contract on Ethereum; matching $698 USDT release occurred 69 seconds later to Polygon wallet (0xP0LY...82A).',
      relatedEntities: JSON.stringify(['0x19DEf4028b489a7C2', '0xBR1Dge8841029c77E', '0xP0LY4910b8359d82A']),
      confidence: 89,
      proofType: 'Cross-Chain Oracle & Bridge Telemetry Match',
    },
    {
      id: 'EVD-005',
      type: 'CEX Exchange Interaction / Off-Ramp',
      timestamp: '10:41:52 UTC',
      sourceHash: '0x19ca33084f7e29103cba781992039cf19a48df01',
      sourceTxId: 'TX-DEMO-008',
      description: 'Polygon wallet transferred $680 USDT to an identified Centralized Exchange deposit hotwallet (0xEXCH...401) representing a high-potential off-ramp point.',
      relatedEntities: JSON.stringify(['0xP0LY4910b8359d82A', '0xEXCH489201cb4d401']),
      confidence: 96,
      proofType: 'Cluster Attribution & Hotwallet Intelligence Tag',
    },
    {
      id: 'EVD-006',
      type: 'Temporal Cluster & Address Association',
      timestamp: '10:31:04 - 10:41:52 UTC',
      sourceHash: 'CLUSTER-ASSOCIATION-001',
      sourceTxId: 'SYNTH-CLUSTER-PROOF',
      description: 'Heuristic clustering correlates suspect wallet and intermediary wallets B, C, D as part of a single coordinated dispersal operation based on execution cadence.',
      relatedEntities: JSON.stringify(['0x7A92d044e1837bF2D', '0x82BC9910a3746c41A', '0x19DEf4028b489a7C2', '0x44AF7039274c3991B']),
      confidence: 88,
      proofType: 'Behavioral Graph Topology & Temporal Heuristics',
    },
  ];

  for (const e of evidence) {
    await client.query(
      `INSERT INTO evidence_records (
        id, type, timestamp, source_hash, source_tx_id,
        description, related_entities, confidence, proof_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (id) DO UPDATE SET
        confidence = EXCLUDED.confidence,
        description = EXCLUDED.description`,
      [e.id, e.type, e.timestamp, e.sourceHash, e.sourceTxId,
       e.description, e.relatedEntities, e.confidence, e.proofType]
    );
  }
  console.log(`  âœ“ Inserted ${evidence.length} evidence records`);

  // 8. Seed Recommended Actions
  const actions = [
    'Review exchange-linked destination activity and serve legal preservation request for account KYC data.',
    'Examine related transactions around the identified time window (10:31:04 - 10:41:52 UTC) across secondary clusters.',
    'Preserve relevant transaction hashes, timestamps, and validator proofs as verified digital evidence.',
    'Review associated wallet activity on Wallet D (0x44AF...91B) to monitor potential dormant fund reactivation ($500 balance).',
    'Investigate the identified cross-chain movement telemetry with the bridge operator for validator log validation.',
    'Correlate the wallet cluster with additional intelligence sources and regional financial intelligence units (FIU).',
  ];

  for (let i = 0; i < actions.length; i++) {
    await client.query(
      `INSERT INTO recommended_actions (case_id, action_text, priority) VALUES ($1, $2, $3)`,
      ['INV-DEMO-2026-001', actions[i], i + 1]
    );
  }
  console.log(`  âœ“ Inserted ${actions.length} recommended actions`);

  // Verification Count
  const { rows: caseRows } = await client.query('SELECT count(*) FROM cases');
  const { rows: walletRows } = await client.query('SELECT count(*) FROM wallets');
  const { rows: txRows } = await client.query('SELECT count(*) FROM transactions');
  const { rows: evdRows } = await client.query('SELECT count(*) FROM evidence_records');

  await client.end();

  console.log('\n🎉 Deployment to Neon Completed Successfully!');
  console.log('📊 Verified Record Counts in Neon:');
  console.log('   - Cases: ' + caseRows[0].count);
  console.log('   - Wallets: ' + walletRows[0].count);
  console.log('   - Transactions: ' + txRows[0].count);
  console.log('   - Evidence Records: ' + evdRows[0].count + '\n');
}

deploy().catch((err) => {
  console.error('\nâ Œ Neon Deployment Failed:', err);
  process.exit(1);
});
