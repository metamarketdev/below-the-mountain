<template>
  <div class="flex flex-row items-start">
    <GameNav />

    <div class="flex flex-col flex-grow p-4">
      <h2 class="font-title text-4xl text-left mb-12">{{ $route.name }}</h2>

      <router-view />
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
    <br />
    You need Testnet AVAX to interact with the app.

    <template v-slot:buttons>
      <Cta
        href="https:faucet.avax-test.network"
        color="red"
        class="inline-block"
        icon="arrow-up-right-from-square"
      >
        Get testnet AVAX
      </Cta>
      <Cta @click="showWelcomeModal = false">Got it!</Cta>
    </template>
  </Modal>
</template>

<script>
import UserMenu from '../UserMenu.vue';
import GameNav from '../GameNav.vue';
import Modal from '../Modal.vue';
import Cta from '../Cta.vue';
import { mapState, mapMutations } from 'vuex';
import { ExclamationIcon } from '@heroicons/vue/outline';

export default {
  name: 'Game',

  components: {
    GameNav,
    UserMenu,
    Modal,
    Cta,
    ExclamationIcon,
  },

  data() {
    return {
      showWelcomeModal: false,
    };
  },

  mounted() {
    if (!this.hasSeenWelcomeModal) {
      this.showWelcomeModal = true;
      this.setHasSeenWelcomeModal();
    }
  },

  computed: {
    ...mapState('userPrefs', ['hasSeenWelcomeModal']),
  },

  methods: {
    ...mapMutations('userPrefs', ['setHasSeenWelcomeModal']),
  },
};
</script>
