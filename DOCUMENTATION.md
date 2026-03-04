# 🎓 Credential Management System - Complete Documentation

## 📋 Table of Contents
1. [System Overview](#system-overview)
2. [User Roles](#user-roles)
3. [Step-by-Step Guide](#step-by-step-guide)
4. [Demo Test Cases](#demo-test-cases)
5. [Troubleshooting](#troubleshooting)

---

## System Overview

This is a **Blockchain-based Credential Management System** where:
- **Super Admin** manages universities
- **Universities** register students and issue/revoke certificates
- **Students** log in to view their certificates
- **Employees/Verifiers** verify certificate hashes
- All data is stored on the **Ganache Blockchain** and tracked on **IPFS**

---

## User Roles

### 1. **Super Admin** (Contract Owner)
- Register new universities
- Remove universities
- View all registered universities
- **Current Address**: `0xe19579a4a0a2E5D3e6482373cf3c8B731a98f4bE` (Ganache Account 0)

### 2. **University/College**
- Register students
- Update student passwords
- Issue certificates to students
- Revoke certificates (with reason)
- View students and issued certificates

### 3. **Student**
- View their profile
- See all their issued certificates
- Check certificate status (Active/Revoked)
- View certificate details (CGPA, Department, Branch, etc.)

### 4. **Employee/Verifier**
- Verify certificates using certificate hash
- Check certificate authenticity
- View certificate status and details

---

## Step-by-Step Guide

### **STEP 1: Register Universities (Colleges)**

#### How to Do It:
1. **Login as Super Admin** (Already done in your screenshot)
2. Click **"MANAGE UNIVERSITIES"** button
3. Fill in the form:
   - **University Wallet Address**: MetaMask address of the university
   - **University Name**: Name of the college/university
4. Click **"Register University"** button

---

## Demo Test Cases

### **Test Case 1: Register 3 Universities**

```
SUPER ADMIN ACTION: Register Universities

┌─────────────────────────────────────────────────────────┐
│ UNIVERSITY 1                                            │
├─────────────────────────────────────────────────────────┤
│ Wallet Address: 0x1929737AAA0b12fef12DF881689b2Dc367317AC2 │
│ University Name: Delhi University                        │
│ Account: Ganache Account 1 (1000 ETH)                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ UNIVERSITY 2                                            │
├─────────────────────────────────────────────────────────┤
│ Wallet Address: 0xC07050726Ecb9288C19B470AF8eA16d4C1780f81 │
│ University Name: Mumbai University                      │
│ Account: Ganache Account 2 (1000 ETH)                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ UNIVERSITY 3                                            │
├─────────────────────────────────────────────────────────┤
│ Wallet Address: 0xe9b7AB01ab679e11994914CEDE31Ec6d9C847252 │
│ University Name: Bangalore Institute of Technology      │
│ Account: Ganache Account 3 (1000 ETH)                   │
└─────────────────────────────────────────────────────────┘
```

#### Steps:
1. In Admin Panel, go to **MANAGE UNIVERSITIES**
2. Copy first university wallet: `0x1929737AAA0b12fef12DF881689b2Dc367317AC2`
3. Paste in "University Wallet Address" field
4. Type: `Delhi University`
5. Click **Register** button
6. Repeat for University 2 and 3 with their addresses and names

---

### **Test Case 2: Import University Accounts & Register Students**

#### Import Account in MetaMask:
1. Open MetaMask
2. Click **Account Icon** → **Import Account**
3. Copy private key from Ganache output:
   ```
   Account 1 Private Key: 0x946efe74eb02ac48ea8b1d62463f8eac554184c7e9f26191fb035e7067f8cf54
   Account 2 Private Key: 0x8bd32c8016f8e72b452182728a5c8bde2996030e9d7f94c1f519dd29f8c42685
   Account 3 Private Key: 0x6076e1cc2e7d60934edc2c2e82da000664fcd594e98ad29faa4ab3744fcb6d65
   ```
4. After import, use these accounts in the app

#### Register Students:
Switch to **University Account** and click **ADD STUDENT**:

```
DELHI UNIVERSITY - REGISTER STUDENTS

Student 1:
├─ Student ID: DU001
├─ Name: Raj Kumar
└─ Password: raj@123secure

Student 2:
├─ Student ID: DU002
├─ Name: Priya Singh
└─ Password: priya@456secure

Student 3:
├─ Student ID: DU003
├─ Name: Anil Patel
└─ Password: anil@789secure

─────────────────────────────────────

MUMBAI UNIVERSITY - REGISTER STUDENTS

Student 1:
├─ Student ID: MU001
├─ Name: Amit Das
└─ Password: amit@2026secure

Student 2:
├─ Student ID: MU002
├─ Name: Neha Gupta
└─ Password: neha@8000secure

─────────────────────────────────────

BANGALORE INSTITUTE - REGISTER STUDENTS

Student 1:
├─ Student ID: BIT001
├─ Name: Vikram Sharma
└─ Password: vikram@pass123

Student 2:
├─ Student ID: BIT002
├─ Name: Sanjana Roy
└─ Password: sanjana@pass456
```

#### How to Register:
1. Make sure MetaMask is switched to the **University Account**
2. Click **"ADD STUDENT"** button
3. Fill in:
   - **Student ID**: DU001
   - **Name**: Raj Kumar
   - **Password**: raj@123secure
4. Click **Register Student**
5. Repeat for all students

---

### **Test Case 3: Issue Certificates**

#### Switch to University Account and Click "ISSUE CERTIFICATE":

```
CERTIFICATE 1 - Delhi University to Raj Kumar
├─ Student ID: DU001
├─ Student Name: Raj Kumar
├─ Branch: Computer Science
├─ Department: Engineering
├─ CGPA: 8.5
├─ IPFS Hash: QmExample1Hash2024February27
└─ Issued Date: 27-02-2026

CERTIFICATE 2 - Delhi University to Priya Singh
├─ Student ID: DU002
├─ Student Name: Priya Singh
├─ Branch: Electronics
├─ Department: Engineering
├─ CGPA: 9.1
├─ IPFS Hash: QmExample2Hash2024February27
└─ Issued Date: 27-02-2026

CERTIFICATE 3 - Mumbai University to Amit Das
├─ Student ID: MU001
├─ Student Name: Amit Das
├─ Branch: Mechanical
├─ Department: Engineering
├─ CGPA: 8.8
├─ IPFS Hash: QmExample3Hash2024February27
└─ Issued Date: 27-02-2026

CERTIFICATE 4 - Bangalore Institute to Vikram Sharma
├─ Student ID: BIT001
├─ Student Name: Vikram Sharma
├─ Branch: Information Technology
├─ Department: Engineering
├─ CGPA: 9.3
├─ IPFS Hash: QmExample4Hash2024February27
└─ Issued Date: 27-02-2026
```

#### Steps:
1. Switch MetaMask to **Delhi University Account**
2. Click **"ISSUE CERTIFICATE"**
3. Fill all fields as shown above
4. Click **Issue Certificate**
5. Repeat for other universities

---

### **Test Case 4: Student Login & View Certificates**

#### Student 1 (Raj Kumar):
1. Go to **Student Portal**
2. **Student ID**: DU001
3. **Password**: raj@123secure
4. ✅ The student should see his issued certificates

#### Student 2 (Amit Das):
1. Go to **Student Portal**
2. **Student ID**: MU001
3. **Password**: amit@2026secure
4. ✅ Should see certificates from Mumbai University

---

### **Test Case 5: Verify Certificate (Employee/Verifier)**

#### How to Verify:
1. Go to **Employee Portal** 
2. Use default login: 
   - **Employee ID**: emp1
   - **Password**: emp@123
3. Copy the **Certificate Hash** (generated after issuing)
4. Paste in **Verify Hash** field
5. Click **Verify**
6. System shows:
   - ✅ Student Name
   - ✅ Certificate Status (Active/Revoked)
   - ✅ Branch & Department
   - ✅ CGPA
   - ✅ Issued Date
   - ✅ Issuing University

---

### **Test Case 6: Revoke Certificate (University Only)**

#### Scenario:
If a certificate was issued by mistake, the university can revoke it.

```
REVOKE CERTIFICATE
├─ Certificate Hash: 0xa1b2c3d4e5f6... (copy from issued cert)
├─ Reason: "Issued by mistake - student failed final exam"
```

#### Steps:
1. Switch MetaMask to **Issuing University Account**
2. Click **"MANAGE UNIVERSITIES"** (or directly in certificate section)
3. Find the issued certificate hash
4. Enter **Revocation Reason**
5. Click **Revoke**
6. Status changes: **Active → Revoked**

---

## Ganache Test Accounts Reference

```
Available Ganache Accounts:
═══════════════════════════════════════════════════════════════

Account 0 (Super Admin - Contract Owner):
├─ Address: 0xe19579a4a0a2E5D3e6482373cf3c8B731a98f4bE
└─ Private: 0xd11f9d7b809476b7d1f3bc264892631914f533b4abe5cc7a56e2556f150e0f75

Account 1 (Delhi University):
├─ Address: 0x1929737AAA0b12fef12DF881689b2Dc367317AC2
└─ Private: 0x946efe74eb02ac48ea8b1d62463f8eac554184c7e9f26191fb035e7067f8cf54

Account 2 (Mumbai University):
├─ Address: 0xC07050726Ecb9288C19B470AF8eA16d4C1780f81
└─ Private: 0x8bd32c8016f8e72b452182728a5c8bde2996030e9d7f94c1f519dd29f8c42685

Account 3 (Bangalore Institute):
├─ Address: 0xe9b7AB01ab679e11994914CEDE31Ec6d9C847252
└─ Private: 0x6076e1cc2e7d60934edc2c2e82da000664fcd594e98ad29faa4ab3744fcb6d65

Account 4 (Future University):
├─ Address: 0xA900E4691DC3AC3dfe9a88a833BCdc26d3f80410
└─ Private: 0x167a20d84fda089a247052a4618aba2efa7653b7301081af0fde6a61f03b6388

Account 5 (Another University):
├─ Address: 0x756317fb3c57Be14aE08d2aA6c7b456D9657475A
└─ Private: 0x45888792d1fc40a575089c9855ff7294c29326b59997d75fe8c69508178be174
```

---

## Complete Workflow Example

### Scenario: Register Delhi University with 2 Students and Issue 2 Certificates

#### **Phase 1: Super Admin Registers University (5 min)**
```
1. Login as Super Admin (0xe195...)
2. Go to MANAGE UNIVERSITIES
3. Register: Delhi University (0x1929...)
4. ✅ Confirm in blockchain
```

#### **Phase 2: University Registers Students (10 min)**
```
1. Switch MetaMask to Delhi University (0x1929...)
2. Click ADD STUDENT
3. Register Student 1: DU001 | Raj Kumar | Password: raj@123
4. Register Student 2: DU002 | Priya Singh | Password: priya@456
5. ✅ Confirm each transaction
```

#### **Phase 3: Issue Certificates (15 min)**
```
1. Stay in Delhi University account
2. Click ISSUE CERTIFICATE
3. Issue Cert 1:
   - Student ID: DU001
   - Name: Raj Kumar
   - Branch: CS
   - Department: Engineering
   - CGPA: 8.5
   - Date: 27-02-2026
4. Issue Cert 2:
   - Student ID: DU002
   - Name: Priya Singh
   - Branch: ECE
   - Department: Engineering
   - CGPA: 9.1
   - Date: 27-02-2026
5. ✅ Save the certificate hashes
```

#### **Phase 4: Student Verifies Certificate (5 min)**
```
1. Go to Student Portal
2. Login: DU001 | Password: raj@123
3. ✅ View certificate with all details
4. See: Status = Active, CGPA 8.5, etc.
```

#### **Phase 5: Employee Verifies Certificate (3 min)**
```
1. Go to Employee Portal
2. Login: emp1 | emp@123
3. Paste certificate hash
4. ✅ See full certificate details
```

---

## Troubleshooting

### Issue 1: "This wallet is not authorized"
- **Cause**: Using wrong MetaMask account
- **Solution**: Switch to the correct account in MetaMask before logging in

### Issue 2: "University is not registered"
- **Cause**: University address not registered by Super Admin
- **Solution**: Ask Super Admin to register the university first

### Issue 3: "Student already registered"
- **Cause**: Student ID already exists
- **Solution**: Use a different Student ID (e.g., DU004 instead of DU001)

### Issue 4: "MetaMask request already pending"
- **Cause**: Double-clicked login button
- **Solution**: Wait for previous request to complete, then try again

### Issue 5: Transaction fails
- **Cause**: Not enough gas or wrong network
- **Solution**: 
  - Check you're on Ganache (Chain ID: 1337)
  - Make sure MetaMask has funds (Ganache gives 1000 ETH per account)

---

## Smart Contract Functions Reference

| Function | Role | Purpose |
|----------|------|---------|
| `registerUniversity(address, name)` | Super Admin | Register a new university |
| `removeUniversity(address)` | Super Admin | Remove a university |
| `registerStudent(studentId, name, password)` | University | Register a student |
| `issueCredential(...)` | University | Issue certificate to student |
| `revokeCredential(hash, reason)` | University | Revoke issued certificate |
| `studentLogin(studentId, password)` | Student | Login to view certificates |
| `getCredentialByHash(hash)` | Everyone | Verify a certificate |

---

## Network Configuration

```
Network Name: Ganache
RPC URL: http://127.0.0.1:7545
Chain ID: 1337
Currency: ETH

Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

---

## Summary of Your Current System Status

✅ **Super Admin Panel**: Ready to use  
✅ **Ganache Blockchain**: Running on port 7545  
✅ **MetaMask**: Connected with Ganache account  
✅ **React App**: Deployed and running  

### Next Steps:
1. Register universities using the above test data
2. Register students in each university
3. Issue certificates to students
4. Verify certificates in the Employee portal

---

Good luck! 🚀
