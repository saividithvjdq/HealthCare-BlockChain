// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HealthRecords is AccessControl, ReentrancyGuard {
    bytes32 public constant PATIENT_ROLE = keccak256("PATIENT_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");
    
    struct Record {
        string fileHash;
        string recordType;
        uint256 timestamp;
        string aadhaarNumber;
        address creator;
        bool isEmergencyAccessible;
    }
    
    struct EmergencyAccess {
        address hospital;
        uint256 grantedAt;
        uint256 expiresAt;
        bool isActive;
    }
    
    mapping(string => Record[]) private patientRecords;
    mapping(string => mapping(address => bool)) private doctorAccess;
    mapping(string => EmergencyAccess) private emergencyAccess;
    
    event RecordAdded(string indexed aadhaarNumber, string fileHash, uint256 timestamp);
    event AccessGranted(string indexed aadhaarNumber, address indexed doctor);
    event AccessRevoked(string indexed aadhaarNumber, address indexed doctor);
    event EmergencyAccessGranted(string indexed aadhaarNumber, address indexed hospital);
    event EmergencyAccessRevoked(string indexed aadhaarNumber);
    
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    modifier onlyPatient(string memory aadhaarNumber) {
        require(hasRole(PATIENT_ROLE, msg.sender), "Caller is not a patient");
        _;
    }
    
    modifier onlyDoctor() {
        require(hasRole(DOCTOR_ROLE, msg.sender), "Caller is not a doctor");
        _;
    }
    
    modifier onlyHospital() {
        require(hasRole(HOSPITAL_ROLE, msg.sender), "Caller is not a hospital");
        _;
    }
    
    function addRecord(
        string memory _aadhaarNumber,
        string memory _fileHash,
        string memory _recordType,
        bool _isEmergencyAccessible
    ) public onlyDoctor nonReentrant {
        require(doctorAccess[_aadhaarNumber][msg.sender], "Doctor does not have access");
        
        Record memory newRecord = Record({
            fileHash: _fileHash,
            recordType: _recordType,
            timestamp: block.timestamp,
            aadhaarNumber: _aadhaarNumber,
            creator: msg.sender,
            isEmergencyAccessible: _isEmergencyAccessible
        });
        
        patientRecords[_aadhaarNumber].push(newRecord);
        emit RecordAdded(_aadhaarNumber, _fileHash, block.timestamp);
    }

    function grantAccess(string memory _aadhaarNumber, address _doctor) 
        public 
        onlyPatient(_aadhaarNumber)
    {
        require(!doctorAccess[_aadhaarNumber][_doctor], "Doctor already has access");
        require(hasRole(DOCTOR_ROLE, _doctor), "Address is not a doctor");
        
        doctorAccess[_aadhaarNumber][_doctor] = true;
        emit AccessGranted(_aadhaarNumber, _doctor);
    }
    
    function revokeAccess(string memory _aadhaarNumber, address _doctor) 
        public 
        onlyPatient(_aadhaarNumber)
    {
        require(doctorAccess[_aadhaarNumber][_doctor], "Doctor does not have access");
        
        doctorAccess[_aadhaarNumber][_doctor] = false;
        emit AccessRevoked(_aadhaarNumber, _doctor);
    }
    
    function grantEmergencyAccess(string memory _aadhaarNumber) 
        public 
        onlyHospital 
        nonReentrant
    {
        require(!emergencyAccess[_aadhaarNumber].isActive, "Emergency access already granted");
        
        emergencyAccess[_aadhaarNumber] = EmergencyAccess({
            hospital: msg.sender,
            grantedAt: block.timestamp,
            expiresAt: block.timestamp + 24 hours,
            isActive: true
        });
        
        emit EmergencyAccessGranted(_aadhaarNumber, msg.sender);
    }
    
    function revokeEmergencyAccess(string memory _aadhaarNumber) 
        public 
        onlyHospital
    {
        require(emergencyAccess[_aadhaarNumber].hospital == msg.sender, "Not authorized");
        require(emergencyAccess[_aadhaarNumber].isActive, "No active emergency access");
        
        emergencyAccess[_aadhaarNumber].isActive = false;
        emit EmergencyAccessRevoked(_aadhaarNumber);
    }
    
    function getRecords(string memory _aadhaarNumber) 
        public 
        view 
        returns (Record[] memory) 
    {
        require(
            hasRole(PATIENT_ROLE, msg.sender) ||
            doctorAccess[_aadhaarNumber][msg.sender] ||
            (hasRole(HOSPITAL_ROLE, msg.sender) && 
             emergencyAccess[_aadhaarNumber].isActive &&
             emergencyAccess[_aadhaarNumber].hospital == msg.sender &&
             emergencyAccess[_aadhaarNumber].expiresAt > block.timestamp),
            "Not authorized to view records"
        );
        
        return patientRecords[_aadhaarNumber];
    }
    
    function getEmergencyAccessDetails(string memory _aadhaarNumber) 
        public 
        view 
        returns (EmergencyAccess memory) 
    {
        require(
            hasRole(PATIENT_ROLE, msg.sender) ||
            hasRole(HOSPITAL_ROLE, msg.sender),
            "Not authorized to view emergency access details"
        );
        
        return emergencyAccess[_aadhaarNumber];
    }
}