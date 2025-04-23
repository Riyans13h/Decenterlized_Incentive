import React from 'react';

export default function HistoryTable({ history }) {
  return (
    <div>
      <h3>📜 Submission History</h3>

      <div className="table-wrapper">
        <table>
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
                <td title={entry.txHash}>{entry.txHash.slice(0, 70)}}</td>
                <td>{entry.blockNumber || 'Pending'}</td>
                <td>{entry.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
