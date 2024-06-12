import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("ERC721TokenModule", (m) => {
  const ERC721Contract = m.contract("ERC721Token", ["MyNFT", "MNFT"]);

  return { ERC721Contract };
});

// export default LockModule;
