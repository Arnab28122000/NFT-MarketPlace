require("@nomiclabs/hardhat-waffle");
const dotenv = require('dotenv');
dotenv.config();

// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });



module.exports = {
  networks : {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.projectIdTestNet}`,
      accounts: [process.env.privateKey]
    },
    mainnet: {
      url : `https://mainnet.infura.io/v3/${process.env.projectIdMainNet}`,
      accounts: [process.env.privateKey]
    }
  },
  solidity: "0.8.4",
};
