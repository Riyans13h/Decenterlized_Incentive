// src/web3.js
import Web3 from 'web3';
import IncentiveABI from './IncentiveABI.json'; // Paste ABI here

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    } else {
      reject('Install MetaMask');
    }
  });

const getContract = async (web3) => {
  const networkId = await web3.eth.net.getId();
  const address = process.env.REACT_APP_CONTRACT_ADDRESS;
  const contract = new web3.eth.Contract(IncentiveABI, address);
  return contract;
};

export { getWeb3, getContract };
