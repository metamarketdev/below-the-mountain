<template>
  <div class="flex flex-row items-center">
    <template v-if="isAuthenticated">
      <!-- <ThemeToggle class="mr-2" /> -->
      <div class="mr-2">{{ $store.getters.displayGold }} gold</div>

      <UserPopover v-if="isAuthenticated" @logOut="logout" @openAvatarModal="openAvatarModal" />
    </template>

    <template v-else>
      <button @click="login">Connect wallet</button>
    </template>

    <Modal :open="showAvatarModal" @close="showAvatarModal = false" @open="loadNfts">
      <template v-slot:title>Pick your swag</template>

      <div v-if="isLoadingAvatars">Loading...</div>

      <template v-else>
        <div v-if="avatars.length === 0">No NFTs found. Sorry!</div>
        <div v-else class="w-screen max-w-xl">
          {{ token }}
          <button
            v-for="(token, i) in avatars"
            :key="i"
            class="inline-block w-20 h-20 bg-cover bg-center rounded-md"
            :style="`background:url(${JSON.parse(token.metadata).image})`"
            @click="selectAvatar(token)"
          ></button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted, inject, computed } from 'vue';
import UserPopover from './UserPopover.vue';
import ThemeToggle from './ThemeToggle.vue';
import Moralis from '../plugins/moralis';

export default {
  components: {
    UserPopover,
    ThemeToggle,
  },

  data() {
    return {
      showAvatarModal: false,
      isLoadingAvatars: false,
      avatarChains: ['eth', 'bsc', 'polygon', 'avalanche'],
      avatars: [],
    };
  },

  methods: {
    openAvatarModal() {
      this.showAvatarModal = true;
      this.loadNfts();
    },

    async loadNfts() {
      this.isLoadingAvatars = true;
      const promises = this.avatarChains.map((chain) =>
        Moralis.Web3API.account.getNFTs({ chain, address: this.user.attributes.ethAddress }),
      );

      const nftResults = await Promise.all(promises);
      let avatars = [];

      nftResults.forEach((chainResult) => {
        avatars = [...avatars, ...chainResult.result];
      });

      avatars = avatars.filter((nft) => nft.is_valid);

      console.log('Loaded avatars', avatars);

      this.avatars = avatars;
      this.isLoadingAvatars = false;
    },

    async selectAvatar(token) {
      const user = await Moralis.User.current();
      user.set('avatar', JSON.parse(token.metadata).image);
      let newUser = await user.save();
      this.$store.commit('setUser', newUser);
      this.showAvatarModal = false;
    },
  },

  setup() {
    const store = useStore();
    // const $moralis = inject('$moralis');
    const setUser = (payload) => store.commit('setUser', payload);
    const loadPlayerData = () => store.dispatch('loadPlayerData');

    const login = async () => {
      const user = await Moralis.Web3.authenticate({
        signingMessage: 'Below The Mountain authentication',
      });
      setUser(user);
      loadPlayerData();
    };

    const logout = async () => {
      await Moralis.User.logOut();
      setUser({});
    };

    const handleCurrentUser = () => {
      const user = Moralis.User.current();
      if (user) {
        setUser(user);
        loadPlayerData();
      }
    };

    onMounted(() => {
      handleCurrentUser();
    });

    return {
      login,
      logout,
      isAuthenticated: computed(() => Object.keys(store.state.user).length > 0),
      user: computed(() => store.state.user),
    };
  },
};
</script>

<style></style>
