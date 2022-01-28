// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ExternalActor is Ownable {
  mapping(address => bool) allowedMinters;
  mapping(address => bool) allowedBurners;

  bool locked = false;

  modifier onlyAllowedMinters() {
    _isAuthorizedMinter();
    _;
  }

  modifier onlyAllowedBurners() {
    _isAuthorizedBurner();
    _;
  }

  function authorize(
    address actor,
    bool allowMint,
    bool allowBurn
  ) public onlyOwner {
    require(!locked, "LOCKED_FOREVER");
    allowedMinters[actor] = allowMint;
    allowedBurners[actor] = allowBurn;
  }

  function _isAuthorizedMinter() internal view {
    require(allowedMinters[msg.sender], "UNAUTHORIZED");
  }

  function _isAuthorizedBurner() internal view {
    require(allowedBurners[msg.sender], "UNAUTHORIZED");
  }

  function lockActors() public onlyOwner {
    locked = true;
  }
}
