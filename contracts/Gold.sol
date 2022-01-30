// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Withdrawable.sol";
import "./ExternalActor.sol";

contract Gold is ERC20, Ownable, Withdrawable, ExternalActor {
  uint256 public maxSupply = 1000;

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    _mint(msg.sender, 10000000000 * 10**uint256(decimals()));
  }

  function externalMint(address requester, uint256 amount) public onlyAllowedMinters {
    _mint(requester, amount * 10**uint256(decimals()));
  }

  // function externalBurn(address requester, uint256 amount) public onlyAllowedBurners {
  //   _burn(requester, amount * 10**uint256(decimals()));
  // }
}
