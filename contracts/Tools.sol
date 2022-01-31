// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Withdrawable.sol";
import "./ExternalActor.sol";
import "./String.sol";

contract Tools is ERC721, Ownable, Withdrawable, ExternalActor {
  uint256 private nextId = 1;
  uint256 private nextTypeId = 1;

  struct Bonuses {
    uint256 stone;
    uint256 iron;
    uint256 mithril;
    uint256 gold;
  }

  struct ToolType {
    string name;
    string description;
    string image;
  }

  struct Tool {
    string name;
    string description;
    string image;
    uint256 toolType;
    uint256 speed;
    Bonuses bonuses;
  }

  mapping(uint256 => ToolType) public _toolTypes;
  mapping(uint256 => Tool) public _toolDetails;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    addToolType(
      "Stone Pickaxe",
      "A basic pickaxe",
      "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/pickaxe_stone.png"
    );
    addToolType(
      "Iron Pickaxe",
      "A decent pickaxe",
      "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/pickaxe_iron.png"
    );
    addToolType(
      "Mithril Pickaxe",
      "A professional pickaxe",
      "QmQcFDQurLDxhYfciWT3Jd4w4tTyBn7Ak7J4v8J969EaHF/pickaxe_mithril.png"
    );
  }

  function addToolType(
    string memory name,
    string memory description,
    string memory image
  ) public onlyOwner returns (uint256 tokenTypeId) {
    uint256 newId = nextTypeId;
    _toolTypes[newId] = ToolType(name, description, image);
    nextTypeId++;
    return nextTypeId;
  }

  function externalMint(
    address requester,
    uint256 toolType,
    uint256 amount
  ) public onlyAllowedMinters {
    for (uint256 i = 0; i < amount; i++) {
      mintTool(requester, toolType);
    }
  }

  function mintTool(address requester, uint256 toolType) private {
    _toolDetails[nextId] = Tool(
      _toolTypes[toolType].name,
      _toolTypes[toolType].description,
      _toolTypes[toolType].image,
      toolType,
      1,
      Bonuses(toolType * 3, toolType * 2, toolType * 1, toolType * 1)
    );
    _safeMint(requester, nextId);
    nextId++;
  }

  function getMetadata(uint256 tokenId) public view returns (string memory) {
    return
      string(
        abi.encodePacked(
          '{"name": "',
          _toolDetails[tokenId].name,
          " #",
          String.toString(tokenId),
          '", "description": "',
          _toolDetails[tokenId].description,
          '", "speed": "',
          String.toString(_toolDetails[tokenId].speed),
          '", "background_color" : "101922", "image": "ipfs://',
          _toolDetails[tokenId].image,
          '", "bonuses": {',
          '"stone": "',
          String.toString(_toolDetails[tokenId].bonuses.stone),
          '", "iron": "',
          String.toString(_toolDetails[tokenId].bonuses.iron),
          '", "mithril": "',
          String.toString(_toolDetails[tokenId].bonuses.mithril),
          '", "gold": "',
          String.toString(_toolDetails[tokenId].bonuses.gold),
          '"}}'
        )
      );
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "NO_SUCH_TOKEN");
    return getMetadata(tokenId);
  }
}
