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

  address public owner;
  uint256 public minimumContribution;
  address[] public approvers;

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

  function contribute() public payable contribution {
    approvers.push(msg.sender);
  }
}
