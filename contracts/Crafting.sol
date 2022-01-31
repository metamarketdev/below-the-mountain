// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Items.sol";
import "./Tools.sol";
import "./Withdrawable.sol";

contract Crafting is Ownable, Withdrawable {
  Items private itemsContract;
  Tools private toolsContract;

  uint256 private nextId = 1;
  uint256 public numRecipes = 0;

  struct Recipe {
    string name;
    uint256 recipeId;
    uint256 inputTokenId;
    uint256 inputAmount;
    uint256 outputTokenId;
    OutputTokenType outputTokenType;
    bool enabled;
  }

  enum OutputTokenType {
    Item,
    Tool
  }

  mapping(uint256 => Recipe) public _recipeDetails;

  constructor(address _toolsContract, address _itemsContract) {
    toolsContract = Tools(_toolsContract);
    itemsContract = Items(_itemsContract);

    addRecipe("Stone Block", 1, 3, 4, OutputTokenType.Item);
    addRecipe("Iron Ingot", 2, 3, 5, OutputTokenType.Item);
    addRecipe("Mithril Ingot", 3, 3, 6, OutputTokenType.Item);

    addRecipe("Stone Pickaxe", 4, 3, 1, OutputTokenType.Tool);
    addRecipe("Iron Pickaxe", 5, 3, 2, OutputTokenType.Tool);
    addRecipe("Mithril Pickaxe", 6, 3, 3, OutputTokenType.Tool);
  }

  function addRecipe(
    string memory name,
    uint256 inputTokenId,
    uint256 inputAmount,
    uint256 outputTokenId,
    OutputTokenType outputTokenType
  ) public onlyOwner returns (uint256 tokenId) {
    uint256 newId = nextId;
    _recipeDetails[newId] = Recipe(
      name,
      newId,
      inputTokenId,
      inputAmount,
      outputTokenId,
      outputTokenType,
      true
    );
    nextId++;
    numRecipes++;
    return newId;
  }

  function updateRecipe(
    string memory name,
    uint256 recipeId,
    uint256 inputTokenId,
    uint256 inputAmount,
    uint256 outputTokenId,
    OutputTokenType outputTokenType
  ) public onlyOwner {
    _recipeDetails[recipeId] = Recipe(
      name,
      recipeId,
      inputTokenId,
      inputAmount,
      outputTokenId,
      outputTokenType,
      _recipeDetails[recipeId].enabled
    );
  }

  function toggleRecipe(uint256 recipeId) public onlyOwner {
    _recipeDetails[recipeId].enabled = !_recipeDetails[recipeId].enabled;
  }

  function makeRecipe(uint256 recipeId, uint256 amount) public {
    itemsContract.externalBurn(
      msg.sender,
      _recipeDetails[recipeId].inputTokenId,
      _recipeDetails[recipeId].inputAmount * amount
    );

    if (_recipeDetails[recipeId].outputTokenType == OutputTokenType.Item) {
      itemsContract.externalMint(msg.sender, _recipeDetails[recipeId].outputTokenId, amount);
    }

    if (_recipeDetails[recipeId].outputTokenType == OutputTokenType.Tool) {
      toolsContract.externalMint(msg.sender, _recipeDetails[recipeId].outputTokenId, amount);
    }
  }
}
