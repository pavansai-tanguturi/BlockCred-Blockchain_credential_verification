// src/components/ViewStudents.jsx
import { useState, useEffect } from "react";
import { keccak256, toUtf8Bytes } from "ethers";
import { useOutletContext } from "react-router-dom";
import "./Admin.css";

function ViewStudents() {
    const { contract, account } = useOutletContext();
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editMode, setEditMode] = useState(null);
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        if (contract) {
            fetchStudents();
        }
    }, [contract]);

    const fetchStudents = async () => {
        try {
            const studentIds = await contract.getRegisteredStudentIds();
            const studentsList = [];
            
            for (const id of studentIds) {
                const [studentId, name, isRegistered, universityWallet] = await contract.getStudent(id);
                
                // Only show students registered by this university
                if (universityWallet.toLowerCase() === account.toLowerCase()) {
                    let passwordHash = "";
                    try {
                        passwordHash = await contract.getStudentPasswordHash(id);
                    } catch {
                        // May fail if not the registering university
                    }
                    
                    // Get university name
                    let uniName = "Unknown";
                    try {
                        const [uName] = await contract.getUniversityByAddress(universityWallet);
                        uniName = uName;
                    } catch {}

                    studentsList.push({
                        id: studentId,
                        name: name,
                        isRegistered: isRegistered,
                        passwordHash: passwordHash,
                        universityWallet: universityWallet,
                        universityName: uniName,
                    });
                }
            }
            
            setStudents(studentsList);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordChange = async (studentId) => {
        if (!newPassword) {
            alert("Please enter a new password.");
            return;
        }

        if (!contract) {
            alert("Contract not initialized. Please refresh the page.");
            return;
        }
        
        setIsLoading(true);

        try {
            const newPasswordHash = keccak256(toUtf8Bytes(newPassword));
            
            const tx = await contract.updateStudentPassword(studentId, newPasswordHash);
            await tx.wait();
            
            alert("Password updated successfully!");
            
            const updatedStudents = students.map(student => 
                student.id === studentId ? { ...student, passwordHash: newPasswordHash } : student
            );
            setStudents(updatedStudents);
            
            setEditMode(null);
            setNewPassword("");

        } catch (error) {
            console.error("Failed to update password:", error);
            if (error.message.includes("Not the registering university")) {
                alert("You can only update passwords for students registered by your university.");
            } else {
                alert("Failed to update password. Please check console.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h3>Registered Students (Your University)</h3>
            {isLoading ? (
                <p>Loading students from the blockchain...</p>
            ) : students.length === 0 ? (
                <p>No students have been registered by your university yet.</p>
            ) : (
                students.map((student, index) => (
                    <div key={index} className="certificate-card">
                        <p><strong>Student ID:</strong> {student.id}</p>
                        <p><strong>Name:</strong> {student.name}</p>
                        <p><strong>Status:</strong> {student.isRegistered ? "Registered" : "Not Registered"}</p>
                        <p><strong>University:</strong> {student.universityName}</p>
                        
                        {editMode === student.id ? (
                            <div className="password-edit-form">
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button onClick={() => handlePasswordChange(student.id)}>Save</button>
                                <button onClick={() => setEditMode(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div className="password-display">
                                <p>
                                    <strong>Password Hash:</strong> 
                                    <span className="hash-value">
                                        {student.passwordHash ? student.passwordHash.substring(0, 10) + "..." : "N/A"}
                                    </span>
                                </p>
                                <button onClick={() => setEditMode(student.id)}>Edit Password</button>
                            </div>
                        )}
                    </div>
                ))
            )}
        </>
    );
}

export default ViewStudents;