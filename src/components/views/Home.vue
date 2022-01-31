<template>
  <div class="bg-black relative">
    <!-- <div class="relative overflow-hidden">
      <scroll-y-parallax :speed="100">
        <img src="main.jpg" />
      </scroll-y-parallax>

      <scroll-y-parallax :speed="100">
        <img src="front.png" />
      </scroll-y-parallax>
    </div> -->

    <kinesis-container event="scroll" class="relative overflow-hidden">
      <kinesis-element
        class="relative w-full h-auto"
        tag="img"
        src="main.jpg"
        :strength="0"
        axis="y"
        type="translate"
      />
      <!-- :originY="0"
        :maxY="1000"
        :minY="500"
        transformOrigin="top" -->
      <kinesis-element
        class="absolute top-0 w-full h-auto"
        tag="img"
        src="top.png"
        axis="y"
        :strength="0"
        type="scale"
        :originY="0"
        :transformOrigin="0"
      />
      <kinesis-element
        class="absolute top-0 w-full h-auto"
        tag="img"
        src="front.png"
        :strength="0"
        type="translate"
        :originY="0"
        axis="y"
      />

      <div class="flex flex-row justify-center absolute top-5 w-full">
        <!-- <img src="logo_1024.png" alt="BelowTheMountain" style="width: 33%; max-width: 512px" /> -->
      </div>

      <div class="absolute top-1/3 right-1/4">
        <img src="logo_1024.png" alt="BelowTheMountain" width="400" />

        <!-- <div class="font-title text-6xl text-right">
          COLLECT. CRAFT.
          <br />
          TRADE. EARN.
        </div> -->

        <Butt
          to="/app"
          class="mt-4 py-2 px-4 text-center rounded-xl border-2 border-b-4 hover:-translate-y-0.5 active:translate-y-0 will-change-transform transition-all text-xl font-bold bg-sky-600 hover:bg-sky-500 border-gray-800 active:bg-sky-600"
        >
          TRY DEMO
        </Butt>
      </div>
    </kinesis-container>

    <div class="p-10 my-20">s</div>
    <div class="p-10 my-20">s</div>
    <div class="p-10 my-20">s</div>
    <div class="p-10 my-20">s</div>
    <div class="p-10 my-20">s</div>
    <div class="p-10 my-20">s</div>
  </div>
</template>

<script>
export default {
  name: 'Home',
};
</script>
