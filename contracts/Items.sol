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

  mapping(uint256 => Item) private _itemDetails;

  constructor(string memory _uri) ERC1155(_uri) {
    addItem("Stone", "Pretty hard", "QmX4o8tg4ivL2MXG8CJX79BfMjd3rPGuMejkmRfKwFrEmP");
    addItem("Iron", "Basic metal", "QmXJwvWAzkabRtgmYuktWRRCEbxXEHQZc395QMtBqz4zt4");
    addItem("Mithril", "Rare metal", "QmdooUQrAfRSTVHnKcQXoHGNHEBJjVtsWDbeTkAQBAJm2v");

    addItem("Sapphire", "Blue gem", "QmSGPEhGPRc3JpVZGCyME2JKJS7N1xKVtLXjN5BmKKXdBm");
    addItem("Ruby", "Red gem", "QmP1RvzTuGPXwtcc3Pjd4yA2vW4CRFVLqscejJ98qHvBac");
    addItem("Emerald", "Green gem", "QmTsU42PDJbhEvwNQ3Y4Ex6Jo5s3AYa7dQuN4zw2oJdidV");
    addItem("Diamond", "Pure gem", "QmWr38jR8Z4UkoVkE6M7RnsQTrQq8smg6jycpKUSig3RMT");
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
    _mint(requester, tokenId, amount, '');
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
