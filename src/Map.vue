<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" /> -->
  <ThemeToggle />

  <div class="dark:bg-marker-blue tablet:text-red dark:text-white bg-gray-100 text-marker-blue">
    test
  </div>
  <VRButton ref="vrbutton" />

  <div class="text-blue mt-6">
    test
  </div>
  <input type="file" @input="input" />

  <renderer ref="renderer" v-bind="rendererConfig">
    <camera ref="camera" :position="{ x: gridSize, z: gridSize, y: 10 }"></camera>
    <scene>
      <point-light :position="{ y: 100, z: 50 }"></point-light>
      <point-light :position="{ y: 100, z: 50 }"></point-light>

      <Cylinder ref="cylinder" :position="{ x: 10, y: 0, z: 0 }" :height="0.5" :radialSegments="6" />

      <Group ref="grid" :rotation="{ y: 0 }">
        <!-- <Cylinder :position="{ x: 10, y: 0, z: 0 }" :height="0.5" :radialSegments="6">
          <PhongMaterial :color="highlighted === i ? '#f32fad' : 'gray'">
            <Texture src="OIP.jpeg" />
          </PhongMaterial>
        </Cylinder> -->

        <box
          @pointerMove="highlighted = i"
          @pointerLeave="highlighted = null"
          @click="selectBox(i, true)"
          v-for="i in gridSize ** 2"
          :key="i"
          :position="{ x: i % gridSize, y: 0, z: (i - (i % gridSize)) / gridSize }"
          :scale="{
            x: 0.95,
            y: Math.random(),
            z: 0.95,
          }"
        >
          <PhongMaterial :color="highlighted === i ? '#f32fad' : 'gray'">
            <Texture src="OIP.jpeg" />
          </PhongMaterial>
        </box>
      </Group>
    </scene>
    <!-- <EffectComposer>
      <RenderPass />
      <UnrealBloomPass :strength="1" />
      <HalftonePass :radius="1" :scatter="0" />
    </EffectComposer> -->
  </renderer>

  <template v-if="isAuthenticated">
    {{ user.get('ethAddress') }}
    <button @click="logout">Logout</button>
  </template>

  <template v-else>
    <button @click="login">Connect wallet</button>
  </template>

  <!-- <Modal /> -->
</template>

<script>
import Popper from 'vue3-popper';
import ThemeToggle from './components/ThemeToggle.vue';
import Modal from './components/Modal.vue';
import { onMounted, inject, computed } from 'vue';
import { useStore } from 'vuex';
import Moralis from './plugins/moralis';
import VRButton from 'troisjs/src/components/misc/VRButton.vue';

export default {
  components: {
    Popper,
    ThemeToggle,
    Modal,
  },

  data() {
    return {
      gridSize: 10,
      selectedBox: null,
      highlighted: null,
      files: [],

      rendererConfig: {
        antialias: true,
        resize: 'window',

        orbitCtrl: {
          mouseButtons: {
            LEFT: 2,
            MIDDLE: 2,
            RIGHT: 0,
          },

          enableDamping: true,
          minZoom: 10,
          maxZoom: 10,
          minDistance: 10,
          maxDistance: 100,
        },
      },
    };
  },

  async mounted() {
    const renderer = this.$refs.renderer;
    // this.$refs.camera.camera.lookAt(scene.position)
    renderer.onBeforeRender(() => {
      // this.$refs.camera.camera.lookAt(renderer.scene.position);
      this.$refs.grid.group.rotation.y += 0.005;
    });
  },

  setup() {
    const store = useStore();
    // const $moralis = inject('$moralis');
    const setUser = payload => store.commit('setUser', payload);

    const login = async () => {
      const user = await Moralis.Web3.authenticate();
      setUser(user);
    };

    const logout = async () => {
      await Moralis.User.logOut();
      setUser({});
    };

    const handleCurrentUser = () => {
      const user = Moralis.User.current();
      if (user) {
        setUser(user);
      }
    };

    onMounted(() => {
      handleCurrentUser();
    });

    return {
      login,
      logout,
      isAuthenticated: computed(() => Object.keys(store.state.user).length > 0),
      user: computed(() => store.state.user),
    };
  },

  methods: {
    onReady(e) {
      console.log(e, 'onReady');
    },
    onProgress(e) {
      console.log(e, 'onProgress');
    },
    onError(e) {
      console.log(e, 'onError');
    },

    async input(event) {
      // Save file input to IPFS
      const data = event.target.files[0];
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();

      console.log(file.ipfs(), file.hash());

      // Save file reference to Moralis
      const jobApplication = new Moralis.Object('Applications');
      jobApplication.set('name', 'Satoshi');
      jobApplication.set('resume', file);
      await jobApplication.save();

      // Retrieve file
      const query = new Moralis.Query('Applications');
      query.equalTo('name', 'Satoshi');
      query.find().then(function([application]) {
        const ipfs = application.get('resume').ipfs();
        const hash = application.get('resume').hash();
        console.log('IPFS url', ipfs);
        console.log('IPFS hash', hash);
      });
    },

    selectBox(i, selected) {
      this.selectedBox = selected ? i : null;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
