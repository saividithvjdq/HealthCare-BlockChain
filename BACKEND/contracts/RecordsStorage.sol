pragma solidity ^0.8.0;

contract RecordsStorage {
    struct Record {
        string ipfsHash;
        address uploader;
    }

    mapping(address => Record[]) public records;

    function storeRecord(string memory _ipfsHash) public {
        records[msg.sender].push(Record(_ipfsHash, msg.sender));
    }

    function getRecords(address _user) public view returns (Record[] memory) {
        return records[_user];
    }
}