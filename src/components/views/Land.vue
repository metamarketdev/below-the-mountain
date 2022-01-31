<template>
  Z:{{ z }}

  <div v-if="loadingClaims">Loading...</div>
  {{ gridSize }}

  <renderer v-if="!loadingClaims" ref="renderer" v-bind="rendererConfig">
    <camera ref="camera" :position="{ x: gridSize, z: gridSize, y: 15 }"></camera>
    <scene background="#1f2937">
      <point-light :position="{ y: 50, z: 100 }"></point-light>
      <point-light :position="{ y: 100, z: 50 }"></point-light>

      <Group ref="grid" :rotation="{ y: 0 }">
        <box
          v-for="i in gridSize ** 2"
          @pointerMove="highlighted = i"
          @pointerLeave="highlighted = null"
          @click="selectBox(i, true)"
          :key="i"
          :position="{
            x: i % gridSize,
            y: 0,
            z: (i - (i % gridSize)) / gridSize,
          }"
          :scale="{
            x: 0.95,
            y: 1,
            z: 0.95,
          }"
        >
          <PhongMaterial color="#333333"></PhongMaterial>
        </box>
      </Group>
    </scene>
  </renderer>

  <Modal :open="showMintingModal" @close="showMintingModal = false">
    <template v-slot:title>Mint {{ x }}:{{ y }}:{{ z }}</template>

    <div v-if="mintingFailed">Failed :(</div>
    <div v-else-if="isMinting && mintingSubmitted">Minting item...</div>
    <div v-else-if="isMinting">Sending transaction...</div>
    <div v-else-if="mintingSuccess">
      Success!
      <br />
      <a
        :href="`https://testnet.snowtrace.io/tx/${mintingTx}`"
        target="_blank"
        class="text-gray-600 underline"
      >
        View transaction
      </a>

      <Butt to="/app/inventory">Go to inventory</Butt>
    </div>

    <template v-else>
      <div class="flex flex-row items-center justify-center">Image here</div>

      <div class="flex flex-row justify-center mt-4">
        <Butt size="big" @click="mintClaim(selectedBox)">
          <!-- :disabled="selectedRecipe.possibleAmount === 0" -->
          Mint
        </Butt>
      </div>
    </template>
  </Modal>
</template>

<script>
import { callMethod } from '../../contracts';

export default {
  name: 'Land',

  data() {
    return {
      x: 0,
      y: 0,
      z: 0,

      loadingClaims: false,
      claims: [],
      isMinting: false,
      showMintingModal: false,
      mintingFailed: false,
      mintingSubmitted: false,
      mintingSuccess: false,

      contractState: {
        mapSize: 0,
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
      console.log('clicked', i);
      this.selectedBox = selected ? i : null;
      this.mintingFailed = false;
      this.mintingSubmitted = false;
      this.mintingSuccess = false;
      this.showMintingModal = true;
    },

    async mintClaim(tokenId) {
      try {
        const transaction = await callMethod('claims', 'mintClaim', {
          tokenId,
        });

        this.mintingSubmitted = true;

        const result = await transaction.wait();

        if (result.status === 1) {
          this.mintingSuccess = true;
          this.mintingTx = result.transactionHash;
        } else {
          throw Error(result);
        }
      } catch (err) {
        this.mintingFailed = true;
        console.error('Failed to mint', err);
      }

      this.isMinting = false;
    },

    async fetchContractState() {
      this.loadingClaims = true;

      let numClaims = await callMethod('claims', 'amountMinted');
      numClaims = numClaims.toNumber();

      console.log({ numClaims });
      let mapSize = await callMethod('claims', 'mapSize');
      mapSize = mapSize.toNumber();

      this.contractState.mapSize = mapSize;

      let claims = [];

      for (let i = 1; i <= numClaims; i++) {
        let claim = await callMethod('claims', '_claimDetails', { claimId: i });
        claims.push(claim);
      }

      console.log(claims);

      this.claims = claims;
      this.loadingClaims = false;
    },
  },
};
</script>
