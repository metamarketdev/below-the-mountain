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
    uint256 outputTokenType;
    bool enabled;
  }

  mapping(uint256 => Recipe) public _recipeDetails;

  constructor(address _toolsContract, address _itemsContract) {
    toolsContract = Tools(_toolsContract);
    itemsContract = Items(_itemsContract);

    addRecipe('Stone pickaxe', 1, 3, 1);
    addRecipe('Iron pickaxe', 2, 3, 2);
    addRecipe('Mithril pickaxe', 3, 3, 3);
  }

  function addRecipe(
    string memory name,
    uint256 inputTokenId,
    uint256 inputAmount,
    uint256 outputTokenType
  ) public onlyOwner returns (uint256 tokenId) {
    uint256 newId = nextId;
    _recipeDetails[newId] = Recipe(name, newId, inputTokenId, inputAmount, outputTokenType, true);
    nextId++;
    numRecipes++;
    return newId;
  }

  function updateRecipe(
    string memory name,
    uint256 recipeId,
    uint256 inputTokenId,
    uint256 inputAmount,
    uint256 outputTokenType
  ) public onlyOwner {
    _recipeDetails[recipeId] = Recipe(
      name,
      recipeId,
      inputTokenId,
      inputAmount,
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

    toolsContract.externalMint(msg.sender, _recipeDetails[recipeId].outputTokenType, amount);
  }
}
