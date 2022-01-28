// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Withdrawable.sol";

contract Tools is ERC721, Ownable, Withdrawable {
  uint256 private nextId = 1;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    // _mint(msg.sender, 10000000000 * 10**uint256(decimals()));
  }
}
