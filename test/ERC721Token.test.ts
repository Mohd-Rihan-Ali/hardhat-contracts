import { expect } from "chai";
import { ethers } from "hardhat";

describe("ERC721Token", function () {
  let ERC721Token: any;
  let erc721Token: any;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    const ERC721TokenFactory = await ethers.getContractFactory("ERC721Token");
    erc721Token = await ERC721TokenFactory.deploy("MyNFT", "MNFT");

    [owner, addr1, addr2] = await ethers.getSigners();
  });

  describe("Deployment", function () {
    it("Should return correct name and symbol", async function () {
      expect(await erc721Token.name()).to.equal("MyNFT");
      expect(await erc721Token.symbol()).to.equal("MNFT");
    });

    it("Should assign the correct owner", async function () {
      expect(await erc721Token.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a new token only by the owner and emit", async function () {
      await expect(erc721Token.mint(owner.address, 1))
        .to.emit(erc721Token, "Transfer")
        .withArgs(ethers.ZeroAddress, owner.address, 1);

      expect(await erc721Token.ownerOf(1)).to.equal(owner.address);
    });
  });

  describe("Transferring Tokens", function () {
    beforeEach(async function () {
      await erc721Token.mint(owner.address, 1);
    });

    it("Should emit Approval event on approve", async function () {
      await expect(erc721Token.approve(addr1.address, 1))
        .to.emit(erc721Token, "Approval")
        .withArgs(owner.address, addr1.address, 1);
    });

    it("Should transfer a token from one owner to another and emit the event", async function () {
      await expect(erc721Token.transferFrom(owner.address, addr1.address, 1))
        .to.emit(erc721Token, "Transfer")
        .withArgs(owner.address, addr1.address, 1);

      expect(await erc721Token.ownerOf(1)).to.equal(addr1.address);
    });

    it("Should approve and then transfer a token", async function () {
      await erc721Token.approve(addr1.address, 1);
      await erc721Token
        .connect(addr1)
        .transferFrom(owner.address, addr2.address, 1);

      expect(await erc721Token.ownerOf(1)).to.equal(addr2.address);
    });
  });
});
