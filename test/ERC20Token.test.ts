import { expect } from "chai";
import { ethers } from "hardhat";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20Token } from "../typechain-types";
import { Typed, AddressLike } from "ethers";

describe("ERC20Token", function () {
  let ERC20TokenFactory: any;
  let erc20Token: ERC20Token;
  let owner: { address: Typed | AddressLike };
  let addr1: { address: Typed | AddressLike };
  let addr2: { address: Typed | AddressLike };
  const initialSupply = ethers.parseEther("1000");

  beforeEach(async function () {
    ERC20TokenFactory = await ethers.getContractFactory("ERC20Token");
    [owner, addr1, addr2] = await ethers.getSigners();

    erc20Token = (await ERC20TokenFactory.deploy(initialSupply)) as ERC20Token;
    // await erc20Token.deployed();
  });

  it("Should have the correct name and symbol", async function () {
    expect(await erc20Token.name()).to.equal("MyERC20Token");
    expect(await erc20Token.symbol()).to.equal("MERC20");
  });

  it("Should assign the initial supply to the owner", async function () {
    const ownerBalance = await erc20Token.balanceOf(owner.address);
    expect(await erc20Token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should transfer tokens between accounts", async function () {
    await erc20Token.transfer(addr1.address, ethers.parseEther("50"));
    const addr1Balance = await erc20Token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("50"));

    // await erc20Token.connect(addr1).transfer(addr2.address, ethers.parseEther("50"));
    // const addr2Balance = await erc20Token.balanceOf(addr2.address);
    // expect(addr2Balance).to.equal(ethers.parseEther("50"));
  });
});
