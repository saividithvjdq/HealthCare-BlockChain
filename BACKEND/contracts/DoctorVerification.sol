pragma solidity ^0.8.0;

contract DoctorVerification {
    struct Doctor {
        string licenseNumber;
        string idPhotoHash;
        string livePhotoHash;
        bool isVerified;
        uint256 verificationTimestamp;
    }

    struct AccessRecord {
        string patientAadhaar;
        string doctorLicense;
        uint256 timestamp;
        string reason;
    }

    mapping(string => Doctor) public doctors;
    mapping(string => AccessRecord[]) public accessRecords;

    event DoctorVerified(string licenseNumber, uint256 timestamp);
    event RecordAccessed(string doctorLicense, string patientAadhaar, uint256 timestamp);

    function verifyDoctor(
        string memory _licenseNumber,
        string memory _idPhotoHash,
        string memory _livePhotoHash
    ) public {
        doctors[_licenseNumber] = Doctor({
            licenseNumber: _licenseNumber,
            idPhotoHash: _idPhotoHash,
            livePhotoHash: _livePhotoHash,
            isVerified: true,
            verificationTimestamp: block.timestamp
        });

        emit DoctorVerified(_licenseNumber, block.timestamp);
    }

    function recordAccess(
        string memory _doctorLicense,
        string memory _patientAadhaar,
        string memory _reason
    ) public {
        require(doctors[_doctorLicense].isVerified, "Doctor not verified");

        AccessRecord memory record = AccessRecord({
            doctorLicense: _doctorLicense,
            patientAadhaar: _patientAadhaar,
            timestamp: block.timestamp,
            reason: _reason
        });

        accessRecords[_patientAadhaar].push(record);
        emit RecordAccessed(_doctorLicense, _patientAadhaar, block.timestamp);
    }
}