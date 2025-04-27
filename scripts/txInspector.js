// scripts/txInspector.js
const BN = require('bn.js');

module.exports = async function(txHash) {
  const web3 = global.web3; // Truffle-provided web3 instance
  const tx = await web3.eth.getTransaction(txHash);
  const receipt = await web3.eth.getTransactionReceipt(txHash);

  console.log(`
📜 Transaction Inspector
-----------------------------
TX Hash: ${txHash}
Block: ${tx.blockNumber || 'Pending'}
From: ${tx.from}
To: ${tx.to || 'Contract Creation'}
Value: ${web3.utils.fromWei(tx.value)} ETH
Gas Used: ${receipt.gasUsed}
Status: ${receipt.status ? '✅ Success' : '❌ Failed'}
`);

  // Decode logs if to a known contract
  if (receipt.to) {
    try {
      const contractName = 'Incentive'; // Change to your contract name
      const contract = await artifacts.require(contractName).deployed();
      const contractAbi = contract.abi;

      for (const log of receipt.logs) {
        try {
          const eventAbi = contractAbi.find(
            e => e.type === 'event' && 
            log.topics[0] === web3.utils.sha3(`${e.name}(${e.inputs.map(i => i.type).join(',')})`)
          );

          if (eventAbi) {
            const decoded = web3.eth.abi.decodeLog(
              eventAbi.inputs,
              log.data,
              log.topics.slice(1)
            );
            
            // Convert BN to readable strings
            const formatted = {};
            eventAbi.inputs.forEach((input, i) => {
              let value = decoded[i];
              if (value && value.constructor.name === 'BN') {
                value = input.type.startsWith('uint') ? 
                  value.toString() : 
                  web3.utils.fromWei(value, 'ether');
              }
              formatted[input.name || `param_${i}`] = value;
            });

            console.log(`\n🔔 ${eventAbi.name} Event:`);
            console.log(JSON.stringify(formatted, null, 2));
          }
        } catch (e) {
          console.log(`⚠️ Could not decode log: ${e.message}`);
        }
      }
    } catch (e) {
      console.log('ℹ️ No contract ABI found for address:', receipt.to);
    }
  }
}
