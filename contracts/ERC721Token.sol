// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract ERC721Token is ERC721 {

    constructor(string memory name, string memory symbol) ERC721("MyNFT", "MNFT") {}


    function owner() public view virtual returns (address){
        return msg.sender;
    }

    function mint(address to, uint256 tokenId) public {
        if(to == owner()){
        _mint(to, tokenId);
        console.log("Minted to owner");
        } else {
            console.log("Minted to non-owner");
        }
    }

    // function burn(uint256 tokenId) public {
    //     require(_isApprovedOrOwner(Context._msgSender(), tokenId), "ERC721: caller is not owner nor approved"); // Use Context._msgSender() instead of _msgSender()
    //     _burn(tokenId);
    // }

}
 