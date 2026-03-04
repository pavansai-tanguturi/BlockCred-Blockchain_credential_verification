// src/components/ManageUniversities.jsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./Admin.css";

function ManageUniversities() {
    const { contract, account, isOwner } = useOutletContext();
    const [universities, setUniversities] = useState([]);
    const [form, setForm] = useState({ wallet: "", name: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (contract) {
            fetchUniversities();
        }
    }, [contract]);

    const fetchUniversities = async () => {
        try {
            setIsLoading(true);
            const addresses = await contract.getAllUniversityAddresses();
            const uniList = [];
            for (const addr of addresses) {
                const [name, isRegistered] = await contract.getUniversityByAddress(addr);
                uniList.push({ wallet: addr, name, isRegistered });
            }
            setUniversities(uniList);
        } catch (error) {
            console.error("Error fetching universities:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!form.wallet || !form.name) {
            alert("Please enter both wallet address and university name.");
            return;
        }

        // Trim whitespace from address
        const trimmedWallet = form.wallet.trim();

        if (!trimmedWallet.startsWith("0x") || trimmedWallet.length !== 42) {
            alert("Please enter a valid Ethereum wallet address (starting with 0x and 42 characters total).");
            return;
        }

        setIsSubmitting(true);
        try {
            const tx = await contract.registerUniversity(trimmedWallet, form.name);
            await tx.wait();
            alert(`University "${form.name}" registered successfully!`);
            setForm({ wallet: "", name: "" });
            fetchUniversities();
        } catch (error) {
            console.error("Registration failed:", error);
            if (error.message.includes("University already registered")) {
                alert("This wallet address is already registered as a university.");
            } else {
                alert("Registration failed: " + (error.reason || error.message));
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async (walletAddress) => {
        if (!window.confirm(`Are you sure you want to remove this university?`)) return;

        try {
            const tx = await contract.removeUniversity(walletAddress);
            await tx.wait();
            alert("University removed successfully.");
            fetchUniversities();
        } catch (error) {
            console.error("Remove failed:", error);
            alert("Failed to remove university: " + (error.reason || error.message));
        }
    };

    if (!isOwner) {
        return (
            <div style={{ textAlign: "center", padding: "3rem" }}>
                <h3>Access Denied</h3>
                <p>Only the Super Admin (contract owner) can manage universities.</p>
            </div>
        );
    }

    return (
        <>
            <h3>Register New University</h3>
            <p>Enter the university's MetaMask wallet address and name to grant them access to issue credentials.</p>
            <input
                placeholder="University Wallet Address (0x...)"
                value={form.wallet}
                onChange={(e) => setForm({ ...form, wallet: e.target.value })}
                disabled={isSubmitting}
                style={{ fontFamily: "monospace" }}
            />
            <input
                placeholder="University Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={isSubmitting}
            />
            <button onClick={handleRegister} disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register University"}
            </button>

            <h3>Registered Universities ({universities.length})</h3>
            {isLoading ? (
                <p>Loading universities from the blockchain...</p>
            ) : universities.length === 0 ? (
                <p>No universities registered yet.</p>
            ) : (
                universities.map((uni, index) => (
                    <div key={index} className="certificate-card" style={{ gridTemplateColumns: "1fr" }}>
                        <p><strong>Name:</strong> {uni.name}</p>
                        <p><strong>Wallet:</strong> <span style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{uni.wallet}</span></p>
                        <p>
                            <strong>Status:</strong>{" "}
                            <span style={{
                                color: uni.isRegistered ? "#059669" : "#ef4444",
                                fontWeight: 700
                            }}>
                                {uni.isRegistered ? "✅ Active" : "❌ Removed"}
                            </span>
                        </p>
                        {uni.isRegistered && (
                            <button
                                onClick={() => handleRemove(uni.wallet)}
                                style={{
                                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                                    marginTop: "0.5rem",
                                    maxWidth: "200px"
                                }}
                            >
                                Remove University
                            </button>
                        )}
                    </div>
                ))
            )}
        </>
    );
}

export default ManageUniversities;
