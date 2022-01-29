/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');
require('hardhat-abi-exporter');
// require('hardhat-deploy');
require('hardhat-contract-sizer');
require('@nomiclabs/hardhat-etherscan');
require('hardhat-gas-reporter');

let networks = require('./networks.js');
let secret = require('./secret');

module.exports = {
  // contractSizer: {
  //   // alphaSort: true,
  //   disambiguatePaths: false,
  //   runOnCompile: true,
  //   strict: true,
  //   // only: [':ERC20$'],
  // },
  gasReporter: {
    coinmarketcap: '0a625fd3-6a63-49c5-8af4-ec39d2d4eed9',
    currency: 'USD',
    gasPrice: 50,
    url: 'hardhat',
    excludeContracts: ['VRFCoordinatorMock', 'LinkToken'],
  },

  etherscan: {
    apiKey: {
      avalanche: secret.etherscan.avax,
      avalancheFujiTestnet: secret.etherscan.avax,
    },
  },
  solidity: {
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
    compilers: [
      // {
      //   version: "0.7.9",
      // },
      {
        version: '0.7.6',
      },
      {
        version: '0.6.6',
      },
      {
        version: '0.8.0',
      },
      {
        version: '0.4.24',
      },
      // {
      //   version: '0.4.8',
      // },
      {
        version: '0.4.11',
      },
    ],
  },
  abiExporter: {
    // runOnCompile: true,
    path: './abi',
    clear: true,
    flat: true,
    // only: [":ERC20$"],
    spacing: 2,
  },
  defaultNetwork: 'hardhat',
  networks: {
    mainnet: {
      chainId: networks.eth.chainId,
      url: networks.eth.rpc,
      accounts: [secret.key],
    },
    avax: {
      chainId: networks.avax.chainId,
      url: networks.avax.rpc,
      accounts: [secret.prodKey],
    },
    fuji: {
      chainId: networks.fuji.chainId,
      url: networks.fuji.rpc,
      accounts: [secret.key],
    },
    polygon: {
      chainId: networks.polygon.chainId,
      url: networks.polygon.rpc,
      accounts: [secret.key],
    },
    mumbai: {
      chainId: networks.mumbai.chainId,
      url: networks.mumbai.rpc,
      accounts: [secret.key],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    rinkeby: {
      chainId: networks.rinkeby.chainId,
      url: networks.rinkeby.rpc,
      accounts: [secret.key],
    },
    kovan: {
      chainId: networks.kovan.chainId,
      url: networks.kovan.rpc,
      accounts: [secret.key],
    },
    goerli: {
      chainId: networks.goerli.chainId,
      url: networks.goerli.rpc,
      accounts: [secret.key],
    },
    moonbeam: {
      chainId: networks.moonbeam.chainId,
      url: networks.moonbeam.rpc,
      accounts: [secret.prodKey],
    },
    moonbase: {
      chainId: networks.moonbase.chainId,
      url: networks.moonbase.rpc,
      accounts: [secret.key],
    },
    moonriver: {
      chainId: networks.moonriver.chainId,
      url: networks.moonriver.rpc,
      accounts: [secret.key],
    },
    localhost: {},
    hardhat: {
      gas: 'auto',
      // gasPrice: 875000000,
      // gasMultiplier: 1000,
      // forking: {
      //   url: "https://speedy-nodes-nyc.moralis.io/e6649e9bba6f002afa7a5e88/polygon/mumbai",
      //   accounts: [secret.key],
      // },
    },
  },
};
