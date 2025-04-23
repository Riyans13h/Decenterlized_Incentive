module.exports = async function (callback) {
    try {
      const txHash = "0xYourTransactionHashHere";
  
      const tx = await web3.eth.getTransaction(txHash);
      console.log("Transaction:", tx);
  
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      console.log("Receipt:", receipt);
  
      if (receipt.logs.length > 0) {
        console.log("Logs:");
        receipt.logs.forEach((log, i) => {
          console.log(`Log ${i + 1}:`, log);
        });
      } else {
        console.log("No logs emitted.");
      }
  
      callback();
    } catch (err) {
      console.error(err);
      callback(err);
    }
  };
  