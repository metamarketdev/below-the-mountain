<template>
  <!-- <div class="inline-block"> -->
  <component
    :is="tag"
    :href="href"
    :to="to"
    :target="href && '_blank'"
    :class="`flex flex-row items-center place-content-center text-white font-medium bg-opacity-80 rounded-xl border-2 border-b-4 hover:-translate-y-0.5 active:translate-y-0 will-change-transform transition-all bg-${color}-600 hover:bg-${color}-500 border-gray-800 active:bg-${color}-600 ${sizeClasses} ${disabledClasses}`"
    @click="$emit('clicked')"
    :disabled="disabled"
  >
    <i v-if="icon" :class="`fas fa-${icon} mr-3`"></i>
    <slot />
  </component>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'Butt',

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

    to: {
      type: Object,
      String,
      default: null,
    },

    href: {
      type: String,
      default: '',
    },
  },

  computed: {
    tag() {
      if (this.to) {
        return 'router-link';
      } else if (this.href) {
        return 'a';
      } else {
        return 'button';
      }
    },

    sizeClasses() {
      return this.size === 'big' ? 'px-4 py-3 text-xl' : 'px-3 py-2 text-lg';
    },

    disabledClasses() {
      return this.disabled ? 'cursor-disabled' : 'cursor-pointer';
    },
  },
};
</script>
