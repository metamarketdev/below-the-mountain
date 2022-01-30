// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Withdrawable.sol";
import "./ExternalActor.sol";
import "./String.sol";

contract Claims is ERC721, Ownable, Withdrawable, ExternalActor {
  uint256 private amountMinted = 1;
  uint256 public mapSize = 16; // TODO: fine-tune this; allow for update + lock
  uint256 public maxDepth = 64; // TODO: fine-tune this; allow for update + lock

  // FIXME: coords unicity

  struct Bonuses {
    uint256 stone;
    uint256 iron;
    uint256 gold;
  }

  struct Claim {
    uint256 x;
    uint256 y;
    uint256 z;
    string name;
    string description;
    string image;
    Bonuses bonuses;
  }

  mapping(uint256 => Claim) private _claimDetails;

  constructor(string memory name, string memory symbol) ERC721(name, symbol) {
    mintClaim(msg.sender, 1);
  }

  function getCoords(uint256 tokenId)
    internal
    view
    returns (
      uint256,
      uint256,
      uint256
    )
  {
    uint256 x = tokenId % mapSize;
    uint256 y = (tokenId - x) / mapSize;
    uint256 z = (tokenId - x - y) / maxDepth;
    return (x, y, z);
  }

  function mintClaim(address requester, uint256 tokenId) private {
    require(!_exists(tokenId), "ALREADY_CLAIMED"); // TODO: necessary ?
    (uint256 x, uint256 y, uint256 z) = getCoords(tokenId);
    require(x <= mapSize && y <= mapSize && z <= maxDepth, "OUT_OF_BOUNDS");

    _claimDetails[tokenId] = Claim(
      x,
      y,
      z,
      "Claim",
      "A mining claim.",
      "QmUKwkmHyHoYMZgnyMprKbhHSA5JrA78eiQcK8HPzTvahW",
      Bonuses(1, 1, 1)
    );

    _safeMint(requester, tokenId);
    amountMinted++;
  }

  function getMetadata(uint256 tokenId) public view returns (string memory) {
    return
      string(
        abi.encodePacked(
          '{"name": "',
          _claimDetails[tokenId].name,
          '", "description": "',
          _claimDetails[tokenId].description,
          '", "background_color" : "101922", "image": "ipfs://',
          _claimDetails[tokenId].image,
          '", "bonuses": {',
          '"stone": "',
          String.toString(_claimDetails[tokenId].bonuses.stone),
          '", "iron": "',
          String.toString(_claimDetails[tokenId].bonuses.iron),
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
