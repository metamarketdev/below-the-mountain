<template>
  <div class="flex flex-row items-center">
    <template v-if="!isConnected || !isAuthenticated">
      <button
        @click="login()"
        class="bg-sky-800 hover:bg-sky-700 text-gray-200 rounded px-2 py-1 cursor-pointer"
      >
        <i class="fa-solid fa-plug text-white mr-1"></i>
        Connect wallet
      </button>
    </template>

    <template v-if="$store.getters.isWrongNetwork">
      <button
        class="text-gray-800 px-2 py-1 mr-1 rounded bg-red-800 bg-opacity-80 hover:bg-opacity-100"
        @click="$store.dispatch('switchToCorrectNetwork')"
      >
        <i class="fa-solid fa-bolt text-gray-800 mr-1"></i>
        Wrong network
      </button>
    </template>

    <template v-else-if="isConnected && isAuthenticated">
      <!-- <ThemeToggle class="mr-2" /> -->
      <div v-if="!$store.state.loadingBalances" class="mr-2">
        {{ $store.getters.displayGold }} gold
      </div>

      <div v-if="!$store.state.loadingBalances" class="mr-2">
        {{ $store.getters.displayBalance }} AVAX
      </div>

      <UserPopover @logOut="logout" @openAvatarModal="openAvatarModal" />
    </template>

    <Modal :open="showAvatarModal" @close="showAvatarModal = false" @open="loadNfts">
      <template v-slot:title>Pick your swag</template>
      <template v-slot:description>Living underground doesn't mean you can't be stylish.</template>

      <div v-if="isLoadingAvatars">Loading...</div>

      <template v-else>
        <div v-if="avatars.length === 0">No NFTs found. Sorry!</div>
        <div v-else>
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
import { mapState, mapActions, mapGetters } from 'vuex';
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

  mounted() {
    // this.handleCurrentUser();
  },

  computed: {
    ...mapState(['user', 'userAttributes']),
    ...mapGetters(['isConnected', 'isAuthenticated', 'isWrongNetwork']),
  },

  methods: {
    ...mapActions(['login', 'logout']),

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
};
</script>
