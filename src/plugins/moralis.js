import Moralis from 'moralis/dist/moralis.js';

Moralis.start({
  serverUrl: 'https://hyebggaw2v4t.usemoralis.com:2053/server',
  appId: '5Ttx6h1EwHwWTZeuPH9mrgaNhHuJ6fjhySN0cVlm',
});

await Moralis.enableWeb3();

// TODO:
// serverUrl: process.env.VUE_APP_MORALIS_SERVER_URL,
// appId: process.env.VUE_APP_MORALIS_APP_ID,

export default Moralis;
