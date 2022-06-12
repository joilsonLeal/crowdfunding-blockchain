// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimumContribution) public {
        address newCampaign = (address)(
            new Campaign(minimumContribution, msg.sender)
        );
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        mapping(address => bool) approvals;
    }

    uint256 public numRequests;
    mapping(uint256 => Request) public requests;

    address public owner;
    uint256 public minimumContribution;
    mapping(address => bool) public approvers;
    uint256 public approversCount;

    constructor(uint256 minimum, address creator) {
        owner = creator;
        minimumContribution = minimum;
    }

    modifier contribution() {
        require(msg.value >= minimumContribution);
        _;
    }

    modifier restricted() {
        require(
            msg.sender == owner,
            "Must be the owner to call this function!"
        );
        _;
    }

    function contribute() public payable contribution {
        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        Request storage r = requests[numRequests++];
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender], "You cannot approve this request.");
        require(
            !request.approvals[msg.sender],
            "You have already approved this request."
        );

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];

        require(
            request.approvalCount >= (approversCount / 2),
            "You must have at least 20% approval to make this request."
        );
        require(!request.complete, "Request has already been completed.");

        request.complete = true;
        payable(request.recipient).transfer(request.value);
    }
}
