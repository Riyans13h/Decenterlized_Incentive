import React, { useState, useEffect } from 'react';

const RoundForm = ({ onSubmit, suggestedData }) => {
  const [round, setRound] = useState('');
  const [reward, setReward] = useState('');
  const [shapley, setShapley] = useState('');

  // When new suggestion comes from Puzzle → fill form
  useEffect(() => {
    if (suggestedData) {
      setRound(suggestedData.round || '');
      setReward(suggestedData.reward || '');
      setShapley(suggestedData.shapley || '');
    }
  }, [suggestedData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!round || !reward || !shapley) {
      alert('Please fill all fields');
      return;
    }
    onSubmit(parseInt(round), parseInt(reward), parseInt(shapley));
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h2>📝 Submit Round Info</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Round:</label>
        <input
          type="number"
          value={round}
          onChange={(e) => setRound(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Reward (wei):</label>
        <input
          type="number"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          required
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Shapley Value:</label>
        <input
          type="number"
          value={shapley}
          onChange={(e) => setShapley(e.target.value)}
          required
        />
      </div>
      <button type="submit">🚀 Submit Round</button>
    </form>
  );
};

export default RoundForm;
