// src/components/PuzzleGame.jsx
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

const PuzzleGame = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [reward, setReward] = useState(0);
  const [shapley, setShapley] = useState(0);
  const [round, setRound] = useState(0);
  const [playerAnswer, setPlayerAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Puzzle logic (Example)
  const puzzles = [
    { question: 'What is 2 + 2?', answer: '4' },
    { question: 'What is 5 * 5?', answer: '25' },
    { question: 'What is the capital of France?', answer: 'Paris' }
  ];

  const randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];

  // Start the game
  const startPuzzle = () => {
    setIsPlaying(true);
    setStartTime(new Date());
    setRound(round + 1); // Increment round number
  };

  // End the game and calculate reward
  const submitAnswer = () => {
    setEndTime(new Date());
    setIsPlaying(false);

    // Calculate time taken to solve the puzzle
    const time = (endTime - startTime) / 1000; // in seconds
    setTimeTaken(time);

    // Calculate reward (example: based on time taken)
    setReward(calculateReward(time));

    // Calculate Shapley value (simple example, more complexity can be added)
    setShapley(calculateShapley(time));

    // Show result
    showResult();
  };

  const calculateReward = (time) => {
    // Reward is inversely proportional to the time taken to solve the puzzle (faster is better)
    return Math.max(1000 - time * 10, 0); // Example: Max reward of 1000, decreases with time
  };

  const calculateShapley = (time) => {
    // Simple example, complex logic can be added based on the puzzle's difficulty and time
    return Math.max(50 - time, 0);
  };

  const showResult = () => {
    alert(`Round: ${round}, Reward: ${reward} wei, Shapley Value: ${shapley}`);
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Puzzle Game</h2>
      {isPlaying ? (
        <div>
          <h3>{randomPuzzle.question}</h3>
          <TextField
            label="Your Answer"
            variant="outlined"
            value={playerAnswer}
            onChange={(e) => setPlayerAnswer(e.target.value)}
            fullWidth
            style={{ marginBottom: 20 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={submitAnswer}
            disabled={!playerAnswer}
            style={{ marginRight: 10 }}
          >
            Submit Answer
          </Button>
        </div>
      ) : (
        <div>
          <Button variant="contained" color="primary" onClick={startPuzzle}>
            Start Puzzle
          </Button>
        </div>
      )}

      {/* Show results after puzzle is solved */}
      {timeTaken !== null && (
        <div style={{ marginTop: 30 }}>
          <h3>Results</h3>
          <p>Time Taken: {timeTaken} seconds</p>
          <p>Reward: {reward} wei</p>
          <p>Shapley Value: {shapley}</p>
        </div>
      )}
    </div>
  );
};

export default PuzzleGame; // Ensure this is a default export
