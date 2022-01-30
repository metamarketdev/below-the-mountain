export const userPrefs = {
  namespaced: true,

  state() {
    return {
      hasSeenWelcomeModal: false,
    };
  },

  mutations: {
    setHasSeenWelcomeModal(state) {
      state.hasSeenWelcomeModal = true;
    },
  },
};
