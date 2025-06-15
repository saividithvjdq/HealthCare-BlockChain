pragma solidity ^0.8.0;

contract EmergencyAccess {
    struct AccessRequest {
        string doctorId;
        string photoHash;
        bool isEmergency;
    }

    mapping(address => AccessRequest[]) public accessRequests;

    function requestAccess(string memory _doctorId, string memory _photoHash, bool _isEmergency) public {
        require(_isEmergency, "Access only allowed for emergencies");
        accessRequests[msg.sender].push(AccessRequest(_doctorId, _photoHash, _isEmergency));
    }

    function getAccessRequests(address _user) public view returns (AccessRequest[] memory) {
        return accessRequests[_user];
    }
}