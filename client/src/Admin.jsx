import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link } from "react-router-dom";
import { BrowserProvider, Contract } from "ethers";
import abi from "./artifacts/contracts/Credential.sol/Credential.json";
import "./Admin.css";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [universityName, setUniversityName] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isUniversity, setIsUniversity] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (isLoggingIn) return; // Prevent multiple simultaneous requests
    setIsLoggingIn(true);
    try {
      setLoginError("");
      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      const cred = new Contract(contractAddress, abi.abi, signer);
      setContract(cred);

      // Check if connected wallet is the super-admin (contract owner)
      const owner = await cred.owner();
      const walletIsOwner = owner.toLowerCase() === address.toLowerCase();
      setIsOwner(walletIsOwner);

      // Check if connected wallet is a registered university
      const [uniName, uniRegistered] = await cred.getUniversityByAddress(address);
      setIsUniversity(uniRegistered);
      if (uniRegistered) {
        setUniversityName(uniName);
      }

      if (walletIsOwner || uniRegistered) {
        setIsLoggedIn(true);
      } else {
        setLoginError("This wallet is not authorized. Only the super-admin or a registered university can access this panel.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("Failed to connect MetaMask. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAccount("");
    setContract(null);
    setUniversityName("");
    setIsOwner(false);
    setIsUniversity(false);
    navigate("/");
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-container">
        <div className="admin-box">
          <h2>Admin / University Login</h2>
          <p style={{ textAlign: "center", background: "none", border: "none", padding: "0.5rem" }}>
            Connect your MetaMask wallet to log in as <strong>Super Admin</strong> or a <strong>Registered University</strong>.
          </p>
          {loginError && (
            <p style={{ color: "#ef4444", textAlign: "center", background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: "8px", padding: "1rem" }}>
              {loginError}
            </p>
          )}
          <button onClick={handleLogin} disabled={isLoggingIn}>
            {isLoggingIn ? "Connecting..." : "Connect MetaMask Wallet"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-box">
        <div className="admin-header-nav">
          <div>
            <h2 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
              {isOwner ? "Super Admin Panel" : `${universityName} Panel`}
            </h2>
            <p style={{ fontSize: "0.85rem", margin: 0, padding: "0.25rem 0", background: "none", border: "none" }}>
              <strong>Wallet:</strong> {account.substring(0, 6)}...{account.substring(account.length - 4)}
              {isOwner && <span style={{ marginLeft: "0.5rem", color: "#d97706" }}>★ Super Admin</span>}
              {isUniversity && !isOwner && <span style={{ marginLeft: "0.5rem", color: "#059669" }}>🏛 University</span>}
            </p>
          </div>
          <div className="admin-nav-buttons">
            {isOwner && (
              <Link to="/admin/manage-universities" className="nav-button">Manage Universities</Link>
            )}
            <Link to="/admin/issue-certificate" className="nav-button">Issue Certificate</Link>
            <Link to="/admin/add-student" className="nav-button">Add Student</Link>
            <Link to="/admin/view-students" className="nav-button">View Students</Link>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        
        {/* The Outlet component renders the nested route's component here */}
        <Outlet context={{ contract, account, isOwner, isUniversity, universityName }} /> 
      </div>
    </div>
  );
}

export default Admin;