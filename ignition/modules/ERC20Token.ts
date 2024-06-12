import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

module.exports = buildModule("ERC20TokenModule", (m) => {
  const ERC20TokenContract = m.contract("ERC20Token", [100]);

  return { ERC20TokenContract };
});

// export default LockModule;
