// src/components/AddStudent.jsx
import { useState } from "react";
import { keccak256, toUtf8Bytes } from "ethers";
import { useNavigate, useOutletContext } from "react-router-dom";

function AddStudent() {
    const navigate = useNavigate();
    const { contract, account } = useOutletContext();
    const [form, setForm] = useState({ studentId: "", name: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!contract || !form.studentId || !form.name || !form.password) {
            alert("Please fill all fields.");
            return;
        }

        setIsLoading(true);

        // Hash the password for secure storage on the blockchain
        const passwordHash = keccak256(toUtf8Bytes(form.password));

        try {
            const tx = await contract.registerStudent(form.studentId, form.name, passwordHash);
            await tx.wait();
            alert(`Student "${form.name}" registered successfully with ID: ${form.studentId}!`);
            setForm({ studentId: "", name: "", password: "" });
            navigate('/admin/view-students');
        } catch (error) {
            console.error("Registration failed:", error);
            if (error.message.includes("Not an authorized university")) {
                alert("Your wallet is not registered as an authorized university.");
            } else if (error.message.includes("Student already registered")) {
                alert("A student with this ID is already registered.");
            } else {
                alert("Registration failed. See console for details.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h3>Add New Student</h3>
            <p>
                This form registers a new student on the blockchain. The password is hashed (keccak256) for security.
            </p>
            <input 
                placeholder="Student ID"
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                disabled={isLoading}
            />
            <input 
                placeholder="Student Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={isLoading}
            />
            <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={isLoading}
            />
            <button onClick={handleRegister} disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register Student'}
            </button>
        </>
    );
}

export default AddStudent;