// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Strings.sol";

contract Campaign {

  struct Request {
    string description;
    uint value;
    address recipient;
    bool complete;
    uint approvalCount;
    mapping(address => bool) approvals;
  }

  uint public numRequests;
  mapping (uint => Request) requests;

  address public owner;
  uint256 public minimumContribution;
  mapping(address => bool) public approvers;

  constructor(uint256 minimum) {
    owner = msg.sender;
    minimumContribution = minimum;
  }

  modifier contribution() {
    require(
      msg.value >= minimumContribution,
      string.concat(
        "Value must be greater than ",
        Strings.toString(minimumContribution),
        " wei"
      )
    );
    _;
  }

  modifier restricted() {
    require(msg.sender == owner, "Must be the owner to call this function!");
    _;
  }

  function contribute() public payable contribution {
    approvers[msg.sender] = true;
  }

  function createRequest(string memory description, uint value, address recipient) 
    public restricted {
      Request storage r = requests[numRequests++];
      r.description = description;
      r.value = value;
      r.recipient = recipient;
      r.complete = false;
      r.approvalCount = 0;
  }

  function approveRequest(uint index) public {
    Request storage request = requests[index];

    require(approvers[msg.sender], "You cannot approve this request.");
    require(!request.approvals[msg.sender], "You have already approved this request.");
    
    request.approvals[msg.sender] = true;
    request.approvalCount++;
  }
}
