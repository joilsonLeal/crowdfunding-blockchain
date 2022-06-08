// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Strings.sol";

contract Campaign {

  struct Request {
    string description;
    uint value;
    address recipient;
    bool completed;
  }

  Request[] public requests;
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
      Request memory newRequest = Request({
        description: description,
        value: value,
        recipient: recipient,
        completed: false
      });
      requests.push(newRequest);
  }
}
