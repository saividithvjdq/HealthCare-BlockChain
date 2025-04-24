// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthRecords {
    struct Record {
        string fileHash;
        string recordType;
        uint256 timestamp;
        string aadhaarNumber;
    }
    
    mapping(string => Record[]) private patientRecords;
    
    event RecordAdded(string aadhaarNumber, string fileHash, uint256 timestamp);

    function addRecord(string memory _aadhaarNumber, string memory _fileHash, string memory _recordType) public {
        Record memory newRecord = Record({
            fileHash: _fileHash,
            recordType: _recordType,
            timestamp: block.timestamp,
            aadhaarNumber: _aadhaarNumber
        });
        
        patientRecords[_aadhaarNumber].push(newRecord);
        emit RecordAdded(_aadhaarNumber, _fileHash, block.timestamp);
    }

    function getRecords(string memory _aadhaarNumber) public view returns (Record[] memory) {
        return patientRecords[_aadhaarNumber];
    }
}