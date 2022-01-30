<template>
  <div class="bg-black relative">
    <div class="overflow-hidden relative top-0">
      <div>
        <kinesis-scroll
          class="absolute top-0 w-full h-auto"
          tag="img"
          src="back.png"
          :strength="0"
          type="translate"
        />
        <kinesis-scroll
          class="relative w-full h-auto"
          tag="img"
          src="main.png"
          :strength="0"
          type="translate"
        />
        <kinesis-scroll
          class="absolute top-0 w-full h-auto"
          tag="img"
          src="top.png"
          :strength="0"
          type="scale"
        />

        <kinesis-scroll
          class="absolute top-0 w-full h-auto"
          tag="img"
          src="front.png"
          :strength="0"
          type="translate"
          :originY="0"
          axis="y"
        />
      </div>

      <div class="absolute top-30 right-10 p-10">
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
    </div>

    <div class="font-title text-6xl text-right my-12">
      COLLECT. CRAFT. TRADE. EARN.

      <router-link
        to="/app"
        class="py-2 px-4 text-center rounded-xl border-2 border-b-4 hover:-translate-y-0.5 active:translate-y-0 will-change-transform transition-all text-xl font-bold bg-sky-600 hover:bg-sky-500 border-gray-800 active:bg-sky-600"
      >
        TRY DEMO
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>
