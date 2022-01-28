import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      user: {},
      userAttributes: {},
      avatar: null,
    };
  },

  mutations: {
    setUser(state, payload) {
      state.user = payload;
      state.userAttributes = payload.attributes;
      state.avatar = payload.attributes.avatar;
    },
  },

  getters: {
    isConnected: (state) => !!state.currentChainId,

    isWrongNetwork: (state, getters) => !!state.user && state.currentChainId !== state.networkConfig.chainId,

    isCorrectNetwork: (state, getters) => !!state.user && state.currentChainId === state.networkConfig.chainId,

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
