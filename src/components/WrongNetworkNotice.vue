<template>
  <Notice v-if="$store.getters.isWrongNetwork">
    <div>
      <ExclamationIcon class="w-12 h-12 text-amber-600 inline-block" />
    </div>

    You are connected to an unsupported network.

    <template v-slot:buttons>
      <Butt @clicked="$store.dispatch('switchToCorrectNetwork')" icon="bolt">
        Switch to Fuji Testnet
      </Butt>
    </template>
  </Notice>
</template>

<script>
import { ExclamationIcon } from '@heroicons/vue/outline';

export default {
  name: 'WrongNetworkNotice',

  components: {
    ExclamationIcon,
  },
};
</script>
