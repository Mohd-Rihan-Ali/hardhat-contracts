import { expect } from "chai";
import { ethers } from "hardhat";
import { ERC20Token } from "../typechain-types";

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

  describe("Deployment", function () {
    it("Should have the correct name and symbol", async function () {
      expect(await erc20Token.name()).to.equal("MyERC20Token");
      expect(await erc20Token.symbol()).to.equal("MERC20");
    });

    it("Should assign the initial supply to the owner", async function () {
      const ownerBalance = await erc20Token.balanceOf(owner.address);
      expect(await erc20Token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should emit Approval event on successful approval", async function () {
      const amt = ethers.parseEther("100");

      await expect(erc20Token.approve(addr1.address, amt))
        .emit(erc20Token, "Approval")
        .withArgs(owner.address, addr1.address, amt);
    });

    it("Should emit Transfer event on successful transfer", async function () {
      const amt = ethers.parseEther("100");

      await expect(erc20Token.transfer(addr1.address, amt))
        .emit(erc20Token, "Transfer")
        .withArgs(owner.address, addr1.address, amt);
    });

    it("Should transfer tokens between accounts", async function () {
      const amtAddr1 = ethers.parseEther("100");
      const amtAddr2 = ethers.parseEther("50");

      await erc20Token.transfer(addr1.address, amtAddr1);
      expect(await erc20Token.balanceOf(addr1.address)).to.equal(amtAddr1);

      await erc20Token.connect(addr1).transfer(addr2.address, amtAddr2);
      expect(await erc20Token.balanceOf(addr2.address)).to.equal(amtAddr2);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await erc20Token.balanceOf(owner.address);
      const amtAddr1 = ethers.parseEther("100");
      const amtAddr2 = ethers.parseEther("50");

      await erc20Token.transfer(addr1.address, amtAddr1);
      await erc20Token.transfer(addr2.address, amtAddr2);

      expect(await erc20Token.balanceOf(owner.address)).to.equal(
        initialOwnerBalance - amtAddr1 - amtAddr2
      );

      expect(await erc20Token.balanceOf(addr1.address)).to.equal(amtAddr1);

      expect(await erc20Token.balanceOf(addr2.address)).to.equal(amtAddr2);
    });
  });

  describe("Minting", function () {
    it("Should allow the owner to mint new tokens", async function () {
      const mintAmount = ethers.parseEther("1000");

      await erc20Token.mint(owner.address, mintAmount);
      expect(await erc20Token.totalSupply()).to.equal(
        initialSupply + mintAmount
      );
    });
  });
});
