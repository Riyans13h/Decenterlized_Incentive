// src/components/RoundForm.jsx
import React, { useState } from 'react';

export default function RoundForm({ onSubmit }) {
  const [round, setRound] = useState('');
  const [reward, setReward] = useState('');
  const [shapley, setShapley] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSubmit(parseInt(round), parseInt(reward), parseInt(shapley));
    setRound('');
    setReward('');
    setShapley('');
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: '2rem' }}>
      <input value={round} onChange={(e) => setRound(e.target.value)} placeholder="Round #" required />
      <input value={reward} onChange={(e) => setReward(e.target.value)} placeholder="Reward (wei)" required />
      <input value={shapley} onChange={(e) => setShapley(e.target.value)} placeholder="Shapley value" required />
      <button type="submit">Submit</button>
    </form>
  );
}
