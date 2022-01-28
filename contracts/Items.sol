// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Withdrawable.sol";

contract Items is ERC1155, Ownable, Withdrawable {
  uint256 private nextId = 1;

  struct Item {
    string name;
    string description;
    string image;
  }

  mapping(uint256 => Item) private _itemDetails;

  constructor(string memory _uri) ERC1155(_uri) {}

  function addItem(
    string memory name,
    string memory description,
    string memory image
  ) public onlyOwner {
    _itemDetails[nextId] = Item(name, description, image);
    nextId++;
  }

  function getTokenUri(uint256 tokenId) public view returns (string memory) {
    return _itemDetails[tokenId].image;
  }
}
