const Web3 = require('web3');
const readline = require('readline');
const { abi } = require('../build/contracts/Incentive.json');

// Configuration
const CONFIG = {
  PROVIDER_URL: 'ws://127.0.0.1:9545',
  ACCOUNT: '0x24d84F77357C9B0520a50090eBEE5b3f78dB6B42',
  CONTRACT_ADDRESS: '0xE7069c455d3185F631ED3615B0386e5F963fAeaf',
  GAS_LIMIT: 500000
};

// State
let web3;
let incentiveContract;
const transactionHistory = new Map();

async function initialize() {
  try {
    web3 = new Web3(new Web3.providers.WebsocketProvider(CONFIG.PROVIDER_URL));
    incentiveContract = new web3.eth.Contract(abi, CONFIG.CONTRACT_ADDRESS);
    console.log('✅ Connected to blockchain');
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

async function submitRound(round, reward, shapley) {
  try {
    const tx = incentiveContract.methods.submitRoundInfo(round, reward, shapley);
    const gas = await tx.estimateGas({ from: CONFIG.ACCOUNT });
    
    const receipt = await tx.send({
      from: CONFIG.ACCOUNT,
      gas: Math.min(gas * 2, CONFIG.GAS_LIMIT)
    });

    transactionHistory.set(round, {
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber
    });
    
    console.log(`\n✅ Round ${round} submitted`);
    console.log(`   TX Hash: ${receipt.transactionHash}`);
    console.log(`   Block: ${receipt.blockNumber}`);
    console.log(`   Gas used: ${receipt.gasUsed}`);

    return receipt;
  } catch (error) {
    console.error('❌ Submission failed:', error.message);
    throw error;
  }
}

async function getRoundDetails(round) {
  try {
    const record = await incentiveContract.methods.getLatestRecord(CONFIG.ACCOUNT).call();
    const txData = transactionHistory.get(round) || {};
    
    // Safe timestamp handling
    let timestamp = 'Not available';
    if (txData.blockNumber) {
      try {
        const block = await web3.eth.getBlock(txData.blockNumber);
        timestamp = block.timestamp ? new Date(block.timestamp * 1000).toISOString() : 'No block timestamp';
      } catch (e) {
        timestamp = 'Error fetching block';
      }
    }
    
    console.log(`\n📋 Round ${round} Details:`);
    console.log(`   TX Hash: ${txData.txHash || 'Pending'}`);
    console.log(`   Reward: ${record[1]}`);
    console.log(`   Shapley: ${record[2]}`);
    console.log(`   Timestamp: ${timestamp}`);
    
    return {
      txHash: txData.txHash,
      reward: record[1],
      shapley: record[2],
      timestamp
    };
  } catch (error) {
    console.error('❌ Fetch failed:', error.message);
    console.log('Raw record data:', record || 'Not available'); // Debug output
    throw error;
  }
}

function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  await initialize();
  
  while (true) {
    try {
      console.log('\n=== New Round Submission ===');
      const round = await prompt('Round number: ');
      const reward = await prompt('Reward (wei): ');
      const shapley = await prompt('Shapley value: ');

      await submitRound(parseInt(round), parseInt(reward), parseInt(shapley));
      await getRoundDetails(parseInt(round));
      
      console.log('\n📜 Transaction History:');
      transactionHistory.forEach((data, r) => {
        console.log(`   Round ${r}: ${data.txHash} (Block ${data.blockNumber || 'Pending'})`);
      });
    } catch (error) {
      console.log('Restarting interaction...');
    }
  }
}

process.on('SIGINT', () => {
  console.log('\n💾 Final Transaction History:');
  console.log(JSON.stringify(Object.fromEntries(transactionHistory), null, 2));
  process.exit();
});

main().catch(console.error);