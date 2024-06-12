// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract ERC721Token is ERC721 {

    constructor(string memory name, string memory symbol) ERC721("MyNFT", "MNFT") {
        console.log("ERC721 Token symbol: ", symbol);    
        console.log("msg.sender: ", msg.sender);    
    }

}
 