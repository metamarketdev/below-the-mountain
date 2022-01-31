import { createStore } from 'vuex';
import Moralis from '../plugins/moralis';
import contracts from '../contracts';
import _ from 'lodash';
import { callMethod } from '../contracts';

const CHAIN_NAME = 'avalanche testnet';
const CHAIN_ID = '0xa869';
const NFT_TABLE = 'AvaxNFTOwners';
const NFT_TABLE_PENDING = 'AvaxNFTOwnersPending';

const store = createStore({
  state() {
    return {
      currentChainId: null,
      missingWeb3: false,

      loadingUser: true,
      user: {},
      userAttributes: {},
      avatar: null,

      loadingBalances: true,
      balance: 0,
      gold: 0,

      loadingItems: true,

      loadingRecipes: true,
      recipes: [],

      confirmed: {
        items: [],
        tools: [],
        claims: [],
      },

      pending: {
        items: [],
        tools: [],
        claims: [],
      },
    };
  },

  actions: {
    loadPlayerData({ dispatch }) {
      dispatch('loadBalances');
      dispatch('loadItems');
    },

    async loadRecipes({ state, commit, dispatch }) {
      let numRecipes = await callMethod('crafting', 'numRecipes');
      numRecipes = numRecipes.toNumber();

      let recipes = [];

      for (let i = 1; i <= numRecipes; i++) {
        let recipe = await callMethod('crafting', '_recipeDetails', { recipeId: i });

        let tokenType;

        if (recipe.outputTokenType === 0) {
          tokenType = await callMethod('items', '_itemDetails', {
            itemId: recipe.outputTokenId,
          });
        } else if (recipe.outputTokenType === 1) {
          tokenType = await callMethod('tools', '_toolTypes', {
            toolTypeId: recipe.outputTokenId,
          });
        }

        // IMPROVEMENT: make this more future-proof
        if (recipe.enabled) {
          recipe = {
            ...recipe,
            inputAmount: recipe.inputAmount.toNumber(),
            inputTokenId: recipe.inputTokenId.toString(),
            outputTokenType: tokenType,
          };

          recipes.push(recipe);
        }
      }

      commit('setRecipes', recipes);
      commit('setLoadingRecipes', false);
    },

    async loadBalances({ state, commit, dispatch }) {
      // IMPROVEMENT: use DB live query instead

      const options = {
        chain: CHAIN_NAME,
        address: state.userAttributes.ethAddress,
      };

      const native = await Moralis.Web3API.account.getNativeBalance(options);
      const tokens = await Moralis.Web3API.account.getTokenBalances(options);

      const goldToken = tokens.find(
        ({ token_address }) => token_address === contracts.gold.address.toLowerCase(),
      );

      commit('setGold', goldToken ? goldToken.balance / 10 ** 18 : 0);
      commit('setNativeBalance', native.balance / 10 ** 18);
      commit('setLoadingBalances', false);

      setTimeout(() => {
        dispatch('loadBalances');
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

      await dispatch('fetchUserTokens', {
        contractAddress: contracts.claims.address,
        destination: 'claims',
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

    async initUser({ state, commit, dispatch, getters }) {
      console.log('initUser');

      Moralis.onWeb3Enabled(async (result) => {
        console.log('onWeb3Enabled', result);
        commit('setCurrentChainId', result.chainId);
        commit('setMissingWeb3', false);
      });

      Moralis.onChainChanged(async (chain) => {
        console.log('onChainChanged', chain);
        commit('setCurrentChainId', chain);
      });

      Moralis.onWeb3Deactivated((result) => {
        console.log('onWeb3Deactivated', result);
        commit('setCurrentChainId', null);
      });

      Moralis.onAccountChanged(async (chain) => {
        console.log('onAccountChanged', chain);
        if (!chain) {
          commit('setCurrentChainId', null);
        }
      });

      try {
        await Moralis.enableWeb3();
        dispatch('getCurrentUser');
      } catch (err) {
        commit('setMissingWeb3', true);
      }
    },

    getCurrentUser({ state, commit, dispatch }) {
      const user = Moralis.User.current();
      console.log('getCurrentUser', user);

      if (user) {
        commit('setLoadingUser', false);
        commit('setUser', user);
        dispatch('loadPlayerData');
      } else {
        dispatch('login');
      }
    },

    async login({ state, commit, dispatch }) {
      console.log('login');

      const user = await Moralis.Web3.authenticate({
        signingMessage: 'BelowTheMountain.io - Authentication',
      });

      commit('setUser', user);
      dispatch('loadPlayerData');
    },

    async logout({ state, commit }) {
      console.log('logout');
      await Moralis.User.logOut();
      commit('setUser', {});
    },

    async addCorrectNetwork() {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: CHAIN_ID,
            chainName: 'Avalanche TESTNET',
            rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
            blockExplorerUrls: ['https://testnet.snowtrace.io/'],
            nativeCurrency: {
              name: 'AVAX',
              symbol: 'AVAX',
              decimals: 18,
            },
          },
        ],
      });
    },

    async switchToCorrectNetwork({ dispatch }) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: CHAIN_ID }],
        });
      } catch (err) {
        await dispatch('addCorrectNetwork');
      }
    },
  },

  mutations: {
    setCurrentChainId(state, chainId) {
      state.currentChainId = chainId;
    },

    setRecipes(state, payload) {
      state.recipes = payload;
    },

    setLoadingRecipes(state, payload) {
      state.loadingRecipes = payload;
    },

    setLoadingUser(state, payload) {
      state.loadingUser = payload;
    },

    setMissingWeb3(state, payload) {
      state.setMissingWeb3 = payload;
    },

    setUser(state, user) {
      state.user = user;

      if (user.attributes) {
        state.userAttributes = user.attributes;
        state.avatar = user.attributes.avatar;
      }
    },

    setLoadingItems(state, payload) {
      state.loadingItems = payload;
    },

    setLoadingBalances(state, payload) {
      state.loadingBalances = payload;
    },

    setNativeBalance(state, payload) {
      state.balance = payload;
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

      return _(allItems).uniqBy('attributes.token_id').orderBy('attributes.token_id').value();
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

      return _(allTools).uniqBy('attributes.token_id').orderBy('attributes.token_id').value();
    },

    allClaims: (state) => {
      // Prioritize pending items to better update amounts of ERC1155
      const allClaims = [
        ...state.pending.claims.map((claim) => {
          claim.isPending = true;
          return claim;
        }),
        ...state.confirmed.claims,
      ];

      return _(allClaims).uniqBy('attributes.token_id').orderBy('attributes.token_id').value();
    },

    isConnected: (state) => !!state.currentChainId,

    isAuthenticated: (state) => state.user && !!state.user.id,

    isWrongNetwork: (state, getters) => getters.isConnected && state.currentChainId !== CHAIN_ID,

    isCorrectNetwork: (state, getters) => !getters.isWrongNetwork,

    displayAddress: (state) => {
      const truncateRegex = /^(0x[a-zA-Z0-9]{2})[a-zA-Z0-9]+([a-zA-Z0-9]{3})$/;

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

    displayBalance: (state) => {
      return Math.floor(state.balance * 100) / 100;
    },
  },
});

export default store;
