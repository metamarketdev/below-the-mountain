// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Items.sol";
import "./Tools.sol";
import "./Gold.sol";
import "./Withdrawable.sol";

contract Faucet is Ownable, Withdrawable {
  Items private itemsContract;
  Tools private toolsContract;
  Gold private goldContract;

  mapping(address => uint256) public _tokenRequests;

  constructor(
    address _toolsContract,
    address _itemsContract,
    address _goldContract
  ) {
    toolsContract = Tools(_toolsContract);
    itemsContract = Items(_itemsContract);
    goldContract = Gold(_goldContract);
  }

  function requestTokens() public {
    toolsContract.externalMint(msg.sender, 1, 1);
    itemsContract.externalMint(msg.sender, 1, 10);
    itemsContract.externalMint(msg.sender, 2, 5);
    itemsContract.externalMint(msg.sender, 3, 1);
    goldContract.externalMint(msg.sender, 1000);
    _tokenRequests[msg.sender]++;
  }

  function getRequests() public view returns (uint256) {
    return _tokenRequests[msg.sender];
  }
}
