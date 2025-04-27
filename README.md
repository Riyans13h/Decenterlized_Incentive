# Decenterlized_Incentive
# Collaborative Puzzle Game

A decentralized puzzle-solving game where players collaborate to solve challenges, earn rewards, and receive badges based on their contributions. The game uses a **blockchain-based incentive system** to calculate rewards and distribute Shapley values, which are used to determine player contributions.

---

## Tech Stack

### Frontend:
- **React.js**: A JavaScript library for building user interfaces. Used for creating dynamic and interactive UIs.
- **CSS**: For styling the app, creating a clean and responsive layout.
- **Web3.js**: A JavaScript library used to interact with the Ethereum blockchain, allowing the frontend to communicate with smart contracts and read/write data.
- **MetaMask**: A browser extension wallet that allows users to interact with the Ethereum blockchain directly from the frontend.

### Blockchain:  
**Ethereum**: The decentralized blockchain platform used for deploying the smart contract and handling decentralized logic.
 - **Ganache** (Optional): A personal blockchain for Ethereum development used to test and deploy contracts locally.

---

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MetaMask extension (for interacting with the blockchain)
- Ethereum wallet (for deploying the contract and interacting with it)

### Frontend Setup:

1.  ### Clone the repository:
  //```bash
  git clone https://github.com/your-usernmae/collaborative-puzzle-game.git
  cd collaborative-puzzle-game
 cd frontend


2. ### Install dependencies:

    npm install

    Set up your Ethereum provider and smart contract:

    Ensure that you have MetaMask installed and connected to the correct network (such as Rinkeby or Mainnet).

    Deploy your smart contract to the network (use Truffle or Hardhat for deployment).

    Copy the contract address and update it in your environment variables.



 3.   ### Set up environment variables:

      In the frontend directory, create a .env file with the following contents:

      REACT_APP_WEB3_PROVIDER_URL=https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID
      REACT_APP_CONTRACT_ADDRESS=0xYourSmartContractAddress

4.  ### Start the frontend development server:

    npm start

    The frontend should now be accessible at http://localhost:3000.

5.   ### Smart Contracts
     Contract Overview:

      The smart contract deployed on the Ethereum blockchain manages the game's incentive and reward system. It tracks player contributions,            Shapley values, and distributes rewards accordingly. The contract also stores badges, which players earn based on their achievements.

      The contract uses Solidity for the logic of:

      Submitting round information (time taken, reward earned, Shapley value)

       Calculating rewards

       Issuing badges to players based on their achievements

       Contract is deployed on Ethereum and interacts with the frontend using Web3.js.

6.  ### Features

    Puzzle Game: Players can join a game, collaborate to solve puzzles, and submit their results.

    Rewards System: Players are awarded based on their contributions, with rewards automatically calculated.

    Shapley Value: Calculates and distributes rewards fairly based on each player's contribution to the puzzle.

    Badges: Players earn badges as they reach certain milestones (e.g., Puzzle Expert, Master Solver).

    Blockchain Integration: Smart contracts store round data and rewards, ensuring transparency and trust in the game.

    User Profile: Players can view their rewards and badges on their profile page.

 7.  ### Future Enhancements

     AI Puzzles: Integrating AI-driven puzzles that get more complex as players progress.
 
     Leaderboard: A global leaderboard to track the top players based on rewards earned.

     Multiplayer Support: Allow multiple players to join the same puzzle game for collaborative play.
