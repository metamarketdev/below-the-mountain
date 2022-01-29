<template>
  <button
    :class="`flex flex-row items-center place-content-center rounded bg-${color}-600 hover:bg-${color}-600 text-white font-medium bg-opacity-80 rounded-xl border-2 border-b-4 hover:-translate-y-0.5 active:translate-y-0 will-change-transform transition-all text-xl bg-sky-600 hover:bg-sky-500 border-gray-800 active:bg-sky-600 ${sizeClasses}`"
    @click="$emit('make')"
    :disabled="disabled"
  >
    <i v-if="icon" :class="`fas fa-${icon} mr-3`"></i>
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Cta',

  props: {
    icon: {
      type: String,
      default: '',
    },

    color: {
      type: String,
      default: 'sky',
    },

    size: {
      type: String,
      default: 'normal',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    sizeClasses() {
      return this.size === 'big' ? 'px-4 py-3 text-lg' : 'px-2 py-1';
    },
  },
};
</script>
