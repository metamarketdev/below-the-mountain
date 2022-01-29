// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Withdrawable.sol";

contract Crafting is Ownable, Withdrawable {
  uint256 private nextId = 1;

  struct Recipe {
    uint256 inputTokenId;
    uint256 inputAmount;
    uint256 outputTokenId;
    uint256 outputAmount;
  }

  mapping(uint256 => Recipe) private _recipeDetails;

  constructor() {}

  function addRecipe(
    uint256 inputTokenId,
    uint256 inputAmount,
    uint256 outputTokenId,
    uint256 outputAmount
  ) public onlyOwner returns (uint256 tokenId) {
    uint256 newId = nextId;
    _recipeDetails[newId] = Recipe(inputTokenId, inputAmount, outputTokenId, outputAmount);
    nextId++;
    return newId;
  }

  function updateRecipe(
    uint256 recipeId,
    uint256 inputTokenId,
    uint256 inputAmount,
    uint256 outputTokenId,
    uint256 outputAmount
  ) public onlyOwner {
    _recipeDetails[recipeId] = Recipe(inputTokenId, inputAmount, outputTokenId, outputAmount);
  }
}
