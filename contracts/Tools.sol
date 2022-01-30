// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Withdrawable.sol";
import "./ExternalActor.sol";
import "./String.sol";

contract Tools is ERC721, Ownable, Withdrawable, ExternalActor {
  uint256 private nextId = 1;

  struct Bonuses {
    uint256 stone;
    uint256 iron;
    uint256 gold;
  }

  struct Tool {
    string name;
    string description;
    string image;
    uint256 toolType;
    uint256 speed;
    Bonuses bonuses;
  }

  mapping(uint256 => Tool) private _toolDetails;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    // mintTool(msg.sender, 1);
  }

  // function addTool(
  //   string memory name,
  //   uint256 inputTokenId,
  //   uint256 inputAmount,
  //   uint256 outputTokenType
  // ) public onlyOwner returns (uint256 tokenId) {
  //   uint256 newId = nextId;
  //   _recipeDetails[newId] = Recipe(name, newId, inputTokenId, inputAmount, outputTokenType, true);
  //   nextId++;
  //   numRecipes++;
  //   return newId;
  // }

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
      "Pickaxe",
      "A basic tool",
      "QmQif6u78YavNFEhAzjBDxZjH29dMyAexBY1md3jBjnazR",
      toolType,
      1,
      Bonuses(1, 1, 1)
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
