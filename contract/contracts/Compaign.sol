// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Campaign {
  address public owner;

  constructor() {
    owner = msg.sender;
  }
}