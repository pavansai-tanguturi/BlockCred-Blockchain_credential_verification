# 🚀 Quick Start Guide - Copy-Paste Ready

## Start ganache
ganache --mnemonic "test test test test test test test test test test test junk" --chain.chainId 1337 --host 127.0.0.1 --port 7545

## Your Current Setup
- **Super Admin Account**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- **Contract Address**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **Ganache Network**: Port 7545, Chain ID 1337
- **RPC URL**: `http://127.0.0.1:7545`

---

## 5-Minute Quick Start

### Step 1: Open Your App
Go to: `http://localhost:5173`

### Step 2: Login as Super Admin
1. Click **"Connect MetaMask Wallet"** button
2. Make sure MetaMask shows: **Account 0** (0xe195...)
3. ✅ You're logged in as **Super Admin**

### Step 3: Register Universities (COPY-PASTE THESE)

**Click "MANAGE UNIVERSITIES" → Fill Form → Click Register**

#### University 1:
```
Wallet: 0x1929737AAA0b12fef12DF881689b2Dc367317AC2
Name: Delhi University
```

#### University 2:
```
Wallet: 0xC07050726Ecb9288C19B470AF8eA16d4C1780f81
Name: Mumbai University
```

#### University 3:
```
Wallet: 0xe9b7AB01ab679e11994914CEDE31Ec6d9C847252
Name: Bangalore Institute of Technology
```

---

## Using University Account

### To Switch to University Account:
1. In MetaMask, click **Account** dropdown
2. Click **"Import Account"**
3. Paste **Private Key** from Ganache output
4. Refresh your app and login

### University Private Keys:
```
Delhi University: 0x946efe74eb02ac48ea8b1d62463f8eac554184c7e9f26191fb035e7067f8cf54
Mumbai University: 0x8bd32c8016f8e72b452182728a5c8bde2996030e9d7f94c1f519dd29f8c42685
Bangalore Institute: 0x6076e1cc2e7d60934edc2c2e82da000664fcd594e98ad29faa4ab3744fcb6d65
```

### Register Students (COPY-PASTE DATA):

**Click "ADD STUDENT" → Fill Form → Click Register**

#### In Delhi University Account:
```
Student 1:
├─ ID: DU001
├─ Name: Raj Kumar
└─ Password: raj@123

Student 2:
├─ ID: DU002
├─ Name: Priya Singh
└─ Password: priya@456
```

#### In Mumbai University Account:
```
Student 1:
├─ ID: MU001
├─ Name: Amit Das
└─ Password: amit@2026

Student 2:
├─ ID: MU002
├─ Name: Neha Gupta
└─ Password: neha@8000
```

#### In Bangalore Institute Account:
```
Student 1:
├─ ID: BIT001
├─ Name: Vikram Sharma
└─ Password: vikram@pass

Student 2:
├─ ID: BIT002
├─ Name: Sanjana Roy
└─ Password: sanjana@pass
```

---

## Issue Certificates

**Click "ISSUE CERTIFICATE" → Fill Form → Click Issue**

### Certificate Examples (COPY-PASTE):

#### Delhi University Issues to Raj Kumar:
```
Student ID: DU001
Student Name: Raj Kumar
Branch: Computer Science
Department: Engineering
CGPA: 8.5
IPFS Hash: QmExample1Hash2024Feb27Demo
Issued Date: 27-02-2026
```

#### Delhi University Issues to Priya Singh:
```
Student ID: DU002
Student Name: Priya Singh
Branch: Electronics
Department: Engineering
CGPA: 9.1
IPFS Hash: QmExample2Hash2024Feb27Demo
Issued Date: 27-02-2026
```

#### Mumbai University Issues to Amit Das:
```
Student ID: MU001
Student Name: Amit Das
Branch: Mechanical Engineering
Department: Engineering
CGPA: 8.8
IPFS Hash: QmExample3Hash2024Feb27Demo
Issued Date: 27-02-2026
```

#### Bangalore Institute Issues to Vikram Sharma:
```
Student ID: BIT001
Student Name: Vikram Sharma
Branch: Information Technology
Department: Engineering
CGPA: 9.3
IPFS Hash: QmExample4Hash2024Feb27Demo
Issued Date: 27-02-2026
```

---

## Student Login & View Certificates

1. Go to **Student Portal**
2. Login with these credentials:

```
Login 1 (Raj Kumar):
├─ Student ID: DU001
└─ Password: raj@123

Login 2 (Priya Singh):
├─ Student ID: DU002
└─ Password: priya@456

Login 3 (Amit Das):
├─ Student ID: MU001
└─ Password: amit@2026

Login 4 (Vikram Sharma):
├─ Student ID: BIT001
└─ Password: vikram@pass
```

---

## Employee Verify Certificate

1. Go to **Employee Portal**
2. Default Login:
   ```
   Employee ID: emp1
   Password: emp@123
   ```
3. Copy the **Certificate Hash** (shown after issuing)
4. Paste in **"Enter Hash to Verify"** field
5. Click **Verify** button
6. View full certificate details

---

## What to Expect

### ✅ Successful Steps:
- "University registered successfully"
- "Student registered successfully"
- "Certificate issued successfully"
- Certificate hash displayed

### ❌ Common Errors & Solutions:

| Error | Solution |
|-------|----------|
| "This wallet is not authorized" | Switch MetaMask to Super Admin account (Account 0) |
| "Not an authorized university" | Switch to University account AND register student as that university |
| "Student is not registered" | Register the student first in the university account |
| "Credential with this hash already exists" | Each certificate must have unique (studentId, name, cgpa, date, issuer) combo |

---

## File Locations

```
Smart Contract:
└─ /contracts/Credential.sol

React Components:
├─ /client/src/Admin.jsx (Super Admin Panel)
├─ /client/src/Employee.jsx (Verifier Portal)
├─ /client/src/Student.jsx (Student Portal)
└─ /client/src/Home.jsx (Landing Page)

Contract ABI:
└─ /client/src/artifacts/contracts/Credential.sol/Credential.json

Ganache Terminal:
└─ Account list & private keys displayed on startup
```

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        SUPER ADMIN                          │
│  (Manage Universities Registration & Removal)               │
└──────────┬──────────────────────────────────────────────────┘
           │
           ├─→ Register University 1 ──┐
           ├─→ Register University 2 ──┤
           └─→ Register University 3 ──┤
                                       │
                                       ▼
        ┌──────────────────────────────────────────────┐
        │              UNIVERSITIES                     │
        │ (Register Students & Issue Certificates)     │
        ├──────────────┬──────────────┬─────────────────┤
        │              │              │                 │
        ▼              ▼              ▼                 ▼
    ┌─────────┐  ┌──────────┐  ┌──────────────┐
    │Delhi    │  │Mumbai    │  │Bangalore     │
    │Univ.    │  │Univ.     │  │Institute     │
    └────┬────┘  └────┬─────┘  └──────┬───────┘
         │            │               │
         ├→ DU001     ├→ MU001        ├→ BIT001
         ├→ DU002     ├→ MU002        ├→ BIT002
         │(Register)  │(Register)     │(Register)
         │            │               │
         ├→ Issuing Certificates
         │
         ▼
    ┌────────────────┐
    │  STUDENTS      │  Login & View Certificates
    └────────────────┘
    
    ┌────────────────┐
    │  EMPLOYEES     │  Verify Using Hash
    └────────────────┘
```

---

## Common Questions

**Q: How many universities can I add?**  
A: Unlimited! Same process for each.

**Q: Can a student have multiple certificates?**  
A: Yes! University can issue multiple certs for same student with different dates/branches.

**Q: What's the IPFS Hash for?**  
A: Link to the actual certificate file stored on IPFS. It's metadata linking blockchain to content.

**Q: Can a university revoke a certificate?**  
A: Yes! Only the issuing university can revoke their issued certificates.

**Q: How to export certificate?**  
A: Certificate hash acts as a blockchain proof. Anyone can verify using Employee portal.

---

Good luck! Start with Step 1: **Register Universities** 🎓
