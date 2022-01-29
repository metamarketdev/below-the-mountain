<template>
  <div class="relative">
    <img src="main.png" class="absolute top-0 left-0 w-full h-auto" />

    <kinesis-container event="scroll">
      <kinesis-element tag="img" src="top.png" :strength="10" type="scale" class="absolute" />
      <!-- <kinesis-element tag="div" src="top.png" :strength="5" type="translate" class="fixed top-0">
        <div class="font-title text-5xl right-10">COLLECT. CRAFT. TRADE. EARN</div>
      </kinesis-element> -->
      <!-- <kinesis-element tag="img" src="main.png" :strength="200" type="translate" /> -->
      <kinesis-element tag="img" src="front.png" :strength="-200" type="translate" :originY="0" />
    </kinesis-container>

    <div class="absolute w-full h-full border border-red-600">
      <div class="font-title text-6xl text-right">
        COLLECT. CRAFT.
        <br />
        TRADE. EARN.
      </div>

      <router-link
        to="/app"
        class="py-2 px-4 text-center rounded-xl border-2 border-b-4 hover:-translate-y-0.5 active:translate-y-0 will-change-transform transition-all text-xl font-bold bg-sky-600 hover:bg-sky-500 border-gray-800 active:bg-sky-600"
      >
        TRY DEMO
      </router-link>
    </div>

    <!-- <img src="top.png" class="fixed top-0 left-0" /> -->

    <!--
    <img src="top.png" class="fixed top-0 left-0" />

    <div style="background-image: url('main.png')" class="bg-cover"></div>

    <img src="front.png" /> -->
  </div>

  <router-link to="/app">Play</router-link>

  <div>section 1</div>

  <div>footer</div>
</template>

<script>
export default {
  name: 'Home',
};
</script>

<style></style>
