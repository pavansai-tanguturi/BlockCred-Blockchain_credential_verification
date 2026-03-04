// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Credential is Ownable {

    // ========================
    // ENUMS
    // ========================
    enum CertificateStatus { Active, Revoked }

    // ========================
    // STRUCTS
    // ========================

    struct University {
        address wallet;
        string name;
        bool isRegistered;
    }

    struct Student {
        string studentId;
        string name;
        bytes32 passwordHash;
        bool isRegistered;
        address universityWallet; // which university registered this student
    }

    struct Certificate {
        string studentId;
        string name;
        string branch;
        string dept;
        string cgpa;
        string ipfsHash;
        string issuedDate;
        address issuer;
        CertificateStatus status;       // Active or Revoked
        string revocationReason;        // reason if revoked
        uint256 revokedAt;              // timestamp of revocation (0 if active)
    }

    // ========================
    // STATE VARIABLES
    // ========================

    // University management (only super-admin / contract owner)
    mapping(address => University) public universities;
    address[] public universityAddresses;

    // Student & credential storage
    mapping(bytes32 => Certificate) private credentials;
    bytes32[] private issuedHashes;
    mapping(string => Student) private students;
    string[] private registeredStudentIds;

    // Track which university issued which hashes
    mapping(address => bytes32[]) private universityIssuedHashes;

    // ========================
    // CONSTRUCTOR
    // ========================
    constructor(address initialOwner) Ownable(initialOwner) {}

    // ========================
    // EVENTS
    // ========================
    event UniversityRegistered(address indexed wallet, string name);
    event UniversityRemoved(address indexed wallet);
    event CredentialIssued(bytes32 indexed credentialHash, string studentId, address indexed issuer);
    event CredentialRevoked(bytes32 indexed credentialHash, string reason, address indexed revokedBy);
    event StudentRegistered(string studentId, address indexed universityWallet);
    event StudentPasswordUpdated(string studentId);

    // ========================
    // MODIFIERS
    // ========================
    modifier onlyRegisteredUniversity() {
        require(universities[msg.sender].isRegistered, "Not an authorized university");
        _;
    }

    // ========================
    // UTILITY FUNCTIONS
    // ========================
    function _calculateCertHash(
        string memory studentId,
        string memory name,
        string memory cgpa,
        string memory issuedDate,
        address issuer
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(studentId, name, cgpa, issuedDate, issuer));
    }

    // ========================
    // UNIVERSITY MANAGEMENT (Super-Admin only)
    // ========================

    function registerUniversity(address _wallet, string memory _name) public onlyOwner {
        require(!universities[_wallet].isRegistered, "University already registered.");
        universities[_wallet] = University(_wallet, _name, true);
        universityAddresses.push(_wallet);
        emit UniversityRegistered(_wallet, _name);
    }

    function removeUniversity(address _wallet) public onlyOwner {
        require(universities[_wallet].isRegistered, "University not found.");
        universities[_wallet].isRegistered = false;
        emit UniversityRemoved(_wallet);
    }

    function getUniversityCount() public view returns (uint256) {
        return universityAddresses.length;
    }

    function getUniversityByAddress(address _wallet) public view returns (string memory name, bool isRegistered) {
        University storage uni = universities[_wallet];
        return (uni.name, uni.isRegistered);
    }

    function getAllUniversityAddresses() public view returns (address[] memory) {
        return universityAddresses;
    }

    // ========================
    // STUDENT REGISTRATION & MANAGEMENT (University only)
    // ========================

    function registerStudent(string memory _studentId, string memory _name, bytes32 _passwordHash) public onlyRegisteredUniversity {
        require(bytes(students[_studentId].studentId).length == 0, "Student already registered.");
        students[_studentId] = Student(_studentId, _name, _passwordHash, true, msg.sender);
        registeredStudentIds.push(_studentId);
        emit StudentRegistered(_studentId, msg.sender);
    }

    function updateStudentPassword(string memory _studentId, bytes32 _newPasswordHash) public onlyRegisteredUniversity {
        require(bytes(students[_studentId].studentId).length != 0, "Student not found.");
        require(students[_studentId].universityWallet == msg.sender, "Not the registering university.");
        students[_studentId].passwordHash = _newPasswordHash;
        emit StudentPasswordUpdated(_studentId);
    }

    function getStudentPasswordHash(string memory _studentId) public view onlyRegisteredUniversity returns (bytes32) {
        require(bytes(students[_studentId].studentId).length != 0, "Student not found.");
        require(students[_studentId].universityWallet == msg.sender, "Not the registering university.");
        return students[_studentId].passwordHash;
    }

    function getStudent(string memory _studentId) public view returns (string memory, string memory, bool, address) {
        Student storage student = students[_studentId];
        return (student.studentId, student.name, student.isRegistered, student.universityWallet);
    }

    function getRegisteredStudentIds() public view returns (string[] memory) {
        return registeredStudentIds;
    }

    function studentLogin(string memory _studentId, bytes32 _passwordHash) public view returns (bool) {
        Student storage student = students[_studentId];
        return student.isRegistered && student.passwordHash == _passwordHash;
    }

    // ========================
    // CERTIFICATE ISSUANCE (University only)
    // ========================

    function issueCredential(
        string memory studentId,
        string memory name,
        string memory branch,
        string memory dept,
        string memory cgpa,
        string memory _ipfsHash,
        string memory issuedDate
    ) public onlyRegisteredUniversity {
        require(students[studentId].isRegistered, "Student is not registered.");
        bytes32 credentialHash = _calculateCertHash(studentId, name, cgpa, issuedDate, msg.sender);
        require(bytes(credentials[credentialHash].studentId).length == 0, "Credential with this hash already exists.");

        Certificate memory newCert = Certificate({
            studentId: studentId,
            name: name,
            branch: branch,
            dept: dept,
            cgpa: cgpa,
            ipfsHash: _ipfsHash,
            issuedDate: issuedDate,
            issuer: msg.sender,
            status: CertificateStatus.Active,
            revocationReason: "",
            revokedAt: 0
        });

        credentials[credentialHash] = newCert;
        issuedHashes.push(credentialHash);
        universityIssuedHashes[msg.sender].push(credentialHash);
        emit CredentialIssued(credentialHash, studentId, msg.sender);
    }

    // ========================
    // CERTIFICATE REVOCATION (University only — must be the original issuer)
    // ========================

    function revokeCredential(bytes32 _credentialHash, string memory _reason) public onlyRegisteredUniversity {
        Certificate storage cert = credentials[_credentialHash];
        require(bytes(cert.studentId).length != 0, "Credential not found.");
        require(cert.issuer == msg.sender, "Only the issuing university can revoke.");
        require(cert.status == CertificateStatus.Active, "Credential is already revoked.");

        cert.status = CertificateStatus.Revoked;
        cert.revocationReason = _reason;
        cert.revokedAt = block.timestamp;

        emit CredentialRevoked(_credentialHash, _reason, msg.sender);
    }

    // ========================
    // CERTIFICATE VERIFICATION (Public — anyone can verify)
    // ========================

    function getCredentialByHash(bytes32 credentialHash) public view returns (Certificate memory) {
        return credentials[credentialHash];
    }

    function getIssuedHashes() public view returns (bytes32[] memory) {
        return issuedHashes;
    }

    function getUniversityIssuedHashes(address _university) public view returns (bytes32[] memory) {
        return universityIssuedHashes[_university];
    }

    function getCertificateStatus(bytes32 _credentialHash) public view returns (CertificateStatus, string memory, uint256) {
        Certificate storage cert = credentials[_credentialHash];
        return (cert.status, cert.revocationReason, cert.revokedAt);
    }
}