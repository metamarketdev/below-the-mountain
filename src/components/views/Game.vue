<template>
  <div class="flex flex-row items-start">
    <GameNav />

    <div class="flex flex-col flex-grow p-4">
      <h2 class="font-title text-4xl text-left mb-12">{{ $route.name }}</h2>

      <Notice v-if="$store.state.missingWeb3">No wallet detected. Please use Metamask.</Notice>

      <NotLoggedInNotice
        v-if="
          !$store.state.loadingUser &&
          (!$store.getters.isConnected || !$store.getters.isAuthenticated)
        "
      />

      <WrongNetworkNotice v-else-if="$store.getters.isWrongNetwork" />

      <OnboardingNotices
        v-if="
          !$store.getters.isWrongNetwork &&
          $store.getters.isConnected &&
          $store.getters.isAuthenticated
        "
      />

      <router-view
        v-if="
          $store.getters.isConnected &&
          $store.getters.isAuthenticated &&
          $store.getters.isCorrectNetwork
        "
      />
    </div>
  </div>

  <div class="fixed top-0 right-0 flex flex-row p-2">
    <UserMenu class="fixed top-2 right-2" />
  </div>

  <Modal :open="showWelcomeModal" @close="showWelcomeModal = false">
    <template v-slot:title>Welcome to the world under</template>
    <template v-slot:description>We're glad you're here.</template>

    <!-- <div class="text-center mb-2">
      <ExclamationIcon class="text-rose-400 w-12 h-12 inline-block" />
    </div> -->

    This is a
    <b>TESTNET</b>
    beta. None of the assets here hold any value.

    <template v-slot:buttons>
      <Butt @click="showWelcomeModal = false">Got it!</Butt>
    </template>
  </Modal>
</template>

<script>
import UserMenu from '../UserMenu.vue';
import GameNav from '../GameNav.vue';
import Modal from '../Modal.vue';
import { ExclamationIcon } from '@heroicons/vue/outline';
import OnboardingNotices from '../OnboardingNotices.vue';
import WrongNetworkNotice from '../WrongNetworkNotice.vue';
import NotLoggedInNotice from '../NotLoggedInNotice.vue';

export default {
  name: 'Game',

  components: {
    GameNav,
    UserMenu,
    Modal,
    OnboardingNotices,
    WrongNetworkNotice,
    NotLoggedInNotice,
    ExclamationIcon,
  },

  data() {
    return {
      showWelcomeModal: false,
    };
  },
  mounted() {
    if (!localStorage.getItem('welcomed')) {
      this.showWelcomeModal = true;
      localStorage.setItem('welcomed', true);
    }
  },
};
</script>
