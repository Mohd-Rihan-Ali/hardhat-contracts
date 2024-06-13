import { expect } from "chai";
import hre from "hardhat";
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

    // await erc721Token.deployed();
  });

  it("Should return correct name and symbol", async function () {
    expect(await erc721Token.name()).to.equal("MyNFT");
    expect(await erc721Token.symbol()).to.equal("MNFT");
  });

  it("Shoudl assign the correct owner", async function () {
    expect(await erc721Token.owner()).to.equal(owner.address);
  });

  it("Should mint a new token only by the owner", async function () {
    await erc721Token.mint(owner.address, 1);
    expect(await erc721Token.ownerOf(1)).to.equal(owner.address);
  });

  it("Should transfer a token from one owner to another", async function () {
    await erc721Token.mint(owner.address, 1);
    await erc721Token.transferFrom(owner.address, addr1.address, 1);

    expect(await erc721Token.ownerOf(1)).to.equal(addr1.address);
  });

  it("Should fail to transfer a token if not the owner", async function () {
    await erc721Token.mint(owner.address, 1);
    await expect(
      erc721Token.connect(addr1).transferFrom(owner.address, addr2.address, 1)
    ).to.be.revertedWith("ERC721: transfer caller is not the owner");
  });

  it("Should approve and then transfer a token", async function () {
    await erc721Token.mint(owner.address, 1);
    await erc721Token.approve(addr1.address, 1);
    await erc721Token
      .connect(addr1)
      .transferFrom(owner.address, addr2.address, 1);

    expect(await erc721Token.ownerOf(1)).to.equal(addr2.address);
  });

  it("Should emit Transfer event on mint", async function () {
    await expect(erc721Token.mint(owner.address, 1))
      .to.emit(erc721Token, "Transfer")
      .withArgs(ethers.ZeroAddress, owner.address, 1);
  });

  it("Should emit Approval event on approve", async function () {
    await erc721Token.mint(owner.address, 1);
    await expect(erc721Token.approve(addr1.address, 1))
      .to.emit(erc721Token, "Approval")
      .withArgs(owner.address, addr1.address, 1);
  });

  it("Should emit Transfer event on transfer", async function () {
    await erc721Token.mint(owner.address, 1);
    await expect(erc721Token.transferFrom(owner.address, addr1.address, 1))
      .to.emit(erc721Token, "Transfer")
      .withArgs(owner.address, addr1.address, 1);
  });

  // it("Should burn a token", async function () {
  //   await erc721Token.mint(owner.address, 1);
  //   await erc721Token.burn(1);

  //   expect(await erc721Token.ownerOf(1)).to.be.revertedWith(
  //     "ERC721: owner query for nonexistent token"
  //   );
  // });
});
