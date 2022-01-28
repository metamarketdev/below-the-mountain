// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Withdrawable is Ownable {
  function withdraw(address payable _to) public onlyOwner {
    (bool sent, ) = _to.call{ value: address(this).balance }("");
    require(sent, "FAIL");
  }

  function withdrawToken(uint256 amount, address _tokenContract) public onlyOwner {
    IERC20 tokenContract = IERC20(_tokenContract);
    tokenContract.transfer(msg.sender, amount);
  }
}
