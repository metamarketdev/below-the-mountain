// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Withdrawable.sol";
import "./ExternalActor.sol";
import "./String.sol";

contract Claims is ERC721, Ownable, Withdrawable, ExternalActor {
  uint256 public amountMinted = 1;
  uint256 public mapSize = 16;

  struct Bonuses {
    uint256 stone;
    uint256 iron;
    uint256 mithril;
    uint256 gold;
    uint256 ruby;
    uint256 emerald;
    uint256 sapphire;
    uint256 diamond;
  }

  struct Claim {
    uint256 z;
    uint256 x;
    uint256 y;
    string name;
    string description;
    string image;
    Bonuses bonuses;
  }

  mapping(uint256 => Claim) public _claimDetails;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

  function getCoords(uint256 tokenId)
    internal
    view
    returns (
      uint256,
      uint256,
      uint256
    )
  {
    uint256 z = (tokenId) / (mapSize**2); // Floored by solidity
    uint256 x = tokenId % mapSize;
    uint256 y = (tokenId - x) / mapSize;
    return (z, x, y);
  }

  // FIXME: use Chainlink VRF (waiting for release on AVAX)
  function getRandom(uint256 randomSeed) private view returns (uint256) {
    return (uint256(keccak256(abi.encode(randomSeed, block.number))) % 100) + 1;
  }

  function safeMintClaim(address requester, uint256 tokenId) private {
    require(!_exists(tokenId), "ALREADY_CLAIMED");
    (uint256 z, uint256 x, uint256 y) = getCoords(tokenId);
    require(x <= mapSize && y <= mapSize, "OUT_OF_BOUNDS");

    _claimDetails[tokenId] = Claim(
      z,
      x,
      y,
      "Claim",
      "A mining claim.",
      "QmUKwkmHyHoYMZgnyMprKbhHSA5JrA78eiQcK8HPzTvahW",
      Bonuses(
        getRandom(1),
        getRandom(2),
        getRandom(3),
        getRandom(4),
        getRandom(5),
        getRandom(6),
        getRandom(7),
        getRandom(8)
      )
    );

    _safeMint(requester, tokenId);
    amountMinted++;
  }

  function mintClaim(uint256 tokenId) public {
    safeMintClaim(msg.sender, tokenId);
    amountMinted++;
  }

  function exists(uint256 tokenId) public view returns (bool) {
    return _exists(tokenId);
  }

  function getClaimDetails(uint256 tokenId) public view returns (Claim memory) {
    return _claimDetails[tokenId];
  }

  function getMetadata(uint256 tokenId) public view returns (string memory) {
    return
      string(
        abi.encodePacked(
          '{"name": "',
          _claimDetails[tokenId].name,
          " #",
          String.toString(tokenId),
          '", "description": "',
          _claimDetails[tokenId].description,
          '", "z": "',
          String.toString(_claimDetails[tokenId].z),
          '", "x": "',
          String.toString(_claimDetails[tokenId].x),
          '", "y": "',
          String.toString(_claimDetails[tokenId].y),
          '", "background_color" : "101922", "image": "ipfs://',
          _claimDetails[tokenId].image,
          '", "bonuses": {',
          '"stone": "',
          String.toString(_claimDetails[tokenId].bonuses.stone),
          '", "iron": "',
          String.toString(_claimDetails[tokenId].bonuses.iron),
          '", "mithril": "',
          String.toString(_claimDetails[tokenId].bonuses.mithril),
          '", "gold": "',
          String.toString(_claimDetails[tokenId].bonuses.gold),
          '"}}'
        )
      );
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_exists(tokenId), "NO_SUCH_TOKEN");
    return getMetadata(tokenId);
  }
}
