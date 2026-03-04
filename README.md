# BlockCred

**Blockchain credential verification for academic records.**

BlockCred is a decentralized application (DApp) that issues, verifies, and revokes academic credentials using Ethereum smart contracts and IPFS-backed document storage.

## Project Depth

This project is not just a basic verify-only demo. It implements a full credential lifecycle with role-based permissions and on-chain auditability.

- **3 roles**: Super Admin (owner), University, Public Verifier/Recruiter (+ student login flow)
- **3 core on-chain entities**: University, Student, Certificate
- **6 smart-contract events** for traceability and audit logs
- **2 certificate states**: `Active` and `Revoked`
- **End-to-end lifecycle**: university registration → student onboarding → certificate issuance → public verification → revocation

## Working Performance (with Numbers)

Performance characteristics from the current contract architecture:

- **O(1) reads/writes** for primary lookups using mappings:
  - University by wallet
  - Student by `studentId`
  - Certificate by `credentialHash`
- **Single-transaction issuance flow**:
  - Hash generation (`keccak256`)
  - Certificate persistence
  - University-wise index update
  - Event emission
- **Public verification path** is direct hash lookup (no permission gating), designed for fast reads.
- **Indexed retrieval support**:
  - Global issued hash list
  - Per-university issued hash list

## Scalability Notes

The contract is designed to scale with growing records by using mapping-based storage for constant-time access. As data grows:

- Lookup and verification remain **constant-time** for individual credentials.
- Historical listing functions (`getIssuedHashes`, `getRegisteredStudentIds`, `getAllUniversityAddresses`) are array-returning views and may become heavy for very large datasets.
- For production-scale deployments, the recommended pattern is:
  - Use events + off-chain indexing (e.g., subgraph/indexer)
  - Keep on-chain calls focused on direct hash-based verification
  - Paginate or index list views at the application layer

## Security and Integrity Highlights

- Credential authenticity is tied to a deterministic hash (`keccak256`) and issuer address.
- Credentials are immutable post-issuance except explicit status transition (`Active` → `Revoked`).
- Revocation is restricted to the original issuing university.
- University access is owner-governed via registration checks.

## Tech Stack

- **Frontend**: React + Vite
- **Smart Contracts**: Solidity (`^0.8.20`)
- **Blockchain Environment**: Ethereum (Ganache local network)
- **Web3 Library**: Ethers.js
- **Storage**: IPFS (CID-based file reference)
- **Dev Tools**: Hardhat, MetaMask, VS Code

## Quick Start

### 1) Install dependencies

```bash
npm install
cd client && npm install
```

### 2) Run local chain (Ganache)

- Start Ganache UI workspace
- Or run CLI:

```bash
ganache-cli -p 7545
```

### 3) Compile and deploy

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache
```

### 4) Start frontend

```bash
cd client
npm run dev
```

### 5) Connect MetaMask

- Switch to Ganache network
- Import test accounts
- Interact with Admin / University / Student / Verifier flows

## Formal Abstract (Final-Year Style)

BlockCred presents a decentralized framework for secure academic credential issuance and verification. The system addresses limitations of traditional certificate management, including forgery risks, delayed validation, and centralized trust bottlenecks. In the proposed architecture, authorized universities issue credentials whose cryptographic proofs are recorded on Ethereum, while associated certificate files are referenced through IPFS. The implementation includes role-based operational control, credential lifecycle management, and issuer-restricted revocation. By combining immutable on-chain records with decentralized file addressing, the system provides transparent, tamper-resistant, and efficiently verifiable academic credentials suitable for institutional and recruitment workflows.
