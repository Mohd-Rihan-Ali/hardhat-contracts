import { expect } from "chai";
import { ethers } from "hardhat";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ERC20Token } from "../typechain-types";
import { Typed, AddressLike } from "ethers";

describe("ERC20Token", function () {
  let ERC20TokenFactory: any;
  let erc20Token: ERC20Token;
  let owner: any;
  let addr1: any;
  let addr2: any;

  const initialSupply = ethers.parseEther("1000");

  beforeEach(async function () {
    ERC20TokenFactory = await ethers.getContractFactory("ERC20Token");
    [owner, addr1, addr2] = await ethers.getSigners();

    erc20Token = await ERC20TokenFactory.deploy(initialSupply);
  });

  it("Should have the correct name and symbol", async function () {
    expect(await erc20Token.name()).to.equal("MyERC20Token");
    expect(await erc20Token.symbol()).to.equal("MERC20");
  });

  it("Should assign the initial supply to the owner", async function () {
    const ownerBalance = await erc20Token.balanceOf(owner.address);
    expect(await erc20Token.totalSupply()).to.equal(ownerBalance);
  });

  it("Should emit Approval event on successful approval", async function () {
    await expect(erc20Token.approve(addr1.address, ethers.parseEther("100")))
      .emit(erc20Token, "Approval")
      .withArgs(owner.address, addr1.address, ethers.parseEther("100"));
  });

  it("Should emit Transfer event on successful transfer", async function () {
    await expect(erc20Token.transfer(addr1.address, ethers.parseEther("100")))
      .emit(erc20Token, "Transfer")
      .withArgs(owner.address, addr1.address, ethers.parseEther("100"));
  });

  it("Should transfer tokens between accounts", async function () {
    await erc20Token.transfer(addr1.address, ethers.parseEther("50"));
    const addr1Balance = await erc20Token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("50"));

    await erc20Token
      .connect(addr1)
      .transfer(addr2.address, ethers.parseEther("50"));
    const addr2Balance = await erc20Token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(ethers.parseEther("50"));
  });

  it("Should fail if sender doesn't have enough tokens", async function () {
    const initialOwnerBalance = await erc20Token.balanceOf(owner.address);

    await expect(
      erc20Token.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
    ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

    expect(await erc20Token.balanceOf(owner.address)).to.equal(
      initialOwnerBalance
    );
  });

  it("Should update balances after transfers", async function () {
    const initialOwnerBalance = await erc20Token.balanceOf(owner.address);

    await erc20Token.transfer(addr1.address, ethers.parseEther("100"));

    await erc20Token.transfer(addr2.address, ethers.parseEther("50"));

    const finalOwnerBalance = await erc20Token.balanceOf(owner.address);
    expect(finalOwnerBalance).to.equal(ethers.parseEther("850"));

    const addr1Balance = await erc20Token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("100"));

    const addr2Balance = await erc20Token.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(ethers.parseEther("50"));
  });

  it("Should allow the owner to mint new tokens", async function () {
    await erc20Token.mint(owner.address, ethers.parseEther("1000"));
    expect(await erc20Token.totalSupply()).to.equal(ethers.parseEther("2000"));
  });
});
