<template>
  <div class="flex flex-row items-center">
    <template v-if="isAuthenticated">
      <!-- <ThemeToggle class="mr-2" /> -->
      <UserPopover v-if="isAuthenticated" @logOut="logout" @openAvatarModal="openAvatarModal" />
    </template>

    <template v-else>
      <button @click="login">Connect wallet</button>
    </template>

    <Modal :open="showAvatarModal" @close="showAvatarModal = false" @open="loadNfts">
      <template v-slot:title>Pick your swag</template>

      <div class="w-screen max-w-xl">
        <button
          v-for="(token, i) in avatars"
          :key="i"
          class="inline-block w-20 h-20 bg-cover bg-center rounded-md"
          :style="`background:url(${JSON.parse(token.metadata).image})`"
          @click="selectAvatar(token)"
        ></button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { onMounted, inject, computed } from 'vue';
import Modal from './Modal.vue';
import UserPopover from './UserPopover.vue';
import ThemeToggle from './ThemeToggle.vue';
import Moralis from '../plugins/moralis';

export default {
  components: {
    Modal,
    UserPopover,
    ThemeToggle,
  },

  data() {
    return {
      showAvatarModal: false,
      avatars: [],
    };
  },
  methods: {
    openAvatarModal() {
      this.showAvatarModal = true;
      this.loadNfts();
    },

    async loadNfts() {
      const options = { chain: 'polygon', address: this.user.attributes.ethAddress };
      const ethNFTS = await Moralis.Web3API.account.getNFTs(options);
      this.avatars = ethNFTS.result.filter((nft) => nft.is_valid);
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

    const login = async () => {
      const user = await Moralis.Web3.authenticate();
      setUser(user);
    };

    const logout = async () => {
      await Moralis.User.logOut();
      setUser({});
    };

    const handleCurrentUser = () => {
      const user = Moralis.User.current();
      if (user) {
        setUser(user);
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
