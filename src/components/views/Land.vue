<template>
  Z:{{ z }}

  <div v-if="loadingClaims">Loading...</div>

  <renderer v-if="!loadingClaims" ref="renderer" v-bind="rendererConfig">
    <camera ref="camera" :position="{ x: gridSize, z: gridSize, y: 10 }"></camera>
    <scene background="#1f2937">
      <point-light :position="{ y: 50, z: 100 }"></point-light>
      <point-light :position="{ y: 100, z: 50 }"></point-light>

      <Group ref="grid" :rotation="{ y: 0 }">
        <box
          @pointerMove="highlighted = i"
          @pointerLeave="highlighted = null"
          @click="selectBox(i, true)"
          v-for="i in gridSize ** 2"
          :key="i"
          :position="{
            x: i % gridSize,
            y: 0,
            z: (i - (i % gridSize)) / gridSize,
          }"
          :scale="{
            x: 0.95,
            y: Math.random(),
            z: 0.95,
          }"
        >
          <PhongMaterial color="#333333">
            <!-- <Texture src="./bricks.jpeg" /> -->
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

  <Modal :open="showMintingModal" @close="showMintingModal = false">
    <template v-slot:title>Mint {{ x }}:{{ y }}:{{ z }}</template>

    <div v-if="isMinting">Minting...</div>

    <div v-else class="w-screen max-w-xl">
      <Cta size="big" @make="mintClaim(x, y, z)">Mint</Cta>
    </div>
  </Modal>
</template>

<script>
import contracts from '../../contracts';
import Moralis from '../../plugins/moralis';
import Modal from '../Modal.vue';
import Cta from '../Cta.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Land',

  components: { Modal, Cta },

  data() {
    return {
      x: 0,
      y: 0,
      z: 0,

      loadingClaims: false,
      claims: [],
      isMinting: false,
      claimsContract: null,

      contractState: {
        mapSize: 0,
        maxDepth: 0,
      },

      selectedBox: null,
      highlighted: null,

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
    await this.fetchContractState();
  },

  computed: {
    gridSize() {
      return this.contractState.mapSize;
    },
  },

  methods: {
    selectBox(i, selected) {
      this.selectedBox = selected ? i : null;
    },

    async mintClaim(x, y, z) {
      console.log('mintClaim', x, y, z);

      const sendOptions = {
        contractAddress: contracts.claims.address,
        functionName: 'mintClaim',
        abi: contracts.claims.abi,
        params: {
          x,
          y,
          z,
        },
      };

      const transaction = await Moralis.executeFunction(sendOptions);
      this.isMinting = true;
      console.log(1, { transaction });

      // TODO: better event handler UX

      try {
        const result = await transaction.wait();
        if (result.status === 1) {
          console.log('success');
        }
      } catch (err) {
        console.error(err);
      }

      this.isMinting = false;
    },

    async fetchContractState() {
      const web3Provider = await Moralis.enableWeb3();
      const ethers = Moralis.web3Library;

      this.claimsContract = new ethers.Contract(
        contracts.claims.address,
        contracts.claims.abi,
        web3Provider,
      );

      console.log(this.claimsContract);

      this.contractState = {
        mapSize: await this.claimsContract.mapSize(),
        maxDepth: await this.claimsContract.maxDepth(),
      };
    },
  },
};
</script>
