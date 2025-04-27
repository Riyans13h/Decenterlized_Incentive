// src/components/PuzzleGame.jsx
import React, { useState } from 'react';

const puzzles = {
  Easy: [
    { question: "What is 2 + 2?", answer: "4" },
    { question: "Unscramble: 'TCA'", answer: "CAT" },
    { question: "What color is the sky?", answer: "Blue" },
    { question: "What comes after 5?", answer: "6" },
    { question: "How many legs does a cat have?", answer: "4" },
    { question: "Unscramble: 'OGD'", answer: "DOG" },
    { question: "What is the first letter of 'Banana'?", answer: "B" },
    { question: "What color are bananas?", answer: "Yellow" }
  ],
  Medium: [
    { question: "What is 7 x 6?", answer: "42" },
    { question: "Unscramble: 'PAELP'", answer: "APPLE" },
    { question: "What comes next: 3, 6, 9, ?", answer: "12" },
    { question: "What is 15 - 7?", answer: "8" },
    { question: "Unscramble: 'CNOUMTPER'", answer: "COMPUTER" },
    { question: "What is 11 x 11?", answer: "121" },
    { question: "What comes next: 5, 10, 20, ?", answer: "40" },
    { question: "Unscramble: 'LOOCHS'", answer: "SCHOOL" }
  ],
  Hard: [
    { question: "Unscramble: 'NOITAZAGIN'", answer: "ORGANIZATION" },
    { question: "What is 17 x 13?", answer: "221" },
    { question: "What comes next: 2, 4, 8, 16, ?", answer: "32" },
    { question: "Unscramble: 'YTIROIRP'", answer: "PRIORITY" },
    { question: "Solve: 35 x 24", answer: "840" },
    { question: "Unscramble: 'NIIMNTLIOA'", answer: "ILLUMINATION" },
    { question: "What is 144 ÷ 12?", answer: "12" },
    { question: "Unscramble: 'AGMNREO'", answer: "MANAGER" }
  ]
};

export default function PuzzleGame({ onFinish }) {
  const [difficulty, setDifficulty] = useState('Easy');
  const [currentPuzzle, setCurrentPuzzle] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);
  const [round, setRound] = useState(1);

  const startNewPuzzle = () => {
    const puzzleList = puzzles[difficulty];
    const randomPuzzle = puzzleList[Math.floor(Math.random() * puzzleList.length)];
    setCurrentPuzzle(randomPuzzle);
    setUserAnswer('');
    setStartTime(Date.now());
    setResult(null);
  };

  const submitAnswer = () => {
    if (!currentPuzzle) return;
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000; // seconds
    const isCorrect = userAnswer.trim().toLowerCase() === currentPuzzle.answer.toLowerCase();

    if (isCorrect) {
      const reward = Math.max(1000 - Math.floor(timeTaken * 50), 100); // Reward calculation
      const shapley = Math.max(100 - Math.floor(timeTaken * 5), 10); // Shapley calculation
      setResult({ success: true, timeTaken, reward, shapley });

      if (onFinish) {
        onFinish({ round, reward, shapley });
      }
      setRound(prev => prev + 1);
    } else {
      setResult({ success: false, timeTaken });
    }
  };

  return (
    <div style={styles.container}>
      <h2>🧩 Puzzle Game</h2>

      <div style={styles.selector}>
        <label>Select Difficulty: </label>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={styles.select}>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button onClick={startNewPuzzle} style={styles.button}>🎯 Start New Puzzle</button>
      </div>

      {currentPuzzle && (
        <div style={styles.puzzle}>
          <h3>🔹 Puzzle: {currentPuzzle.question}</h3>
          <input
            type="text"
            placeholder="Your answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            style={styles.input}
          />
          <br />
          <button onClick={submitAnswer} style={styles.submitButton}>Submit Answer ✅</button>
        </div>
      )}

      {result && (
        <div style={styles.result}>
          {result.success ? (
            <>
              <h3>🎉 Correct!</h3>
              <p>⏱ Time Taken: {result.timeTaken.toFixed(2)} seconds</p>
              <p>💰 Reward: {result.reward}</p>
              <p>⭐ Shapley Value: {result.shapley}</p>
            </>
          ) : (
            <>
              <h3>❌ Incorrect!</h3>
              <p>⏱ Time Taken: {result.timeTaken.toFixed(2)} seconds</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    width: '400px',
    margin: '20px auto',
    background: '#f9f9f9'
  },
  selector: {
    marginBottom: '15px'
  },
  select: {
    margin: '0 10px',
    padding: '5px'
  },
  button: {
    padding: '5px 10px',
    backgroundColor: '#6c63ff',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  },
  puzzle: {
    marginTop: '20px'
  },
  input: {
    padding: '8px',
    width: '80%',
    marginTop: '10px'
  },
  submitButton: {
    marginTop: '10px',
    padding: '8px 12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px'
  },
  result: {
    marginTop: '20px'
  }
};
