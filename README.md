# BlockCred

Decentralized academic credential issuance, verification, and revocation using Ethereum smart contracts and IPFS.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Performance Notes](#performance-notes)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [User Flows](#user-flows)
- [Scalability](#scalability)
- [Security](#security)
- [Abstract](#abstract)

## Overview

BlockCred is a full-lifecycle DApp for academic records, not just a verify-only demo.

It supports:
- University onboarding by owner/admin
- Student registration
- Certificate issuance with deterministic credential hashing
- Public verification of issued credentials
- Issuer-restricted revocation with on-chain traceability

## Features

- **Role-based access (3 roles)**
  - Super Admin (contract owner)
  - University
  - Public verifier/recruiter (plus student login flow)

- **Core entities (3)**
  - University
  - Student
  - Certificate

- **Credential lifecycle**
  - Register university → onboard student → issue certificate → verify publicly → revoke if needed

- **Auditability**
  - Smart-contract events are emitted for major state transitions

- **Certificate states (2)**
  - `Active`
  - `Revoked`

## Architecture

The contract is centered on mapping-based storage for direct lookups:

- University by wallet address
- Student by `studentId`
- Certificate by `credentialHash`

Issuance is handled in a single transaction that performs:
1. Hash generation (`keccak256`)
2. Certificate persistence
3. University-wise index update
4. Event emission

Public verification is a direct hash lookup (no permission gate).

## Performance Notes

- Primary lookups are **O(1)** due to mappings.
- Public verification path is optimized for direct reads.
- Indexed retrieval exists for:
  - Global issued hash list
  - Per-university issued hash list

## Tech Stack

- **Frontend:** React + Vite
- **Smart Contracts:** Solidity `^0.8.20`
- **Blockchain (local):** Ganache
- **Web3:** Ethers.js
- **Storage:** IPFS (CID references)
- **Tooling:** Hardhat, MetaMask, VS Code

## Project Structure

```text
.
├── contracts/              # Solidity contracts
├── scripts/                # Deployment and verification scripts
├── test/                   # Hardhat tests
├── client/                 # React frontend
├── hardhat.config.js
└── README.md
```

## Quick Start

### 1) Install dependencies

```bash
npm install
cd client && npm install
```

### 2) Start local blockchain (Ganache)

Use Ganache UI or CLI:

```bash
ganache-cli -p 7545
```

### 3) Compile and deploy contracts

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network ganache
```

### 4) Run frontend

```bash
cd client
npm run dev
```

### 5) Connect MetaMask

- Switch MetaMask to Ganache network
- Import Ganache test accounts
- Use Admin / University / Student / Verifier views

## User Flows

### Admin
- Register authorized university wallets

### University
- Add students
- Issue credentials
- Revoke credentials issued by same university

### Student
- Access student-specific credential details

### Public Verifier / Recruiter
- Verify credential status using credential hash

## Scalability

As data grows:

- Direct credential verification remains constant-time per credential.
- Array-returning list methods may become heavy at high scale:
  - `getIssuedHashes`
  - `getRegisteredStudentIds`
  - `getAllUniversityAddresses`

Recommended production approach:
- Index events off-chain (subgraph/indexer)
- Keep on-chain calls focused on direct hash verification
- Add pagination/indexing strategy at app/query layer

## Security

- Credential authenticity derives from deterministic `keccak256` hashing plus issuer identity.
- Credentials are immutable after issuance except explicit status transition from `Active` to `Revoked`.
- Revocation is restricted to the original issuing university.
- University access control is owner-governed.

## Abstract

BlockCred provides a decentralized framework for issuing and verifying academic credentials. It addresses forgery risk, validation delays, and centralized trust bottlenecks by recording cryptographic proofs on Ethereum and referencing certificate files through IPFS. The system combines role-based control, lifecycle management, and issuer-restricted revocation to deliver transparent, tamper-resistant, and efficient credential verification for institutions and recruiters.
