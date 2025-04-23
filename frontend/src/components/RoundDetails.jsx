// src/components/RoundDetails.jsx
import React, { useEffect, useState } from 'react';

export default function RoundDetails({ contract, account }) {
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (contract && account) {
        const res = await contract.methods.getLatestRecord(account).call();
        setRecord(res);
      }
    };
    fetch();
  }, [contract, account]);

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>📋 Latest Record</h3>
      {record ? (
        <ul>
          <li>Round: {record[0]}</li>
          <li>Reward: {record[1]}</li>
          <li>Shapley: {record[2]}</li>
        </ul>
      ) : (
        <p>No record found.</p>
      )}
    </div>
  );
}
