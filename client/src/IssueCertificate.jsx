// src/components/IssueCertificate.jsx
import { useState, useEffect } from "react";
import { keccak256, toUtf8Bytes } from "ethers";
import { useOutletContext } from "react-router-dom";
import "./Admin.css";
import axios from "axios";

// IPFS Pinata API Keys - Replace with your actual keys
const pinataApi = "d0f5487d4b141a9f5bdc";
const pinataSecret = "181e9f83602f7c20f4be6fd2f7312a202cd39f3e0c31381edbc8db6489955675";

function IssueCertificate() {
  const { contract, account } = useOutletContext();

  const [form, setForm] = useState({
    studentId: "",
    name: "",
    branch: "",
    dept: "",
    cgpa: "",
    date: "",
    file: null,
  });
  const [records, setRecords] = useState([]);
  const [verifyHash, setVerifyHash] = useState("");
  const [revokeHash, setRevokeHash] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const [isRevoking, setIsRevoking] = useState(false);

  const generateCertificateHash = (studentId, name, cgpa, date, walletAddress) => {
    const dataString = `${studentId}-${name}-${cgpa}-${date}-${walletAddress}`;
    return keccak256(toUtf8Bytes(dataString));
  };

  useEffect(() => {
    if (contract && account) {
      fetchRecords(contract);
    }
  }, [contract, account]);

  const fetchRecords = async (contractInstance) => {
    try {
      // Fetch only this university's issued hashes
      const hashes = await contractInstance.getUniversityIssuedHashes(account);
      const allCredentials = [];

      for (const hash of hashes) {
        const cert = await contractInstance.getCredentialByHash(hash);
        // cert.status is a BigInt enum: 0 = Active, 1 = Revoked
        const statusNum = Number(cert.status);
        allCredentials.push({
          studentId: cert.studentId,
          name: cert.name,
          branch: cert.branch,
          dept: cert.dept,
          cgpa: cert.cgpa,
          file: cert.ipfsHash,
          issuedDate: cert.issuedDate,
          hash: hash,
          status: statusNum === 0 ? "Active" : "Revoked",
          revocationReason: cert.revocationReason,
          revokedAt: Number(cert.revokedAt),
        });
      }

      setRecords(allCredentials);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
        alert("Please select a PDF file.");
        setForm({ ...form, file: null });
        return;
    }

    setForm({ ...form, file: file });
  };

  const verifyCertificateHash = async (inputHash) => {
    if (!inputHash) {
      alert("Please enter a certificate hash");
      return;
    }

    if (!contract) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      const credentialData = await contract.getCredentialByHash(inputHash);

      if (credentialData.studentId && credentialData.studentId !== "") {
        const statusNum = Number(credentialData.status);
        const statusText = statusNum === 0 ? "ACTIVE ✅" : "REVOKED ❌";
        
        let message = `Certificate Found!\n\nStudent: ${credentialData.name}\nID: ${credentialData.studentId}\nCGPA: ${credentialData.cgpa}\nDate: ${credentialData.issuedDate}\nStatus: ${statusText}`;
        
        if (statusNum === 1) {
          message += `\nRevocation Reason: ${credentialData.revocationReason}`;
          message += `\nRevoked At: ${new Date(Number(credentialData.revokedAt) * 1000).toLocaleDateString()}`;
        }
        
        alert(message);
      } else {
        alert("Invalid Certificate Hash!\n\nThis hash does not exist in the blockchain records.");
      }
    } catch (error) {
      console.error("Blockchain verification error:", error);
      alert("An error occurred during verification. Check console for details.");
    }
  };

  const handleRevoke = async () => {
    if (!revokeHash || !revokeReason) {
      alert("Please enter both the certificate hash and revocation reason.");
      return;
    }

    if (!contract) {
      alert("Contract not connected.");
      return;
    }

    setIsRevoking(true);
    try {
      const tx = await contract.revokeCredential(revokeHash, revokeReason);
      await tx.wait();
      alert("Certificate revoked successfully!\n\nThe certificate status is now REVOKED on the blockchain.");
      setRevokeHash("");
      setRevokeReason("");
      fetchRecords(contract);
    } catch (error) {
      console.error("Revocation failed:", error);
      if (error.message.includes("Only the issuing university")) {
        alert("You can only revoke certificates issued by your university.");
      } else if (error.message.includes("already revoked")) {
        alert("This certificate is already revoked.");
      } else if (error.message.includes("Credential not found")) {
        alert("No certificate found with this hash.");
      } else {
        alert("Revocation failed: " + (error.reason || error.message));
      }
    } finally {
      setIsRevoking(false);
    }
  };

  const handleIssue = async () => {
    if (!contract || !form.file) {
        alert("Please fill all fields and upload a PDF file.");
        return;
    }

    try {
        // Step A: Upload file to IPFS via Pinata API
        const formData = new FormData();
        formData.append("file", form.file);

        const pinataResponse = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                    'pinata_api_key': pinataApi,
                    'pinata_secret_api_key': pinataSecret,
                }
            }
        );

        const ipfsHash = pinataResponse.data.IpfsHash;

        // Step B: Issue the credential on-chain
        const tx = await contract.issueCredential(
            form.studentId || "",
            form.name || "",
            form.branch || "",
            form.dept || "",
            form.cgpa || "",
            ipfsHash,
            form.date || ""
        );

        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        const newHash = generateCertificateHash(form.studentId, form.name, form.cgpa, form.date, account);

        alert(`Certificate Issued Successfully!\n\nStudent: ${form.name}\nHash: ${newHash}\nIPFS Hash: ${ipfsHash}\nStatus: Active ✅\n\nSave this hash!`);

        setForm({
            studentId: "",
            name: "",
            branch: "",
            dept: "",
            cgpa: "",
            date: "",
            file: null,
        });

        fetchRecords(contract);
    } catch (err) {
        console.error("Transaction failed:", err);
        if (err.code === 4001) {
            alert("Transaction rejected by user");
        } else if (err.code === -32603) {
            alert("Internal JSON-RPC error. Please try again.");
        } else if (err.message.includes("user rejected")) {
            alert("Transaction cancelled by user");
        } else if (err.message.includes("Not an authorized university")) {
            alert("Your wallet is not registered as an authorized university.");
        } else {
            alert("Transaction failed: " + (err.reason || err.message));
        }
    }
  };

  return (
    <>
      <p>
        <strong>Connected Wallet:</strong> {account}
      </p>

      <h3>Issue Certificate</h3>
      <input
        placeholder="Student ID"
        value={form.studentId}
        onChange={(e) => setForm({ ...form, studentId: e.target.value })}
      />
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Branch"
        value={form.branch}
        onChange={(e) => setForm({ ...form, branch: e.target.value })}
      />
      <input
        placeholder="Degree"
        value={form.dept}
        onChange={(e) => setForm({ ...form, dept: e.target.value })}
      />
      <input
        placeholder="Final CGPA"
        value={form.cgpa}
        onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
      />
      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />
      <input type="file" onChange={handleFileChange} />
      
      <button onClick={handleIssue}>Submit</button>

      {/* ===== REVOKE CERTIFICATE SECTION ===== */}
      <div className="certificate-verification-section" style={{ marginTop: "2rem" }}>
        <h3>🚫 Revoke Certificate</h3>
        <p style={{ borderLeftColor: "#ef4444" }}>
          Revoke a certificate if it was issued fraudulently or contains errors. The old data remains on-chain (immutability), but the status changes to <strong>Revoked</strong>.
        </p>
        <input
          type="text"
          placeholder="Enter Certificate Hash to Revoke (0x...)"
          value={revokeHash}
          onChange={(e) => setRevokeHash(e.target.value)}
          style={{ fontFamily: "monospace" }}
          disabled={isRevoking}
        />
        <input
          type="text"
          placeholder="Reason for Revocation (e.g., Fraud, Data Correction, Reissue)"
          value={revokeReason}
          onChange={(e) => setRevokeReason(e.target.value)}
          disabled={isRevoking}
        />
        <button
          onClick={handleRevoke}
          disabled={isRevoking}
          style={{
            background: "linear-gradient(135deg, #ef4444, #dc2626)",
            maxWidth: "300px"
          }}
        >
          {isRevoking ? "Revoking..." : "Revoke Certificate"}
        </button>
      </div>

      {/* ===== VERIFY HASH SECTION ===== */}
      <div className="certificate-verification-section">
        <h3>Verify Certificate Hash</h3>
        <div className="verification-form-container">
            <input
                type="text"
                className="hash-input"
                placeholder="Enter Certificate Hash"
                value={verifyHash}
                onChange={(e) => setVerifyHash(e.target.value.toUpperCase())}
            />
            <button 
                onClick={() => verifyCertificateHash(verifyHash)} 
                className="verify-button"
            >
                Verify
            </button>
        </div>
      </div>
      
      <h3>Issued Certificates ({records.length})</h3>
      {records.length === 0 ? (
        <p>No certificates issued by your university yet.</p>
      ) : (
        records.map((rec, idx) => (
          <div key={idx} className="certificate-card">
            <p><strong>Student ID:</strong> {rec.studentId}</p>
            <p><strong>Name:</strong> {rec.name}</p>
            <p><strong>Branch:</strong> {rec.branch}</p>
            <p><strong>Degree:</strong> {rec.dept}</p>
            <p><strong>CGPA:</strong> {rec.cgpa}</p>
            <p><strong>Date:</strong> {rec.issuedDate}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span style={{
                color: rec.status === "Active" ? "#059669" : "#ef4444",
                fontWeight: 700,
                fontSize: "1.1rem"
              }}>
                {rec.status === "Active" ? "✅ Active" : "❌ Revoked"}
              </span>
            </p>
            {rec.status === "Revoked" && (
              <>
                <p style={{ borderLeftColor: "#ef4444" }}>
                  <strong>Revocation Reason:</strong> {rec.revocationReason}
                </p>
                <p>
                  <strong>Revoked On:</strong> {new Date(rec.revokedAt * 1000).toLocaleDateString()}
                </p>
              </>
            )}
            
            <div className="hash-container">
              <strong>Hash:</strong> 
              <span className="hash-value">{rec.hash}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {rec.file && (
                    <button
                        onClick={() => {
                            const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${rec.file}`;
                            window.open(ipfsUrl, '_blank');
                        }}
                        className="card-action-button"
                    >
                        View File
                    </button>
                )}
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(rec.hash);
                        alert("Hash copied!");
                    }}
                    className="copy-button"
                >
                    Copy Hash
                </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default IssueCertificate;