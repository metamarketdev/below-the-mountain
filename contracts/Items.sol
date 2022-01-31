// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ExternalActor.sol";
import "./Withdrawable.sol";
import "./String.sol";

contract Items is ERC1155, Ownable, Withdrawable, ExternalActor {
  uint256 private nextId = 1;

  struct Item {
    string name;
    string description;
    string image;
  }

  mapping(uint256 => Item) public _itemDetails;

  constructor(string memory _uri) ERC1155(_uri) {
    addItem("Raw Stone", "Pretty hard", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/raw_stone.png");
    addItem("Raw Iron", "Basic metal", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/raw_iron.png");
    addItem("Raw Mithril", "Rare metal", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/raw_mithril.png");

    addItem("Stone Block", "Pretty hard", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/ingot_stone.png");
    addItem("Iron Ingot", "Basic metal", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/ingot_iron.png");
    addItem("Mithril Ingot", "Rare metal", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/ingot_mithril.png");

    addItem("Sapphire", "Blue gem", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/gem_blue.png");
    addItem("Ruby", "Red gem", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/gem_red.png");
    addItem("Emerald", "Green gem", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/gem_green.png");
    addItem("Diamond", "Pure gem", "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/gem_white.png");
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

  function externalBurn(
    address requester,
    uint256 tokenId,
    uint256 amount
  ) public onlyAllowedBurners {
    _burn(requester, tokenId, amount);
  }

  function externalMint(
    address requester,
    uint256 tokenId,
    uint256 amount
  ) public onlyAllowedMinters {
    _mint(requester, tokenId, amount, "");
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
    return getMetadata(tokenId);
  }
}
