// src/components/TransactionInspector.jsx
import React, { useState } from 'react';
import Web3 from 'web3';
//import { abi as contractAbi } from './INspectAbi/Incentive.json';
import contractJson from './INspectAbi/Incentive.json';
const contractAbi = contractJson.abi;

export default function TransactionInspector({ web3 }) {
  const [txHash, setTxHash] = useState('');
  const [txDetails, setTxDetails] = useState(null);
  const [decodedInput, setDecodedInput] = useState(null);
  const [eventLogs, setEventLogs] = useState([]);
  const [blockDetails, setBlockDetails] = useState(null);
  const [error, setError] = useState('');

  const contract = new web3.eth.Contract(contractAbi);

  // Decode function input for submitRoundInfo
  const decodeSubmitRoundInput = (input) => {
    const cleanInput = input.slice(10); // Remove method selector
    const decoded = web3.eth.abi.decodeParameters(
      ['uint256', 'uint256', 'uint256'],
      '0x' + cleanInput
    );
    return {
      round: decoded[0],
      reward: decoded[1],
      shapley: decoded[2]
    };
  };

  const fetchBasicInfo = async () => {
    try {
      const tx = await web3.eth.getTransaction(txHash);
      const receipt = await web3.eth.getTransactionReceipt(txHash);

      if (!tx || !receipt) {
        setError('Transaction or receipt not found');
        return;
      }

      setTxDetails({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        nonce: tx.nonce,
        gas: tx.gas,
        gasPrice: tx.gasPrice,
        value: tx.value,
        status: receipt.status,
        blockNumber: receipt.blockNumber,
        transactionIndex: receipt.transactionIndex,
        cumulativeGasUsed: receipt.cumulativeGasUsed,
        gasUsed: receipt.gasUsed,
        contractAddress: receipt.contractAddress,
      });

      setError('');
    } catch (err) {
      console.error(err);
      setError('Error fetching transaction details');
    }
  };

  const fetchDecodedInput = async () => {
    try {
      const tx = await web3.eth.getTransaction(txHash);
      const methodSig = tx.input.slice(0, 10);
      const expectedSig = web3.eth.abi.encodeFunctionSignature('submitRoundInfo(uint256,uint256,uint256)');

      if (methodSig !== expectedSig) {
        setDecodedInput({ error: 'Input does not match submitRoundInfo' });
        return;
      }

      const decoded = decodeSubmitRoundInput(tx.input);
      setDecodedInput(decoded);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error decoding input');
    }
  };

  const fetchLogs = async () => {
    try {
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      const parsedLogs = [];

      for (let log of receipt.logs) {
        try {
          const decoded = contract._decodeEventABI.call({ name: 'ALLEVENTS' }, log);
          parsedLogs.push(decoded);
        } catch {
          parsedLogs.push({ raw: log });
        }
      }

      setEventLogs(parsedLogs);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Error fetching logs');
    }
  };

  const fetchBlockDetails = async () => {
    try {
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      const block = await web3.eth.getBlock(receipt.blockNumber);

      setBlockDetails({
        number: block.number,
        timestamp: new Date(block.timestamp * 1000).toLocaleString(),
        miner: block.miner,
        gasLimit: block.gasLimit,
        gasUsed: block.gasUsed,
        baseFeePerGas: block.baseFeePerGas,
        transactions: block.transactions.length
      });

      setError('');
    } catch (err) {
      console.error(err);
      setError('Error fetching block details');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>🔍 Transaction Inspector</h2>
      <input
        type="text"
        placeholder="Enter transaction hash"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
      />

      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={fetchBasicInfo}>📄 Fetch Basic Info</button>
        <button onClick={fetchDecodedInput}>🧠 Decode Input</button>
        <button onClick={fetchLogs}>📜 View Logs</button>
        <button onClick={fetchBlockDetails}>⛓️ Block Info</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {txDetails && (
        <div>
          <h4>📄 Basic Info:</h4>
          <pre>{JSON.stringify(txDetails, null, 2)}</pre>
        </div>
      )}

      {decodedInput && (
        <div>
          <h4>🧬 Decoded Input:</h4>
          <pre>{JSON.stringify(decodedInput, null, 2)}</pre>
        </div>
      )}

      {eventLogs.length > 0 && (
        <div>
          <h4>📜 Event Logs:</h4>
          {eventLogs.map((log, idx) => (
            <pre key={idx}>{JSON.stringify(log, null, 2)}</pre>
          ))}
        </div>
      )}

      {blockDetails && (
        <div>
          <h4>⛓️ Block Info:</h4>
          <pre>{JSON.stringify(blockDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
