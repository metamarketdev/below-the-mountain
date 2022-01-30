<template>
  <Notice>
    <div>
      <ExclamationIcon class="w-12 h-12 text-amber-600 inline-block" />
    </div>

    You are not connected.

    <template v-slot:buttons>
      <Butt @clicked="$store.dispatch('login')" icon="plug">Connect wallet</Butt>
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
