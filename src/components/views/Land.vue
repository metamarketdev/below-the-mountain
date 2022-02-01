<template>
  <div class="text-gray-300 my-4 text-center">Carve yourself a piece of the mountain.</div>
  <div class="flex flex-row items-center justify-center mb-4">
    <Butt @clicked="up()" color="gray" icon="arrow-up" class="pl-5" />
    <div class="font-title text-4xl p-2">
      <span class="text-gray-600">FLOOR</span>
      {{ z > 0 ? '-' : '' }}{{ z }}
    </div>
    <Butt @clicked="down()" color="gray" icon="arrow-down" class="pl-5" />
  </div>

  <div v-if="loadingClaims">Scouting the underworld...</div>

  <div class="grid grid-cols-16 gap-1 container mx-auto mb-10">
    <LandItem
      v-for="i in gridSize ** 2"
      :key="i + z * gridSize ** 2"
      @clicked="selectClaim(i + z * gridSize ** 2)"
      :isMinted="contractState.mintedIds.includes(i + z * gridSize ** 2)"
      :tokenId="i + z * gridSize ** 2"
    />
  </div>

  <Modal :open="showMintingModal" @close="showMintingModal = false">
    <template v-slot:title>Claim mine #{{ selectedClaim }}</template>

    <div v-if="mintingFailed">Failed :(</div>
    <div v-else-if="isMinting && mintingSubmitted">Claiming some underground turf...</div>
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

      <Butt to="/app/inventory" class="mt-4">View in inventory</Butt>
    </div>

    <div v-else class="flex flex-col">
      <img src="/deed.png" width="140" height="140" alt="Deed" class="mx-auto" />

      <div class="mt-8 flex flex-col">
        Add some swag (optional)
        <input type="file" @input="input" class="rounded border p-2 bg-gray-800" />
      </div>

      <div class="flex flex-row justify-center mt-4">
        <Butt size="big" @click="mintClaim(selectedClaim)">Mint</Butt>
      </div>
    </div>
  </Modal>
</template>

<script>
import { callMethod } from '../../contracts';
import LandItem from '../LandItem.vue';
import Moralis from '../../plugins/moralis';

export default {
  name: 'Land',

  components: {
    LandItem,
  },

  data() {
    return {
      file: null,

      z: 0,

      loadingClaims: true,
      claims: [],
      isMinting: false,
      showMintingModal: false,
      mintingFailed: false,
      mintingSubmitted: false,
      mintingSuccess: false,
      timeout: null,

      contractState: {
        mapSize: 0,
        mintedIds: [],
      },

      selectedClaim: null,

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

  unmounted() {
    clearTimeout(this.timeout);
  },

  computed: {
    gridSize() {
      return this.contractState.mapSize;
    },
  },

  methods: {
    up() {
      if (this.z <= 0) {
        this.z = 0;
      } else {
        this.z--;
      }
    },

    down() {
      this.z++;
    },

    selectClaim(i) {
      this.selectedClaim = i;
      this.mintingFailed = false;
      this.mintingSubmitted = false;
      this.mintingSuccess = false;
      this.showMintingModal = true;
    },

    async mintClaim(tokenId) {
      this.isMinting = true;

      let file;

      if (this.file) {
        // Save file input to IPFS
        file = new Moralis.File(this.file.name, this.file);
        await file.saveIPFS();
        console.log(file.ipfs(), file.hash());
      }

      try {
        const transaction = await callMethod('claims', 'mintClaim', {
          tokenId,
          imgHash: file ? file.hash() : 'null',
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
      let mintedIds = await callMethod('claims', 'getMintedIds');
      mintedIds = mintedIds.map((id) => id.toNumber());
      this.contractState.mintedIds = mintedIds;

      let mapSize = await callMethod('claims', 'mapSize');
      mapSize = mapSize.toNumber();
      this.contractState.mapSize = mapSize;

      this.timeout = setTimeout(this.fetchContractState, 5000);
      this.loadingClaims = false;
    },

    async input(event) {
      this.file = event.target.files[0];
    },
  },
};
</script>
