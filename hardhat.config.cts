import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import dotenv from "dotenv";
import "solidity-coverage";

dotenv.config();
const METAMASK_PRIVATE_KEY = "0x" + process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.26",

  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [METAMASK_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
