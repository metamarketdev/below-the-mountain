import { createStore } from 'vuex';
import Moralis from '../plugins/moralis';
import contracts from '../contracts';

const CHAIN_NAME = 'avalanche testnet';
const NFT_TABLE = 'AvaxNFTOwners';
const NFT_TABLE_PENDING = 'AvaxNFTOwnersPending';

async function queryNfts(table, ownerAddress, contract) {
  // console.log('Fetching:', table, ownerAddress, contractAddress);
  const query = new Moralis.Query(table);
  query.equalTo('owner_of', ownerAddress);
  query.equalTo('token_address', contract.address.toLowerCase());
  const result = await query.find();
  console.log('Fetched', result.length, 'entries', result);
  return result;
}

const store = createStore({
  state() {
    return {
      user: {},
      userAttributes: {},
      avatar: null,

      loadingGold: true,
      gold: 0,

      loadingItems: true,

      items: [],
      pendingItems: [],

      tools: [],
      pendingTools: [],
    };
  },

  actions: {
    loadPlayerData({ dispatch }) {
      dispatch('loadGold');
      dispatch('loadItems');
    },

    async loadGold({ state, commit, dispatch }) {
      // TODO: figure out most efficient way
      // TODO: try covalent to get token amount?

      const options = {
        chain: CHAIN_NAME,
        address: state.userAttributes.ethAddress,
      };

      const tokens = await Moralis.Web3API.account.getTokenBalances(options);

      const goldToken = tokens.find(
        ({ token_address }) => token_address === contracts.gold.address.toLowerCase(),
      );

      commit('setGold', goldToken.balance / 10 ** 18);

      // const query = new Moralis.Query('AvaxTokenBalance');
      // query.equalTo('address', state.userAttributes.ethAddress);
      // query.equalTo('token_address', contracts.gold.address);
      // const result = await query.find();
      // console.log(result);
      // console.timeEnd('query balance');

      setTimeout(() => {
        dispatch('loadGold');
      }, 5000);
    },

    async loadItems({ state, commit, dispatch }) {
      commit('setLoadingItems', true);
      console.log('Contracts', contracts);
      const items = await queryNfts(NFT_TABLE, state.userAttributes.ethAddress, contracts.items);

      commit('setItems', items);
      const pendingItems = await queryNfts(
        NFT_TABLE_PENDING,
        state.userAttributes.ethAddress,
        contracts.items,
      );
      commit('setPendingItems', pendingItems);

      const tools = await queryNfts(NFT_TABLE, state.userAttributes.ethAddress, contracts.tools);
      commit('setTools', tools);

      const pendingTools = await queryNfts(
        NFT_TABLE_PENDING,
        state.userAttributes.ethAddress,
        contracts.tools,
      );
      commit('setPendingTools', pendingTools);

      commit('setLoadingItems', false);
    },
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload;
      state.userAttributes = payload.attributes;
      state.avatar = payload.attributes.avatar;
    },

    setLoadingItems(state, payload) {
      state.loadingItems = payload;
    },

    setGold(state, payload) {
      state.gold = payload;
    },

    setItems(state, payload) {
      state.items = payload;
    },

    setPendingItems(state, payload) {
      state.pendingItems = payload;
    },

    setTools(state, payload) {
      state.tools = payload;
    },

    setPendingTools(state, payload) {
      state.pendingTools = payload;
    },
  },

  getters: {
    isConnected: (state) => !!state.currentChainId,

    isWrongNetwork: (state, getters) =>
      !!state.user && state.currentChainId !== state.networkConfig.chainId,

    isCorrectNetwork: (state, getters) =>
      !!state.user && state.currentChainId === state.networkConfig.chainId,

    displayAddress: (state) => {
      const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

      const truncateEthAddress = (address) => {
        const match = address.match(truncateRegex);
        if (!match) return address;
        return `${match[1]}…${match[2]}`;
      };

      return truncateEthAddress(state.user.attributes.ethAddress);
    },
  },
});

export default store;
