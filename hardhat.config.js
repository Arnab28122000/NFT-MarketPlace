require("@nomiclabs/hardhat-waffle");
require('dotenv').config()

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
      url: `https://polygon-mumbai.infura.io/v3/5459db9fd30c41159ea3f18f548f62fe`,
      accounts: [process.env.privateKey]
    },
    mainnet: {
      url : `https://mainnet.infura.io/v3/${process.env.projectIdMainNet}`,
      accounts: [process.env.privateKey]
    }
  },
  solidity: "0.8.4",
};
