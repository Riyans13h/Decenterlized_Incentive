// src/components/TransactionInspector.jsx
import React, { useState } from 'react';
import Web3 from 'web3';
import { jsPDF } from 'jspdf';
import contractJson from './INspectAbi/Incentive.json';

const web3 = new Web3('ws://127.0.0.1:9545');
const contractAbi = contractJson.abi;
const contractAddress = '0xE7069c455d3185F631ED3615B0386e5F963fAeaf';
const contract = new web3.eth.Contract(contractAbi, contractAddress);

export default function TransactionInspector() {
  const [txHash, setTxHash] = useState('');
  const [txDetails, setTxDetails] = useState(null);
  const [decodedInput, setDecodedInput] = useState(null);
  const [eventLogs, setEventLogs] = useState([]);
  const [blockDetails, setBlockDetails] = useState(null);

  const handleFetch = async () => {
    try {
      const tx = await web3.eth.getTransaction(txHash);
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      const block = await web3.eth.getBlock(tx.blockNumber);

      setTxDetails({ ...tx, status: receipt.status, blockNumber: tx.blockNumber });

      // Decode input
      const methodSignature = tx.input.slice(0, 10); // First 4 bytes + 0x
      const method = contractAbi.find(m => methodSignature === web3.eth.abi.encodeFunctionSignature(m));
      const inputs = web3.eth.abi.decodeParameters(method.inputs, tx.input.slice(10));

      const decoded = {};
      method.inputs.forEach((input, index) => {
        decoded[input.name] = inputs[index];
      });
      setDecodedInput(decoded);

      // Logs
      const parsedLogs = receipt.logs.map(log => ({
        event: log.topics[0],
        address: log.address,
        data: log.data,
        topics: log.topics
      }));
      setEventLogs(parsedLogs);

      // Block Info
      setBlockDetails({
        number: block.number,
        timestamp: new Date(block.timestamp * 1000).toISOString(),
        miner: block.miner,
        gasLimit: block.gasLimit,
        gasUsed: block.gasUsed,
        transactions: block.transactions.length
      });
    } catch (err) {
      console.error(err);
      alert('❌ Failed to fetch transaction details.');
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const lineHeight = 10;
    const margin = 14;
    let y = 20;

    const checkPageBreak = () => {
      if (y >= 280) {
        doc.addPage();
        y = margin;
      }
    };

    doc.setFontSize(16);
    doc.text('Transaction Inspector Report', margin, y);
    y += lineHeight;
    doc.setFontSize(12);

    const addText = (label, value) => {
      checkPageBreak();
      doc.text(`${label}: ${value}`, margin, y);
      y += lineHeight;
    };

    if (txDetails) {
      addText('Transaction Hash', txDetails.hash);
      addText('From', txDetails.from);
      addText('To', txDetails.to || 'Contract');
      addText('Gas', txDetails.gas);
      addText('Gas Price', txDetails.gasPrice);
      addText('Value (ETH)', web3.utils.fromWei(txDetails.value, 'ether'));
      addText('Block Number', txDetails.blockNumber);
      addText('Status', txDetails.status === true ? 'Success' : 'Failure');
    }

    if (decodedInput) {
      y += lineHeight;
      addText('Decoded Input', '');
      Object.entries(decodedInput).forEach(([key, val]) => {
        addText(`  ${key}`, val);
      });
    }

    if (eventLogs.length > 0) {
      y += lineHeight;
      addText('Event Logs', '');
      eventLogs.forEach((log, idx) => {
        const logText = JSON.stringify(log, null, 2).split('\n');
        addText(`Log ${idx + 1}`, '');
        logText.forEach(line => {
          checkPageBreak();
          doc.text(line, margin + 10, y);
          y += 6;
        });
      });
    }

    if (blockDetails) {
      y += lineHeight;
      addText('Block Info', '');
      Object.entries(blockDetails).forEach(([key, val]) => {
        addText(`  ${key}`, val);
      });
    }

    doc.save('transaction-details.pdf');
  };

  return (
    <div style={{ padding: 20, maxWidth: 800 }}>
      <h2>🔍 Transaction Inspector</h2>
      <input
        type="text"
        placeholder="Enter Transaction Hash"
        value={txHash}
        onChange={e => setTxHash(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      />
      <button onClick={handleFetch} style={{ marginTop: 10, marginRight: 10 }}>Get Details</button>
      <button onClick={exportToPDF} style={{ marginTop: 10 }}>Download PDF</button>

      {txDetails && (
        <div style={{ marginTop: 30 }}>
          <h3>📄 Transaction Details</h3>
          <pre>{JSON.stringify(txDetails, null, 2)}</pre>
        </div>
      )}

      {decodedInput && (
        <div style={{ marginTop: 20 }}>
          <h3>🧮 Decoded Input</h3>
          <pre>{JSON.stringify(decodedInput, null, 2)}</pre>
        </div>
      )}

      {eventLogs.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>📦 Logs</h3>
          <pre>{JSON.stringify(eventLogs, null, 2)}</pre>
        </div>
      )}

      {blockDetails && (
        <div style={{ marginTop: 20 }}>
          <h3>⛓️ Block Info</h3>
          <pre>{JSON.stringify(blockDetails, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
