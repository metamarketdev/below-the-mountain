// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Items.sol";
import "./Tools.sol";
import "./Claims.sol";
import "./Gold.sol";
import "./Withdrawable.sol";

contract Mining is Ownable, Withdrawable {
  Items private itemsContract;
  Tools private toolsContract;
  Claims private claimsContract;
  Gold private goldContract;

  constructor(
    address _toolsContract,
    address _itemsContract,
    address _claimsContract,
    address _goldContract
  ) {
    toolsContract = Tools(_toolsContract);
    itemsContract = Items(_itemsContract);
    claimsContract = Claims(_claimsContract);
    goldContract = Gold(_goldContract);
  }

  // FIXME: use Chainlink VRF (waiting for release on AVAX)
  function getRandom(uint256 randomSeed) private view returns (uint256) {
    return (uint256(keccak256(abi.encode(randomSeed, block.number))) % 100) + 1;
  }

  function mine(uint256 claimTokenId, uint256 toolTokenId) public {
    require(toolsContract.exists(toolTokenId), "NO_TOOL");
    require(toolsContract.ownerOf(toolTokenId) == msg.sender, "TOOL_NOT_OWNED");
    require(claimsContract.exists(claimTokenId), "NO_CLAIM");

    address claimOwner = claimsContract.ownerOf(claimTokenId);

    // TODO: Refactor indexes and use a loop
    itemsContract.externalMint(
      msg.sender,
      1,
      (getRandom(1) *
        (claimsContract.getClaimDetails(claimTokenId).bonuses.stone +
          toolsContract.getToolDetails(toolTokenId).bonuses.stone)) / 3
    );
    itemsContract.externalMint(
      msg.sender,
      2,
      (getRandom(2) *
        (claimsContract.getClaimDetails(claimTokenId).bonuses.iron +
          toolsContract.getToolDetails(toolTokenId).bonuses.iron)) / 5
    );
    itemsContract.externalMint(
      msg.sender,
      3,
      (getRandom(3) *
        (claimsContract.getClaimDetails(claimTokenId).bonuses.mithril +
          toolsContract.getToolDetails(toolTokenId).bonuses.mithril)) / 10
    );

    itemsContract.externalMint(
      msg.sender,
      7,
      (getRandom(5) *
        (claimsContract.getClaimDetails(claimTokenId).bonuses.ruby +
          toolsContract.getToolDetails(toolTokenId).bonuses.ruby)) / 20
    );
    itemsContract.externalMint(
      msg.sender,
      8,
      (getRandom(6) *
        (claimsContract.getClaimDetails(claimTokenId).bonuses.emerald +
          toolsContract.getToolDetails(toolTokenId).bonuses.emerald)) / 20
    );

    itemsContract.externalMint(
      msg.sender,
      9,
      (getRandom(7) *
        (claimsContract.getClaimDetails(claimTokenId).bonuses.sapphire +
          toolsContract.getToolDetails(toolTokenId).bonuses.sapphire)) / 20
    );
    itemsContract.externalMint(
      msg.sender,
      10,
      (getRandom(8) *
        (claimsContract.getClaimDetails(claimTokenId).bonuses.diamond +
          toolsContract.getToolDetails(toolTokenId).bonuses.diamond)) / 50
    );

    goldContract.externalMint(
      msg.sender,
      getRandom(4) *
        (claimsContract.getClaimDetails(claimTokenId).bonuses.gold +
          toolsContract.getToolDetails(toolTokenId).bonuses.gold)
    );

    // Pay the claim owner fee
    // IMPROVEMENT: use ERC20 transfers and approval instead of mint/burn to pay claim owner?

    goldContract.externalMint(
      claimOwner,
      getRandom(4) *
        (claimsContract.getClaimDetails(claimTokenId).bonuses.gold +
          toolsContract.getToolDetails(toolTokenId).bonuses.gold)
    );
  }
}
