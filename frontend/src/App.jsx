import React, { useEffect, useState } from 'react';
import { getWeb3, getContract } from './web3';
import RoundForm from './components/RoundForm';
import RoundDetails from './components/RoundDetails';
import HistoryTable from './components/HistoryTable';
import TransactionInspector from './components/TransactionInspector';
import PuzzleGame from './components/PuzzleGame';
import PlayerProfile from './components/PlayerProfile'; // ✅ Import PlayerProfile
import './App.css';

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [history, setHistory] = useState([]);
  const [reward, setReward] = useState(0); // Track player's reward
  const [badges, setBadges] = useState([]); // Track player's badges
  const [suggestedData, setSuggestedData] = useState({ round: '', reward: '', shapley: '' });

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

    setSuggestedData({ round: '', reward: '', shapley: '' }); // clear form after submission
  };

  // 🎯 When puzzle finished → auto-fill form with round data and update reward/badges
  const handlePuzzleFinish = ({ round, reward, shapley }) => {
    setSuggestedData({ round, reward, shapley });
    setReward((prevReward) => prevReward + reward); // Update the total reward

    // Badge awarding logic based on reward
    let newBadges = [...badges]; // Copy current badges

    // Award badge if certain reward thresholds are met
    if (reward >= 1000 && !newBadges.includes('Master Puzzle Solver')) {
      newBadges.push('Master Puzzle Solver');
    }
    if (reward >= 500 && !newBadges.includes('Puzzle Expert')) {
      newBadges.push('Puzzle Expert');
    }

    // If new badges were awarded, update the badges state
    if (newBadges.length > badges.length) {
      setBadges(newBadges);
    }
  };

  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>🏆 Incentive Round Submission</h1>
      <p>Connected account: {account}</p>

      {/* Puzzle Game Component */}
      <PuzzleGame onFinish={handlePuzzleFinish} />

      {/* Round Form (auto-filled after Puzzle) */}
      <RoundForm onSubmit={handleSubmit} suggestedData={suggestedData} />

      {/* Player Profile Component */}
      <PlayerProfile account={account} reward={reward} badges={badges} /> {/* ✅ NEW: Player profile visible */}

      {/* Round Details from Contract */}
      <RoundDetails contract={contract} account={account} />

      {/* History of all Round Submissions */}
      <HistoryTable history={history} />

      {/* Transaction Inspector */}
      {web3 && <TransactionInspector web3={web3} />}
    </div>
  );
};

export default App;
