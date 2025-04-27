import React, { useEffect, useState } from 'react';
import { getWeb3, getContract } from './web3';
import RoundForm from './components/RoundForm';
import RoundDetails from './components/RoundDetails';
import HistoryTable from './components/HistoryTable';
import './App.css';
import TransactionInspector from './components/TransactionInspector';
import PuzzleGame from './components/PuzzleGame'; // Import PuzzleGame component

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [history, setHistory] = useState([]);
  const [suggestedData, setSuggestedData] = useState({ round: '', reward: '', shapley: '' }); // default empty

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
    if (!contract || !account) return;

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

    setSuggestedData({ round: '', reward: '', shapley: '' }); // clear after submit
  };

  // 🎯 After puzzle solved → auto-fill form
  const handlePuzzleFinish = ({ round, reward, shapley }) => {
    setSuggestedData({ round, reward, shapley });
  };

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>🏆 Incentive Round Submission</h1>
      <p>Connected account: {account}</p>

      {/* Puzzle Game Component */}
      <PuzzleGame onFinish={handlePuzzleFinish} />

      {/* Round Form (auto-filled) */}
      <RoundForm onSubmit={handleSubmit} suggestedData={suggestedData} />

      {/* Round Details */}
      <RoundDetails contract={contract} account={account} />

      {/* History Table */}
      <HistoryTable history={history} />

      {/* Transaction Inspector */}
      {web3 && <TransactionInspector web3={web3} />}
    </div>
  );
};

export default App;
