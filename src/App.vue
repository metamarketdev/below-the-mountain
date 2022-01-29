<template>
  <div>
    <!-- <input type="file" @input="input" /> -->
    <router-view />
  </div>
</template>

<script>
import 'floating-vue/dist/style.css';
import Popper from 'vue3-popper';
import ThemeToggle from './components/ThemeToggle.vue';
import Modal from './components/Modal.vue';

export default {
  components: {
    Popper,
    ThemeToggle,
    Modal,
  },

  data() {
    return {
      files: [],
    };
  },

  async mounted() {
    // const options = { chain: 'matic', address: this.user.attributes.ethAddress };
    // const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);
    // const metadata = JSON.parse(polygonNFTs.result[2].metadata);
    // console.log(metadata.image);
  },

  methods: {
    // IPFS STUFF
    // async input(event) {
    //   // Save file input to IPFS
    //   const data = event.target.files[0];
    //   const file = new Moralis.File(data.name, data);
    //   await file.saveIPFS();
    //   console.log(file.ipfs(), file.hash());
    //   // Save file reference to Moralis
    //   const jobApplication = new Moralis.Object('Applications');
    //   jobApplication.set('name', 'Satoshi');
    //   jobApplication.set('resume', file);
    //   await jobApplication.save();
    //   // Retrieve file
    //   const query = new Moralis.Query('Applications');
    //   query.equalTo('name', 'Satoshi');
    //   query.find().then(function([application]) {
    //     const ipfs = application.get('resume').ipfs();
    //     const hash = application.get('resume').hash();
    //     console.log('IPFS url', ipfs);
    //     console.log('IPFS hash', hash);
    //   });
    // },
  },
};
</script>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
