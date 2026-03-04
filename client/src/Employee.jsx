import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import { useNavigate } from "react-router-dom";
import "./Employee.css";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function Employee() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ employeeId: "", password: "" });
  const [verifyHash, setVerifyHash] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    if (isLoggingIn) return;
    if (loginForm.employeeId === "emp1" && loginForm.password === "emp@123") {
      setIsLoggedIn(true);
      initContract();
    } else {
      alert("Invalid Credentials ❌\n\nDefault Login:\nEmployee ID: emp1\nPassword: emp@123");
    }
  };

  const initContract = async () => {
    setIsLoggingIn(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      const cred = new Contract(contractAddress, abi.abi, signer);
      setContract(cred);
    } catch (error) {
      console.error("Error connecting to blockchain:", error);
      alert("Please connect your MetaMask wallet");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleVerify = async () => {
    if (!verifyHash || !verifyHash.startsWith('0x')) {
      alert("Please enter a valid blockchain hash (starting with 0x) to verify");
      return;
    }

    if (!contract) {
      alert("Please ensure MetaMask is connected");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const credentialData = await contract.getCredentialByHash(verifyHash);

      if (credentialData.studentId && credentialData.studentId !== "") {
        const statusNum = Number(credentialData.status);
        const isActive = statusNum === 0;

        // Get university name from issuer address
        let issuerName = "Unknown University";
        try {
          const [uName, uRegistered] = await contract.getUniversityByAddress(credentialData.issuer);
          if (uName) issuerName = uName;
        } catch {}

        setVerificationResult({
          success: true,
          isActive: isActive,
          message: isActive 
            ? "Certificate Authenticated Successfully!" 
            : "Certificate Found — But REVOKED",
          data: {
            studentId: credentialData.studentId,
            name: credentialData.name,
            branch: credentialData.branch,
            dept: credentialData.dept,
            cgpa: credentialData.cgpa,
            issuedDate: credentialData.issuedDate,
            hash: verifyHash,
            issuer: credentialData.issuer,
            issuerName: issuerName,
            status: isActive ? "Active" : "Revoked",
            revocationReason: credentialData.revocationReason,
            revokedAt: Number(credentialData.revokedAt),
          },
        });
      } else {
        setVerificationResult({
          success: false,
          isActive: false,
          message: "Certificate Not Found",
          data: null,
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        success: false,
        isActive: false,
        message: "Verification Failed - Blockchain Error",
        data: null,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    setVerifyHash("");
    setVerificationResult(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ employeeId: "", password: "" });
    setVerifyHash("");
    setVerificationResult(null);
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="employee-container">
        <div className="employee-login-box">
          <div className="login-header">
            <div className="company-logo">🏢</div>
            <h2>Employee Verification Portal</h2>
            <p className="login-subtitle">Corporate Credential Verification System</p>
          </div>
          <div className="login-form">
            <div className="input-group">
              <label>Employee ID</label>
              <input
                type="text"
                placeholder="Enter Employee ID"
                value={loginForm.employeeId}
                onChange={(e) => setLoginForm({ ...loginForm, employeeId: e.target.value })}
              />
              <span className="input-icon">👤</span>
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <span className="input-icon">🔒</span>
            </div>
            <button className="login-button" onClick={handleLogin} disabled={isLoggingIn}>
              <span>{isLoggingIn ? 'Connecting...' : 'Login to Verify'}</span>
              <span className="button-icon">→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-container">
      <div className="employee-panel">
        <div className="panel-header">
          <div className="header-left">
            <div className="company-badge">🏢</div>
            <div>
              <h2>Credential Verification Center</h2>
              <p className="header-subtitle">Multi-University Verification System</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="verification-section">
          <div className="section-title">
            <span className="title-icon">🔍</span>
            <h3>Verify Academic Credentials</h3>
          </div>
          <div className="verification-form">
            <div className="hash-input-container">
              <label>Certificate Hash</label>
              <input
                type="text"
                placeholder="Enter Certificate Hash (e.g., 0x...)"
                value={verifyHash}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.startsWith('0x')) {
                    setVerifyHash('0x' + value.slice(2).toUpperCase());
                  } else {
                    setVerifyHash(value.toUpperCase());
                  }
                }}
                className="hash-input"
                disabled={isVerifying}
              />
            </div>
            <div className="verification-actions">
              <button 
                className="verify-button" 
                onClick={handleVerify}
                disabled={!verifyHash || isVerifying}
              >
                {isVerifying ? (
                  <>
                    <span className="spinner"></span>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>🔐 Verify on Blockchain</span>
                  </>
                )}
              </button>
              <button 
                className="clear-button" 
                onClick={handleClear}
                disabled={isVerifying}
              >
                Clear
              </button>
            </div>
          </div>
          {verificationResult && (
            <div className={`verification-result ${verificationResult.success ? (verificationResult.isActive ? 'success' : 'revoked') : 'failure'}`}>
              <div className="result-icon">
                {verificationResult.success 
                  ? (verificationResult.isActive ? '✓' : '⚠') 
                  : '✗'}
              </div>
              <div className="result-content">
                <h4>{verificationResult.message}</h4>
                {verificationResult.success && verificationResult.data ? (
                  <div className="certificate-details">
                    <div className="detail-row">
                      <span className="detail-label">Student ID:</span>
                      <span className="detail-value">{verificationResult.data.studentId}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Name:</span>
                      <span className="detail-value">{verificationResult.data.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Branch:</span>
                      <span className="detail-value">{verificationResult.data.branch}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Degree:</span>
                      <span className="detail-value">{verificationResult.data.dept}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">CGPA:</span>
                      <span className="detail-value">{verificationResult.data.cgpa}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Issue Date:</span>
                      <span className="detail-value">{verificationResult.data.issuedDate}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Issued By:</span>
                      <span className="detail-value" style={{ fontWeight: 700 }}>
                        🏛 {verificationResult.data.issuerName}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Issuer Wallet:</span>
                      <span className="detail-value hash-value" style={{ fontSize: "0.8rem" }}>
                        {verificationResult.data.issuer}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className="detail-value" style={{
                        color: verificationResult.data.status === "Active" ? "#047857" : "#dc2626",
                        fontWeight: 700,
                        fontSize: "1.1rem"
                      }}>
                        {verificationResult.data.status === "Active" ? "✅ Active" : "❌ Revoked"}
                      </span>
                    </div>

                    {verificationResult.data.status === "Revoked" && (
                      <>
                        <div className="detail-row" style={{ background: "#fee2e2", borderRadius: "8px", padding: "0.75rem" }}>
                          <span className="detail-label" style={{ color: "#dc2626" }}>Revocation Reason:</span>
                          <span className="detail-value" style={{ color: "#dc2626", fontWeight: 600 }}>
                            {verificationResult.data.revocationReason}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Revoked On:</span>
                          <span className="detail-value">
                            {new Date(verificationResult.data.revokedAt * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="detail-row">
                      <span className="detail-label">Hash:</span>
                      <span className="detail-value hash-value">{verificationResult.data.hash}</span>
                    </div>

                    {verificationResult.isActive ? (
                      <div className="blockchain-badge">
                        <span className="badge-icon">⛓️</span>
                        <span>Verified on Blockchain — Active Certificate</span>
                      </div>
                    ) : (
                      <div className="blockchain-badge" style={{
                        background: "linear-gradient(45deg, #dc2626, #991b1b)"
                      }}>
                        <span className="badge-icon">⚠️</span>
                        <span>Certificate Revoked — Do Not Accept</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="failure-message">
                    <p>This certificate hash does not exist in our blockchain records.</p>
                    <p className="failure-hint">Please verify the hash and try again.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="info-cards">
          <div className="info-card">
            <div className="card-icon">🎓</div>
            <h4>Multi-University</h4>
            <p>Verified credentials from multiple accredited institutions</p>
          </div>
          <div className="info-card">
            <div className="card-icon">🔗</div>
            <h4>Blockchain Security</h4>
            <p>Immutable and tamper-proof verification with status tracking</p>
          </div>
          <div className="info-card">
            <div className="card-icon">🚫</div>
            <h4>Revocation Check</h4>
            <p>Instantly see if a certificate has been revoked</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee;