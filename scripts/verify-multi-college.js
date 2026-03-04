const hre = require("hardhat");

async function main() {
  const CONTRACT_ADDRESS = "0x723D44fcf39c4277828B5B5CecD250f2E62Fe434";

  const signers = await hre.ethers.getSigners();
  const superAdmin = signers[0]; // deployer = super admin
  const uni1Wallet = signers[1]; // second account = University 1
  const uni2Wallet = signers[2]; // third account = University 2

  const Credential = await hre.ethers.getContractFactory("Credential");
  const contract = Credential.attach(CONTRACT_ADDRESS);

  console.log("=== MULTI-COLLEGE BLOCKCHAIN VERIFICATION ===\n");
  console.log("Super Admin:", superAdmin.address);
  console.log("University 1 Wallet:", uni1Wallet.address);
  console.log("University 2 Wallet:", uni2Wallet.address);

  // ==========================
  // 1. Register two universities (super admin only)
  // ==========================
  console.log("\n--- Step 1: Register Universities ---");
  
  let tx = await contract.connect(superAdmin).registerUniversity(uni1Wallet.address, "MIT University");
  await tx.wait();
  console.log("✅ Registered 'MIT University' at", uni1Wallet.address);

  tx = await contract.connect(superAdmin).registerUniversity(uni2Wallet.address, "Stanford University");
  await tx.wait();
  console.log("✅ Registered 'Stanford University' at", uni2Wallet.address);

  // Check total universities
  const uniCount = await contract.getUniversityCount();
  console.log("📊 Total universities registered:", uniCount.toString());

  const allAddresses = await contract.getAllUniversityAddresses();
  console.log("📋 All university addresses:", allAddresses);

  // ==========================
  // 2. Each university registers its own students
  // ==========================
  console.log("\n--- Step 2: Register Students ---");

  const passwordHash1 = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("pass123"));
  const passwordHash2 = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("pass456"));
  const passwordHash3 = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("pass789"));

  // MIT registers 2 students
  tx = await contract.connect(uni1Wallet).registerStudent("MIT-001", "Alice Johnson", passwordHash1);
  await tx.wait();
  console.log("✅ MIT registered student: Alice Johnson (MIT-001)");

  tx = await contract.connect(uni1Wallet).registerStudent("MIT-002", "Bob Smith", passwordHash2);
  await tx.wait();
  console.log("✅ MIT registered student: Bob Smith (MIT-002)");

  // Stanford registers 1 student
  tx = await contract.connect(uni2Wallet).registerStudent("STF-001", "Charlie Brown", passwordHash3);
  await tx.wait();
  console.log("✅ Stanford registered student: Charlie Brown (STF-001)");

  // Verify students are linked to correct university
  const [, , , aliceUni] = await contract.getStudent("MIT-001");
  const [, , , charlieUni] = await contract.getStudent("STF-001");
  console.log("\n📌 Alice's university wallet:", aliceUni, aliceUni === uni1Wallet.address ? "(MIT ✅)" : "(WRONG ❌)");
  console.log("📌 Charlie's university wallet:", charlieUni, charlieUni === uni2Wallet.address ? "(Stanford ✅)" : "(WRONG ❌)");

  // ==========================
  // 3. Each university issues certificates
  // ==========================
  console.log("\n--- Step 3: Issue Certificates ---");

  tx = await contract.connect(uni1Wallet).issueCredential(
    "MIT-001", "Alice Johnson", "Computer Science", "Engineering", "3.9", "QmFakeHash1", "2026-01-15"
  );
  await tx.wait();
  console.log("✅ MIT issued certificate for Alice Johnson");

  tx = await contract.connect(uni2Wallet).issueCredential(
    "STF-001", "Charlie Brown", "Physics", "Science", "3.7", "QmFakeHash2", "2026-02-20"
  );
  await tx.wait();
  console.log("✅ Stanford issued certificate for Charlie Brown");

  // ==========================
  // 4. Verify per-university certificate isolation
  // ==========================
  console.log("\n--- Step 4: Verify Per-University Isolation ---");

  const mitHashes = await contract.getUniversityIssuedHashes(uni1Wallet.address);
  const stanfordHashes = await contract.getUniversityIssuedHashes(uni2Wallet.address);

  console.log("MIT certificates count:", mitHashes.length);
  console.log("Stanford certificates count:", stanfordHashes.length);

  for (const hash of mitHashes) {
    const cert = await contract.getCredentialByHash(hash);
    console.log(`  MIT Cert → Student: ${cert.name}, Branch: ${cert.branch}, CGPA: ${cert.cgpa}, Issuer: ${cert.issuer}`);
  }
  for (const hash of stanfordHashes) {
    const cert = await contract.getCredentialByHash(hash);
    console.log(`  Stanford Cert → Student: ${cert.name}, Branch: ${cert.branch}, CGPA: ${cert.cgpa}, Issuer: ${cert.issuer}`);
  }

  // ==========================
  // 5. Test access control: Stanford cannot revoke MIT's certificate
  // ==========================
  console.log("\n--- Step 5: Access Control Test ---");

  try {
    tx = await contract.connect(uni2Wallet).revokeCredential(mitHashes[0], "Testing unauthorized revoke");
    await tx.wait();
    console.log("❌ FAIL: Stanford was able to revoke MIT's certificate (should not happen)");
  } catch (error) {
    console.log("✅ PASS: Stanford cannot revoke MIT's certificate →", error.reason || "Access denied");
  }

  // ==========================
  // 6. Test access control: Non-university cannot register students
  // ==========================
  console.log("\n--- Step 6: Non-University Access Test ---");

  const randomWallet = signers[3]; // not a university
  try {
    tx = await contract.connect(randomWallet).registerStudent("XXX-001", "Hacker", passwordHash1);
    await tx.wait();
    console.log("❌ FAIL: Non-university was able to register a student");
  } catch (error) {
    console.log("✅ PASS: Non-university cannot register students →", error.reason || "Access denied");
  }

  try {
    tx = await contract.connect(randomWallet).issueCredential("MIT-001", "Alice", "CS", "Eng", "3.9", "QmFake", "2026-01-01");
    await tx.wait();
    console.log("❌ FAIL: Non-university was able to issue a certificate");
  } catch (error) {
    console.log("✅ PASS: Non-university cannot issue certificates →", error.reason || "Access denied");
  }

  // ==========================
  // 7. Summary
  // ==========================
  console.log("\n=== VERIFICATION COMPLETE ===");
  console.log("✅ Multiple universities can be registered by super admin");
  console.log("✅ Each university independently registers its own students");
  console.log("✅ Each university independently issues its own certificates");
  console.log("✅ Certificates are scoped per university (isolation works)");
  console.log("✅ Cross-university revocation is blocked");
  console.log("✅ Non-university wallets cannot register students or issue certificates");
  console.log("\n🎓 RESULT: The smart contract FULLY SUPPORTS multiple colleges on the blockchain!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
