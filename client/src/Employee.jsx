import { useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import { useNavigate } from "react-router-dom";
import "./Employee.css";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.86 0-7 2.24-7 5v1h14v-1c0-2.76-3.14-5-7-5Z"
      fill="currentColor"
    />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 1 1 4 0v2h-4Z"
      fill="currentColor"
    />
  </svg>
);

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M3 21h18v-2h-1V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v5H4a1 1 0 0 0-1 1Zm6-16h9v14h-2v-3a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1v3H9ZM5 11h2v8H5Z"
      fill="currentColor"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      d="M13.29 5.29a1 1 0 0 0 0 1.42L17.59 11H4a1 1 0 0 0 0 2h13.59l-4.3 4.29a1 1 0 1 0 1.42 1.42l6-6a1 1 0 0 0 0-1.42l-6-6a1 1 0 0 0-1.42 0Z"
      fill="currentColor"
    />
  </svg>
);

function Employee() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ employeeId: "", password: "" });
  const [verifyHash, setVerifyHash] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [contract, setContract] = useState(null);
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
          const [uName] = await contract.getUniversityByAddress(credentialData.issuer);
          if (uName) issuerName = uName;
        } catch (error) {
          console.warn("Unable to resolve issuer university name", error);
        }

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
            <div className="company-logo"><BuildingIcon /></div>
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
              <span className="input-icon"><UserIcon /></span>
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              />
              <span className="input-icon"><LockIcon /></span>
            </div>
            <button className="login-button" onClick={handleLogin} disabled={isLoggingIn}>
              <span style={{ color: "#ffffff" }}>{isLoggingIn ? 'Connecting...' : 'Login to Verify'}</span>
              <span className="button-icon"><ArrowRightIcon /></span>
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
            <div className="company-badge"><BuildingIcon /></div>
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