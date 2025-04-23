// src/components/TransactionInspector.jsx
import React, { useState } from 'react';
import Web3 from 'web3';
//import { abi as contractAbi } from './INspectAbi/Incentive.json'; // update with your path to ABI
import incentiveJson from './INspectAbi/Incentive.json'; // ✅ fix import

const contractAbi = incentiveJson.abi; // ✅ extract ABI

export default function TransactionInspector({ web3 }) {
  const [txHash, setTxHash] = useState('');
  const [details, setDetails] = useState(null);
  const [logs, setLogs] = useState([]);
  const [block, setBlock] = useState(null);
  const [inputDecoded, setInputDecoded] = useState(null);
  const [error, setError] = useState('');

  const contract = new web3.eth.Contract(contractAbi);

  const decodeSubmitRoundInput = (input) => {
    const params = input.slice(10); // Remove "0x" and method selector
    const decoded = web3.eth.abi.decodeParameters(
      ['uint256', 'uint256', 'uint256'],
      '0x' + params
    );
    return {
      round: decoded[0],
      reward: decoded[1],
      shapley: decoded[2]
    };
  };

  const getTransaction = async () => {
    try {
      const tx = await web3.eth.getTransaction(txHash);
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (!tx) return setError('Transaction not found');
      setDetails({ ...tx, ...receipt });
      setError('');
    } catch (err) {
      setError('Error fetching transaction');
    }
  };

  const decodeInput = async () => {
    try {
      const tx = await web3.eth.getTransaction(txHash);
      if (!tx || !tx.input) return setError('No input data');

      const methodSig = tx.input.slice(0, 10);
      const expectedSig = web3.eth.abi.encodeFunctionSignature("submitRoundInfo(uint256,uint256,uint256)");

      if (methodSig !== expectedSig) {
        return setError('Input is not from submitRoundInfo()');
      }

      const decoded = decodeSubmitRoundInput(tx.input);
      setInputDecoded(decoded);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to decode input');
    }
  };

  const getLogs = async () => {
    try {
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (!receipt) return setError('Receipt not found');
      setLogs(receipt.logs);
      setError('');
    } catch (err) {
      setError('Error fetching logs');
    }
  };

  const getBlockInfo = async () => {
    try {
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      if (!receipt) return setError('Receipt not found');
      const blockInfo = await web3.eth.getBlock(receipt.blockNumber);
      setBlock(blockInfo);
      setError('');
    } catch (err) {
      setError('Error fetching block');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>🛠️ Transaction Inspector</h3>
      <input
        type="text"
        placeholder="Enter transaction hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        style={{ width: '100%' }}
      />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={getTransaction}>🔍 Basic Info</button>
        <button onClick={decodeInput}>🧠 Decode Input</button>
        <button onClick={getLogs}>📦 View Logs</button>
        <button onClick={getBlockInfo}>⛓️ Block Info</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {details && (
        <div>
          <h4>  Basic Info:</h4>
          <ul>
            <li><strong>From:</strong> {details.from}</li>
            <li><strong>To:</strong> {details.to}</li>
            <li><strong>Gas Used:</strong> {details.gasUsed}</li>
            <li><strong>Status:</strong> {details.status ? '✅ Success' : '❌ Fail'}</li>
            <li><strong>Nonce:</strong> {details.nonce}</li>
            <li><strong>Block:</strong> {details.blockNumber}</li>
          </ul>
        </div>
      )}

      {inputDecoded && (
        <div>
          <h4>🧬 Decoded Input:</h4>
          <pre>{JSON.stringify(inputDecoded, null, 2)}</pre>
        </div>
      )}

      {logs.length > 0 && (
        <div>
          <h4> Logs:</h4>
          <pre>{JSON.stringify(logs, null, 2)}</pre>
        </div>
      )}

      {block && (
        <div>
          <h4> Block Info:</h4>
          <ul>
            <li><strong>Block Number:</strong> {block.number}</li>
            <li><strong>Timestamp:</strong> {new Date(block.timestamp * 1000).toLocaleString()}</li>
            <li><strong>Miner:</strong> {block.miner}</li>
            <li><strong>Gas Limit:</strong> {block.gasLimit}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
