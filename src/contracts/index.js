import goldContract from './Gold.json';
import itemsContract from './Items.json';
import craftingContract from './Crafting.json';
import toolsContract from './Tools.json';
import claimsContract from './Claims.json';
import faucetContract from './Faucet.json';

import goldAbi from '../../abi/Gold.json';
import itemsAbi from '../../abi/Items.json';
import craftingAbi from '../../abi/Crafting.json';
import toolsAbi from '../../abi/Tools.json';
// import claimsAbi from '../../abi/Claims.json';

// FIXME: normalize

export default {
  gold: {
    address: goldContract.address,
    abi: goldAbi,
  },
  items: {
    address: itemsContract.address,
    abi: itemsAbi,
  },
  crafting: {
    address: craftingContract.address,
    abi: craftingContract.abi,
  },
  tools: {
    address: toolsContract.address,
    abi: toolsAbi,
  },
  claims: {
    address: claimsContract.address,
    abi: claimsContract.abi,
  },
  faucet: {
    address: faucetContract.address,
    abi: faucetContract.abi,
  },
};
