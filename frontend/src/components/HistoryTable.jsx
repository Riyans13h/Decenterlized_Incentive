// src/components/HistoryTable.jsx
import React from 'react';

export default function HistoryTable({ history }) {
  return (
    <div>
      <h3>📜 Submission History</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Round</th>
            <th>Reward</th>
            <th>Shapley</th>
            <th>TX Hash</th>
            <th>Block</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, i) => (
            <tr key={i}>
              <td>{entry.round}</td>
              <td>{entry.reward}</td>
              <td>{entry.shapley}</td>
              <td>{entry.txHash.slice(0, 100)}</td>
              <td>{entry.blockNumber}</td>
              <td>{entry.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
