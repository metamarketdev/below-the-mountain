import { createStore } from 'vuex';
import Moralis from '../plugins/moralis';
import contracts from '../contracts';
import _ from 'lodash';

const CHAIN_NAME = 'avalanche testnet';
const NFT_TABLE = 'AvaxNFTOwners';
const NFT_TABLE_PENDING = 'AvaxNFTOwnersPending';

const store = createStore({
  state() {
    return {
      user: {},
      userAttributes: {},
      avatar: null,

      loadingGold: true,
      gold: 0,

      loadingItems: true,

      confirmed: {
        items: [],
        tools: [],
      },

      pending: {
        items: [],
        tools: [],
      },
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

      await dispatch('fetchUserTokens', {
        contractAddress: contracts.items.address,
        destination: 'items',
      });

      await dispatch('fetchUserTokens', {
        contractAddress: contracts.tools.address,
        destination: 'tools',
      });

      commit('setLoadingItems', false);
    },

    async fetchUserTokens({ state, commit }, { contractAddress, destination }) {
      const query = new Moralis.Query(NFT_TABLE);
      query.equalTo('owner_of', state.userAttributes.ethAddress);
      query.equalTo('token_address', contractAddress.toLowerCase());
      const result = await query.find();
      const subscription = await query.subscribe();
      commit('setItems', { items: result, destination });

      const queryPending = new Moralis.Query(NFT_TABLE_PENDING);
      queryPending.equalTo('owner_of', state.userAttributes.ethAddress);
      queryPending.equalTo('token_address', contractAddress.toLowerCase());
      const resultPending = await queryPending.find();
      const subscriptionPending = await queryPending.subscribe();
      commit('setPendingItems', { items: resultPending, destination });

      subscription.on('create', (msg) => {
        // console.log('created pending', msg);
        // state.pendingGems.push(msg);
        commit('createItem', { msg, destination });
      });
      subscription.on('delete', (msg) => {
        commit('deleteItem', { msg, destination });
        // console.log('delete pending', msg);
        // state.pendingGems = state.pendingGems.filter(({ id }) => msg.id !== id);
      });
      subscription.on('update', (msg) => {
        commit('updateItem', { msg, destination });
        // console.log('updated pending', msg);
        // let old = state.pendingGems.find(({ id }) => msg.id === id);
        // old = msg;
      });

      subscriptionPending.on('create', (msg) => {
        // console.log('created pending', msg);
        // state.pendingGems.push(msg);
        commit('createPendingItem', { msg, destination });
      });
      subscriptionPending.on('delete', (msg) => {
        commit('deletePendingItem', { msg, destination });
        // console.log('delete pending', msg);
        // state.pendingGems = state.pendingGems.filter(({ id }) => msg.id !== id);
      });
      subscriptionPending.on('update', (msg) => {
        commit('updatePendingItem', { msg, destination });
        // console.log('updated pending', msg);
        // let old = state.pendingGems.find(({ id }) => msg.id === id);
        // old = msg;
      });
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

    setItems(state, { items, destination }) {
      state.confirmed[destination] = items;
    },

    setPendingItems(state, { items, destination }) {
      state.pending[destination] = items;
    },

    createItem(state, { msg, destination }) {
      state.confirmed[destination].push(msg);
    },

    deleteItem(state, { msg, destination }) {
      state.confirmed[destination] = state.confirmed[destination].filter(({ id }) => msg.id !== id);
    },

    updateItem(state, { msg, destination }) {
      let old = state.confirmed[destination].find(({ id }) => msg.id === id);
      old = msg;
    },

    createPendingItem(state, { msg, destination }) {
      state.pending[destination].push(msg);
    },

    deletePendingItem(state, { msg, destination }) {
      state.pending[destination] = state.pending[destination].filter(({ id }) => msg.id !== id);
    },

    updatePendingItem(state, { msg, destination }) {
      let old = state.pending[destination].find(({ id }) => msg.id === id);
      old = msg;
    },
  },

  getters: {
    allItems: (state) => {
      const allItems = [...state.confirmed.items, ...state.pending.items];
      return _.uniqBy(allItems, 'attributes.token_id');
    },

    allTools: (state) => {
      const allTools = [
        ...state.confirmed.tools,
        ...state.pending.tools.map((tool) => {
          tool.isPending = true;
          return tool;
        }),
      ];
      return _.uniqBy(allTools, 'attributes.token_id');
    },

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
