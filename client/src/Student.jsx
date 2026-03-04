// src/components/Student.jsx
import { useState } from "react";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";
import { useNavigate } from "react-router-dom";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import "./Student.css";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function Student() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginForm, setLoginForm] = useState({ studentId: "", password: "" });
    const [studentData, setStudentData] = useState(null);
    const [issuedCertificates, setIssuedCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [contract, setContract] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);

    const initContract = async () => {
        if (isInitializing) return null;
        setIsInitializing(true);
        try {
            const provider = new BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const signer = await provider.getSigner();
            const cred = new Contract(contractAddress, abi.abi, signer);
            setContract(cred);
            return cred;
        } catch (error) {
            console.error("Error connecting to blockchain:", error);
            alert("Please connect your MetaMask wallet");
            return null;
        } finally {
            setIsInitializing(false);
        }
    };

    const handleLogin = async () => {
        if (isLoading || isInitializing) return;
        setIsLoading(true);
        const credContract = await initContract();
        if (!credContract) {
            setIsLoading(false);
            return;
        }

        try {
            const enteredPasswordHash = keccak256(toUtf8Bytes(loginForm.password));
            const loginSuccess = await credContract.studentLogin(loginForm.studentId, enteredPasswordHash);

            if (loginSuccess) {
                const [id, name, , universityWallet] = await credContract.getStudent(loginForm.studentId);
                
                // Get university name
                let uniName = "Unknown University";
                try {
                    const [uName, uRegistered] = await credContract.getUniversityByAddress(universityWallet);
                    if (uRegistered) uniName = uName;
                } catch {}

                setStudentData({ id, name, universityName: uniName, universityWallet });

                const hashes = await credContract.getIssuedHashes();
                const studentCerts = [];

                for (const hash of hashes) {
                    const cert = await credContract.getCredentialByHash(hash);
                    if (cert.studentId === loginForm.studentId) {
                        const statusNum = Number(cert.status);
                        
                        // Get issuing university name
                        let issuerName = "Unknown";
                        try {
                            const [iName] = await credContract.getUniversityByAddress(cert.issuer);
                            issuerName = iName;
                        } catch {}

                        studentCerts.push({
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
                            issuerName: issuerName,
                            issuerAddress: cert.issuer,
                        });
                    }
                }
                setIssuedCertificates(studentCerts);
                setIsLoggedIn(true);
            } else {
                alert("Invalid Student ID or Password.");
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoginForm({ studentId: "", password: "" });
        setStudentData(null);
        setIssuedCertificates([]);
        navigate("/");
    };

    // Student Login Form
    if (!isLoggedIn) {
        return (
            <div className="student-container">
                <div className="student-login-box">
                    <h2>Student Login</h2>
                    <input
                        placeholder="Student ID"
                        value={loginForm.studentId}
                        onChange={(e) => setLoginForm({ ...loginForm, studentId: e.target.value })}
                    />
                    <input
                        placeholder="Password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                    <button onClick={handleLogin} disabled={isLoading}>
                        {isLoading ? 'Logging In...' : 'Login'}
                    </button>
                </div>
            </div>
        );
    }

    // Student Dashboard
    return (
        <div className="student-container">
            <div className="student-dashboard-box">
                <div className="dashboard-header">
                    <div>
                        <h2>Welcome, {studentData.name}!</h2>
                        <p style={{ margin: 0, fontSize: "0.9rem", color: "#6c757d" }}>
                            Registered by: <strong>{studentData.universityName}</strong>
                        </p>
                    </div>
                    <button className="logout-button" onClick={handleLogout}>Logout</button>
                </div>
                
                <h3>Your Issued Certificates</h3>
                
                {issuedCertificates.length === 0 ? (
                    <p className="no-certificates-message">You do not have any certificates issued to your account yet.</p>
                ) : (
                    issuedCertificates.map((rec, idx) => (
                        <div key={idx} className="certificate-card" style={{
                            borderLeftColor: rec.status === "Active" ? "#007bff" : "#ef4444"
                        }}>
                            <p><strong>Student ID:</strong> {rec.studentId}</p>
                            <p><strong>Name:</strong> {rec.name}</p>
                            <p><strong>Branch:</strong> {rec.branch}</p>
                            <p><strong>Degree:</strong> {rec.dept}</p>
                            <p><strong>CGPA:</strong> {rec.cgpa}</p>
                            <p><strong>Date:</strong> {rec.issuedDate}</p>
                            <p><strong>Issued By:</strong> {rec.issuerName}</p>
                            <p>
                                <strong>Status:</strong>{" "}
                                <span style={{
                                    color: rec.status === "Active" ? "#28a745" : "#ef4444",
                                    fontWeight: 700,
                                    fontSize: "1.05rem"
                                }}>
                                    {rec.status === "Active" ? "✅ Active" : "❌ Revoked"}
                                </span>
                            </p>
                            
                            {rec.status === "Revoked" && (
                                <div style={{
                                    background: "#fee2e2",
                                    border: "1px solid #fca5a5",
                                    borderRadius: "8px",
                                    padding: "0.75rem 1rem",
                                    marginTop: "0.5rem"
                                }}>
                                    <p style={{ margin: "0.25rem 0", color: "#dc2626" }}>
                                        <strong>Revocation Reason:</strong> {rec.revocationReason}
                                    </p>
                                    <p style={{ margin: "0.25rem 0", color: "#dc2626" }}>
                                        <strong>Revoked On:</strong> {new Date(rec.revokedAt * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            
                            <div className="hash-container">
                                <strong>Hash:</strong> 
                                <span className="hash-value">{rec.hash}</span>
                            </div>

                            <div className="card-buttons">
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
            </div>
        </div>
    );
}

export default Student;