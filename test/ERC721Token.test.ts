import { expect } from "chai";
import hre from "hardhat";
import { ethers } from "hardhat";

describe("ERC721Token", function () {
  it("should return correct name and symbol", async function () {
    const ERC721Contract = await ethers.getContractFactory("ERC721Token");

    const ERC721ContractDeployed = await ERC721Contract.deploy("MyNFT", "MNFT"); // deploying the contract


    expect(await ERC721ContractDeployed.name()).to.equal("MyNFT");
    expect(await ERC721ContractDeployed.symbol()).to.equal("MNFT");
  });
});
