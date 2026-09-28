-- MONOMER Investigation Schema for Neon Postgres

-- 1. Investigation Cases
CREATE TABLE IF NOT EXISTS cases (
    case_id VARCHAR(64) PRIMARY KEY,
    case_name VARCHAR(255) NOT NULL,
    target_address VARCHAR(128) NOT NULL,
    start_time VARCHAR(64),
    end_time VARCHAR(64),
    status VARCHAR(64),
    chains JSONB,
    total_value NUMERIC,
    transaction_count INT,
    wallet_count INT,
    risk_score INT,
    classification VARCHAR(255),
    reporting_victim VARCHAR(128),
    jurisdiction VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Wallets / Nodes
CREATE TABLE IF NOT EXISTS wallets (
    id VARCHAR(64) PRIMARY KEY,
    address VARCHAR(128) NOT NULL,
    label VARCHAR(255),
    entity_type VARCHAR(64),
    chain VARCHAR(64),
    balance VARCHAR(64),
    risk_score INT,
    tags JSONB,
    description TEXT,
    total_received VARCHAR(64),
    total_sent VARCHAR(64),
    tx_count INT,
    first_seen VARCHAR(64),
    last_active VARCHAR(64),
    position JSONB,
    associated_wallets JSONB,
    detected_patterns JSONB,
    role VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Transactions / Edges
CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(64) PRIMARY KEY,
    hash VARCHAR(128) NOT NULL,
    from_wallet VARCHAR(64) NOT NULL,
    to_wallet VARCHAR(64) NOT NULL,
    asset VARCHAR(32),
    amount NUMERIC,
    amount_formatted VARCHAR(64),
    timestamp VARCHAR(64),
    status VARCHAR(32),
    hop_index INT,
    pattern_tag VARCHAR(64),
    block_number BIGINT,
    chain VARCHAR(64),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Cross Chain Hops
CREATE TABLE IF NOT EXISTS cross_chain_hops (
    id SERIAL PRIMARY KEY,
    source_chain VARCHAR(64),
    target_chain VARCHAR(64),
    bridge_entity VARCHAR(255),
    bridge_tx_hash VARCHAR(128),
    claim_tx_hash VARCHAR(128),
    asset VARCHAR(32),
    amount NUMERIC,
    amount_formatted VARCHAR(64),
    latency_seconds INT,
    confidence INT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Detection Patterns
CREATE TABLE IF NOT EXISTS detection_patterns (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    confidence INT,
    severity VARCHAR(32),
    affected_nodes JSONB,
    affected_edges JSONB,
    indicators JSONB,
    evidence_ids JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Risk Assessment
CREATE TABLE IF NOT EXISTS risk_assessments (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(64) REFERENCES cases(case_id) ON DELETE CASCADE,
    score INT,
    max_score INT,
    level VARCHAR(32),
    explanation TEXT,
    signals JSONB,
    disclaimer TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Evidence Records
CREATE TABLE IF NOT EXISTS evidence_records (
    id VARCHAR(64) PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    timestamp VARCHAR(64),
    source_hash VARCHAR(128),
    source_tx_id VARCHAR(128),
    description TEXT,
    related_entities JSONB,
    confidence INT,
    proof_type VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Recommended Actions
CREATE TABLE IF NOT EXISTS recommended_actions (
    id SERIAL PRIMARY KEY,
    case_id VARCHAR(64) REFERENCES cases(case_id) ON DELETE CASCADE,
    action_text TEXT NOT NULL,
    priority INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for fast forensic querying
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
CREATE INDEX IF NOT EXISTS idx_wallets_chain ON wallets(chain);
CREATE INDEX IF NOT EXISTS idx_transactions_from ON transactions(from_wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_to ON transactions(to_wallet);
CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(hash);
