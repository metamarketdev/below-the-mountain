import { createStore } from 'vuex';
import Moralis from '../plugins/moralis';
import contracts from '../contracts';
import _ from 'lodash';
import createPersistedState from 'vuex-persistedstate';
import { userPrefs } from './userPrefs';

const CHAIN_NAME = 'avalanche testnet';
const NFT_TABLE = 'AvaxNFTOwners';
const NFT_TABLE_PENDING = 'AvaxNFTOwnersPending';

const userPrefsPlugin = createPersistedState({
  paths: ['userPrefs'],
});

const store = createStore({
  plugins: [userPrefsPlugin],

  modules: {
    userPrefs,
  },

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
      // IMPROVEMENT: figure out most efficient way

      const options = {
        chain: CHAIN_NAME,
        address: state.userAttributes.ethAddress,
      };

      const tokens = await Moralis.Web3API.account.getTokenBalances(options);

      const goldToken = tokens.find(
        ({ token_address }) => token_address === contracts.gold.address.toLowerCase(),
      );

      commit('setGold', goldToken.balance / 10 ** 18);
      commit('setLoadingGold', false);

      setTimeout(() => {
        dispatch('loadGold');
      }, 7500);
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
        commit('createItem', { msg, destination });
      });
      subscription.on('delete', (msg) => {
        commit('deleteItem', { msg, destination });
      });
      subscription.on('update', (msg) => {
        commit('updateItem', { msg, destination });
      });

      subscriptionPending.on('create', (msg) => {
        commit('createPendingItem', { msg, destination });
      });
      subscriptionPending.on('delete', (msg) => {
        commit('deletePendingItem', { msg, destination });
      });
      subscriptionPending.on('update', (msg) => {
        commit('updatePendingItem', { msg, destination });
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

    setLoadingGold(state, payload) {
      state.loadingGold = payload;
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
      // Prioritize pending items to better update amounts of ERC1155
      const allItems = [
        ...state.pending.items.map((tool) => {
          tool.isPending = true;
          return tool;
        }),
        ...state.confirmed.items,
      ];

      return _(allItems).uniqBy('attributes.token_id').orderBy('createdAt');
    },

    allTools: (state) => {
      // Prioritize confirmed items
      const allTools = [
        ...state.confirmed.tools,
        ...state.pending.tools.map((tool) => {
          tool.isPending = true;
          return tool;
        }),
      ];

      return _(allTools).uniqBy('attributes.token_id').orderBy('createdAt');
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

    displayGold: (state) => {
      return Math.floor(state.gold);
    },
  },
});

export default store;
