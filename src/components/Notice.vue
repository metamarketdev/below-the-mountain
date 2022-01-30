<template>
  <div
    class="flex flex-col p-4 mb-4 text-center items-center mx-auto border-2 border-black border-opacity-20 rounded max-w-md"
  >
    <div>
      <slot />
    </div>

    <div class="flex flex-col mt-2 items-center">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notice',
};
</script>
