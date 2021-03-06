import Moralis from '../plugins/moralis';

import gold from './Gold.json';
import items from './Items.json';
import crafting from './Crafting.json';
import tools from './Tools.json';
import claims from './Claims.json';
import mining from './Mining.json';
import faucet from './Faucet.json';

const contracts = {
  gold,
  items,
  crafting,
  tools,
  claims,
  mining,
  faucet,
};

export async function callMethod(contractName, methodName, params = {}) {
  // console.log('callMethod', contractName, methodName, { params });

  if (!contracts[contractName]) {
    console.error('No such contract:', contractName);
  }

  const contract = contracts[contractName];

  // Workaround required naming for params in moralis executeFunction
  // -> solidity mappings have unnamed params in abi outputs
  // FIXME: find a way to bypass for arrays as well
  const method = contract.abi.find((method) => method.name === methodName);

  method.inputs = method.inputs.map((input, i) => {
    if (!input.name) {
      input.name = Object.keys(params)[i];
    }
    return input;
  });

  const sendOptions = {
    contractAddress: contract.address,
    abi: contract.abi,
    functionName: methodName,
    params,
  };

  const result = await Moralis.executeFunction(sendOptions);

  return result;
}

export default contracts;
