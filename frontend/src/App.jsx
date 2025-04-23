// src/App.jsx
import React, { useEffect, useState } from 'react';
import { getWeb3, getContract } from './web3';
import RoundForm from './components/RoundForm';
import RoundDetails from './components/RoundDetails';
import HistoryTable from './components/HistoryTable';
import './App.css';
const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const init = async () => {
      const web3Instance = await getWeb3();
      const accounts = await web3Instance.eth.getAccounts();
      const contractInstance = await getContract(web3Instance);
      setWeb3(web3Instance);
      setContract(contractInstance);
      setAccount(accounts[0]);
    };
    init();
  }, []);

  const handleSubmit = async (round, reward, shapley) => {
    const tx = await contract.methods
      .submitRoundInfo(round, reward, shapley)
      .send({ from: account });
    const block = await web3.eth.getBlock(tx.blockNumber);
    setHistory((prev) => [
      ...prev,
      {
        round,
        reward,
        shapley,
        txHash: tx.transactionHash,
        blockNumber: tx.blockNumber,
        timestamp: new Date(block.timestamp * 1000).toISOString()
      }
    ]);
  };

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>🏆 Incentive Round Submission</h1>
      <p>Connected account: {account}</p>
      <RoundForm onSubmit={handleSubmit} />
      <RoundDetails contract={contract} account={account} />
      <HistoryTable history={history} />
    </div>
  );
};

export default App;
