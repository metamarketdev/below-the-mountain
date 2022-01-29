// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Withdrawable.sol";
import "./String.sol";

contract Items is ERC1155, Ownable, Withdrawable {
  uint256 private nextId = 1;

  struct Item {
    string name;
    string description;
    string image;
  }

  mapping(uint256 => Item) private _itemDetails;

  constructor(string memory _uri) ERC1155(_uri) {
    uint256 stoneId = addItem(
      "Stone",
      "Pretty hard",
      "QmYWJAJw5HD4HaZwDeWd4AhxRmRJ9iv3N2K1W8J1TgWkNs"
    );
    uint256 ironId = addItem(
      "Iron",
      "Basic metal",
      "QmYWJAJw5HD4HaZwDeWd4AhxRmRJ9iv3N2K1W8J1TgWkNs"
    );
    uint256 mithrilId = addItem(
      "Mithril",
      "Rare metal",
      "QmYWJAJw5HD4HaZwDeWd4AhxRmRJ9iv3N2K1W8J1TgWkNs"
    );
    _mint(msg.sender, stoneId, 100, "");
    _mint(msg.sender, ironId, 100, "");
    _mint(msg.sender, mithrilId, 100, "");
  }

  function addItem(
    string memory name,
    string memory description,
    string memory image
  ) public onlyOwner returns (uint256 tokenId) {
    uint256 newId = nextId;
    _itemDetails[newId] = Item(name, description, image);
    nextId++;
    return newId;
  }

  function getMetadata(uint256 tokenId) public view returns (string memory) {
    return
      string(
        abi.encodePacked(
          '{"name": "',
          _itemDetails[tokenId].name,
          '", "description": "',
          _itemDetails[tokenId].description,
          '", "background_color" : "101922", "image": "ipfs://',
          _itemDetails[tokenId].image,
          '"}'
        )
      );
  }

  function uri(uint256 tokenId) public view override returns (string memory) {
    // TODO: require for invalid request (unexisting id)
    return getMetadata(tokenId);
  }
}
