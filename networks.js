module.exports = {
  hardhat: {
    chainId: 0,
    rpc: '',
    linkToken: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    coordinator: '0x8C7382F9D8f56b33781fE506E897a4F1e2d17255',
    keyHash: '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4',
    childChainManagerProxy: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa', // Not used
    fee: '100000000000000000',
  },

  eth: {
    chainId: 1,
    rpc: 'https://speedy-nodes-nyc.moralis.io/e6649e9bba6f002afa7a5e88/eth/mainnet',
    linkToken: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    coordinator: '0x8C7382F9D8f56b33781fE506E897a4F1e2d17255',
    keyHash: '0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4',
    fee: '2000000000000000000',
    isRoot: true,
  },

  rinkeby: {
    chainId: 4,
    rpc: 'https://speedy-nodes-nyc.moralis.io/e6649e9bba6f002afa7a5e88/eth/rinkeby',
    linkToken: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    coordinator: '0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B',
    keyHash: '0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311',
    fee: '100000000000000000',
    isRoot: true,
  },

  goerli: {
    chainId: 5,
    rpc: 'https://speedy-nodes-nyc.moralis.io/e6649e9bba6f002afa7a5e88/eth/goerli',
    linkToken: '0x326c977e6efc84e512bb9c30f76e30c160ed06fb',
    coordinator: '0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B', // ?
    keyHash: '0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311', // ?
    fee: '100000000000000000', // ?
    isRoot: true,
    // predicate : 0x37c3bfC05d5ebF9EBb3FF80ce0bd0133Bf221BC8
  },

  kovan: {
    chainId: 42,
    rpc: 'https://speedy-nodes-nyc.moralis.io/e6649e9bba6f002afa7a5e88/eth/kovan',
    linkToken: '0xa36085F69e2889c224210F603D836748e7dC0088',
    coordinator: '0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9',
    keyHash: '0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4',
    fee: '100000000000000000',
  },

  avax: {
    chainId: 43114,
    rpc: 'https://speedy-nodes-nyc.moralis.io/e6649e9bba6f002afa7a5e88/avalanche/mainnet',
  },

  fuji: {
    chainId: 43113,
    rpc: 'https://speedy-nodes-nyc.moralis.io/e6649e9bba6f002afa7a5e88/avalanche/testnet',
  },

  moonbeam: {
    chainId: 1284,
    rpc: 'https://rpc.api.moonbeam.network',
  },

  moonbase: {
    chainId: 1287,
    rpc: 'https://rpc.api.moonbase.moonbeam.network',
  },

  moonriver: {
    chainId: 1285,
    rpc: 'https://rpc.moonriver.moonbeam.network',
  },

  polygon: {
    moralisServerUrl: null, // TODO:
    moralisAppId: null, // TODO:
    chainId: 137,
    rpc: 'https://speedy-nodes-nyc.moralis.io/e6649e9bba6f002afa7a5e88/polygon/mainnet',
    linkToken: '0xb0897686c545045aFc77CF20eC7A532E3120E0F1',
    coordinator: '0x3d2341ADb2D31f1c5530cDC622016af293177AE0',
    keyHash: '0xf86195cf7690c55907b2b611ebb7343a6f649bff128701cc542f0569e2c549da',
    fee: '100000000000000',
    childChainManagerProxy: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    paymentTokens: [
      {
        label: 'DAI',
        mintPrice: '100000000000000000',
        address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', // DAI
      },
      {
        label: 'USDC',
        mintPrice: '100000',
        address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174', // USDC
      },
      {
        label: 'USDT',
        mintPrice: '100000',
        address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT
      },
      {
        label: 'UST',
        mintPrice: '100000000000000000',
        address: '0x692597b009d13c4049a947cab2239b7d6517875f', // UST
      },
    ],
  },

  mumbai: {
    moralisServerUrl: 'https://hyebggaw2v4t.usemoralis.com:2053/server',
    moralisAppId: '5Ttx6h1EwHwWTZeuPH9mrgaNhHuJ6fjhySN0cVlm',
    chainId: 80001,
    rpc: 'https://speedy-nodes-nyc.moralis.io/e6649e9bba6f002afa7a5e88/polygon/mumbai',
    linkToken: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    coordinator: '0x8C7382F9D8f56b33781fE506E897a4F1e2d17255',
    keyHash: '0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4',
    fee: '100000000000000',
    childChainManagerProxy: '0xb5505a6d998549090530911180f38aC5130101c6',
    paymentTokens: [
      {
        label: 'DAI',
        mintPrice: '100000000000000000',
        decimals: 18,
        address: '0xcb1e72786a6eb3b44c2a2429e317c8a2462cfeb1',
      },
      // {
      //   label: 'Dummy ERC20',
      //   mintPrice: '10000000000000000',
      //   decimals: 18,
      //   address: '0xfe4f5145f6e09952a5ba9e956ed0c25e3fa4c7f1',
      // },
      // {
      //   label: 'USDC',
      //   mintPrice: '10000',
      //   decimals: 6,
      //   address: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
      // },
      // {
      //   label: 'USDT',
      //   mintPrice: '100000',
      //   decimals: 6,
      //   address: '0x3813e82e6f7098b9583fc0f33a962d02018b6803',
      // },
    ],
  },
};
