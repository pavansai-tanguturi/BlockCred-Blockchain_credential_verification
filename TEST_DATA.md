# 📊 Complete Test Data Reference

## System Configuration

```json
{
  "network": {
    "name": "Ganache",
    "url": "http://127.0.0.1:7545",
    "chainId": 1337,
    "currency": "ETH"
  },
  "contract": {
    "address": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    "network": "Ganache",
    "deployedBy": "Super Admin Account 0"
  },
  "app": {
    "url": "http://localhost:5173",
    "status": "Running"
  }
}
```

---

## Account Configuration

### Master Account (Super Admin)
```
Role: Contract Owner, University Manager
Address: 0xe19579a4a0a2E5D3e6482373cf3c8B731a98f4bE
Private Key: 0xd11f9d7b809476b7d1f3bc264892631914f533b4abe5cc7a56e2556f150e0f75
ETH Balance: 1000 ETH
Ganache Account: 0
Status: ✅ Already Imported
```

---

## Test Data Set 1: Basic Setup (3 Universities)

### University 1: Delhi University
```
├─ Address: 0x1929737AAA0b12fef12DF881689b2Dc367317AC2
├─ Name: Delhi University
├─ Private Key: 0x946efe74eb02ac48ea8b1d62463f8eac554184c7e9f26191fb035e7067f8cf54
├─ Ganache Account: 1
├─ ETH Balance: 1000 ETH
│
├─ Students:
│  ├─ DU001 | Raj Kumar | Password: raj@123
│  ├─ DU002 | Priya Singh | Password: priya@456
│  └─ DU003 | Anil Patel | Password: anil@789
│
└─ Certificates:
   ├─ To: DU001 (Raj Kumar)
   │  ├─ Branch: Computer Science
   │  ├─ Department: Engineering
   │  ├─ CGPA: 8.5
   │  ├─ IPFS: QmDU001Raj2024Feb27
   │  └─ Date: 27-02-2026
   │
   ├─ To: DU002 (Priya Singh)
   │  ├─ Branch: Electronics
   │  ├─ Department: Engineering
   │  ├─ CGPA: 9.1
   │  ├─ IPFS: QmDU002Priya2024Feb27
   │  └─ Date: 27-02-2026
   │
   └─ To: DU003 (Anil Patel)
      ├─ Branch: Mechanical
      ├─ Department: Engineering
      ├─ CGPA: 8.3
      ├─ IPFS: QmDU003Anil2024Feb27
      └─ Date: 27-02-2026
```

### University 2: Mumbai University
```
├─ Address: 0xC07050726Ecb9288C19B470AF8eA16d4C1780f81
├─ Name: Mumbai University
├─ Private Key: 0x8bd32c8016f8e72b452182728a5c8bde2996030e9d7f94c1f519dd29f8c42685
├─ Ganache Account: 2
├─ ETH Balance: 1000 ETH
│
├─ Students:
│  ├─ MU001 | Amit Das | Password: amit@2026
│  ├─ MU002 | Neha Gupta | Password: neha@8000
│  └─ MU003 | Pooja Sharma | Password: pooja@3030
│
└─ Certificates:
   ├─ To: MU001 (Amit Das)
   │  ├─ Branch: Mechanical Engineering
   │  ├─ Department: Engineering
   │  ├─ CGPA: 8.8
   │  ├─ IPFS: QmMU001Amit2024Feb27
   │  └─ Date: 27-02-2026
   │
   ├─ To: MU002 (Neha Gupta)
   │  ├─ Branch: Civil Engineering
   │  ├─ Department: Engineering
   │  ├─ CGPA: 8.9
   │  ├─ IPFS: QmMU002Neha2024Feb27
   │  └─ Date: 27-02-2026
   │
   └─ To: MU003 (Pooja Sharma)
      ├─ Branch: Architecture
      ├─ Department: Design
      ├─ CGPA: 8.6
      ├─ IPFS: QmMU003Pooja2024Feb27
      └─ Date: 27-02-2026
```

### University 3: Bangalore Institute of Technology
```
├─ Address: 0xe9b7AB01ab679e11994914CEDE31Ec6d9C847252
├─ Name: Bangalore Institute of Technology
├─ Private Key: 0x6076e1cc2e7d60934edc2c2e82da000664fcd594e98ad29faa4ab3744fcb6d65
├─ Ganache Account: 3
├─ ETH Balance: 1000 ETH
│
├─ Students:
│  ├─ BIT001 | Vikram Sharma | Password: vikram@pass
│  ├─ BIT002 | Sanjana Roy | Password: sanjana@pass
│  └─ BIT003 | Ravi Kumar | Password: ravi@secure
│
└─ Certificates:
   ├─ To: BIT001 (Vikram Sharma)
   │  ├─ Branch: Information Technology
   │  ├─ Department: Engineering
   │  ├─ CGPA: 9.3
   │  ├─ IPFS: QmBIT001Vikram2024Feb27
   │  └─ Date: 27-02-2026
   │
   ├─ To: BIT002 (Sanjana Roy)
   │  ├─ Branch: Data Science
   │  ├─ Department: Engineering
   │  ├─ CGPA: 9.2
   │  ├─ IPFS: QmBIT002Sanjana2024Feb27
   │  └─ Date: 27-02-2026
   │
   └─ To: BIT003 (Ravi Kumar)
      ├─ Branch: Artificial Intelligence
      ├─ Department: Engineering
      ├─ CGPA: 9.0
      ├─ IPFS: QmBIT003Ravi2024Feb27
      └─ Date: 27-02-2026
```

---

## Test Data Set 2: Extended Setup (5 Universities)

### Additional University 4: Chennai Institute
```
├─ Address: 0xA900E4691DC3AC3dfe9a88a833BCdc26d3f80410
├─ Name: Chennai Institute of Technology
├─ Private Key: 0x167a20d84fda089a247052a4618aba2efa7653b7301081af0fde6a61f03b6388
├─ Ganache Account: 4
│
├─ Students:
│  └─ CIT001 | Deepak Reddy | Password: deepak@2024
│
└─ Certificate:
   └─ CSE Degree | CGPA: 8.7 | Date: 27-02-2026
```

### Additional University 5: Hyderabad University
```
├─ Address: 0x756317fb3c57Be14aE08d2aA6c7b456D9657475A
├─ Name: Hyderabad University
├─ Private Key: 0x45888792d1fc40a575089c9855ff7294c29326b59997d75fe8c69508178be174
├─ Ganache Account: 5
│
├─ Students:
│  └─ HU001 | Anjali Singh | Password: anjali@pass
│
└─ Certificate:
   └─ ECE Degree | CGPA: 9.0 | Date: 27-02-2026
```

---

## Test Cases Execution Checklist

### Phase 1: Blockchain Setup ✅
- [ ] Ganache running on port 7545
- [ ] MetaMask connected to Ganache (Chain ID: 1337)
- [ ] Super Admin account imported
- [ ] React app running on localhost:5173

### Phase 2: University Registration (10 minutes)
- [ ] Register Delhi University (0x1929...)
- [ ] Register Mumbai University (0xC070...)
- [ ] Register Bangalore Institute (0xe9b7...)
- [ ] (Optional) Register Chennai Institute (0xA900...)
- [ ] (Optional) Register Hyderabad University (0x7563...)

### Phase 3: Student Registration (20 minutes)
- [ ] Delhi: Register 3 students (DU001, DU002, DU003)
- [ ] Mumbai: Register 3 students (MU001, MU002, MU003)
- [ ] Bangalore: Register 3 students (BIT001, BIT002, BIT003)

### Phase 4: Issue Certificates (15 minutes)
- [ ] Delhi: Issue 3 certificates
- [ ] Mumbai: Issue 3 certificates
- [ ] Bangalore: Issue 3 certificates

### Phase 5: Test Student Portal (10 minutes)
- [ ] Student DU001 login & view certs
- [ ] Student MU001 login & view certs
- [ ] Student BIT001 login & view certs

### Phase 6: Test Employee Verification (10 minutes)
- [ ] Employee login (emp1 / emp@123)
- [ ] Verify certificate from Delhi Univ
- [ ] Verify certificate from Mumbai Univ
- [ ] Verify certificate from Bangalore

### Phase 7: Test Revocation (5 minutes)
- [ ] Revoke one certificate with reason
- [ ] Verify status changed to "Revoked"

**Total Time: ~70 minutes for complete testing**

---

## SQL-Style Data Format (For Reference)

### universities table
```
╔═════════════════════════════════════════════════════════════╗
║ WALLET_ADDRESS                      │ NAME                  ║
╠═════════════════════════════════════════════════════════════╣
║ 0x1929737AAA0b12fef12DF881689b2Dc367317AC2 │ Delhi University      ║
║ 0xC07050726Ecb9288C19B470AF8eA16d4C1780f81 │ Mumbai University     ║
║ 0xe9b7AB01ab679e11994914CEDE31Ec6d9C847252 │ Bangalore Institute   ║
║ 0xA900E4691DC3AC3dfe9a88a833BCdc26d3f80410 │ Chennai Institute     ║
║ 0x756317fb3c57Be14aE08d2aA6c7b456D9657475A │ Hyderabad University  ║
╚═════════════════════════════════════════════════════════════╝
```

### students table
```
╔════════════════════════════════════════════════════════════════════════════╗
║ ID   │ NAME           │ UNI_ADDRESS              │ REGISTERED │ PASSWORD   ║
╠════════════════════════════════════════════════════════════════════════════╣
║ DU001│ Raj Kumar      │ 0x1929...               │ YES        │ raj@123    ║
║ DU002│ Priya Singh    │ 0x1929...               │ YES        │ priya@456  ║
║ DU003│ Anil Patel     │ 0x1929...               │ YES        │ anil@789   ║
║ MU001│ Amit Das       │ 0xC070...               │ YES        │ amit@2026  ║
║ MU002│ Neha Gupta     │ 0xC070...               │ YES        │ neha@8000  ║
║ MU003│ Pooja Sharma   │ 0xC070...               │ YES        │ pooja@3030 ║
║ BIT01│ Vikram Sharma  │ 0xe9b7...               │ YES        │ vikram@pass║
║ BIT02│ Sanjana Roy    │ 0xe9b7...               │ YES        │ sanjana@pas║
║ BIT03│ Ravi Kumar     │ 0xe9b7...               │ YES        │ ravi@secure║
╚════════════════════════════════════════════════════════════════════════════╝
```

### certificates table
```
╔═══════════════════════════════════════════════════════════════════════════╗
║ HASH   │ STUDENT_ID │ CGPA  │ BRANCH        │ STATUS   │ ISSUED_BY     ║
╠═══════════════════════════════════════════════════════════════════════════╣
║ Hash1  │ DU001      │ 8.5   │ CS            │ Active   │ 0x1929...     ║
║ Hash2  │ DU002      │ 9.1   │ ECE           │ Active   │ 0x1929...     ║
║ Hash3  │ DU003      │ 8.3   │ Mechanical    │ Active   │ 0x1929...     ║
║ Hash4  │ MU001      │ 8.8   │ Mechanical    │ Active   │ 0xC070...     ║
║ Hash5  │ MU002      │ 8.9   │ Civil         │ Active   │ 0xC070...     ║
║ Hash6  │ MU003      │ 8.6   │ Architecture  │ Active   │ 0xC070...     ║
║ Hash7  │ BIT001     │ 9.3   │ IT            │ Active   │ 0xe9b7...     ║
║ Hash8  │ BIT002     │ 9.2   │ Data Science  │ Active   │ 0xe9b7...     ║
║ Hash9  │ BIT003     │ 9.0   │ AI            │ Active   │ 0xe9b7...     ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## Blockchain Transaction Details

When you perform an action, you'll see on Ganache:

```
example transaction log:
├─ Transaction: 0x926dd231b6b749c055d6f9705caf740bf633345250c6b2bb6f8dcdddab5db638
├─ Block Number: 1
├─ Gas Used: 3305956
├─ Status: Success ✅
│
└─ Events Fired:
   └─ UniversityRegistered(0x1929..., "Delhi University")
```

---

## Employee Test Credentials

**Employee Portal Login** (Fixed, not blockchain-based):
```
Employee ID: emp1
Password: emp@123

These are hardcoded credentials in Employee.jsx
Used for certificate verification only (read-only operations)
```

---

## Common Certificate Hash Examples

After issuing a certificate, you get a hash like:
```
0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f

This hash is unique for each certificate and is generated from:
├─ Student ID
├─ Student Name
├─ CGPA
├─ Issue Date
└─ Issuing University Address
```

Use this hash to verify in the Employee portal!

---

## Metrics to Track

After setup, you should see:

```
Universities Registered: 3 (or 5)
Total Students: 9 (or more)
Total Certificates: 9 (or more)
Success Rate: 100%
Failed Transactions: 0
```

---

That's your complete test data reference! 🎓
