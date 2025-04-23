const Incentive = artifacts.require("Incentive");

contract("Incentive", accounts => {
  it("should register a client and submit round information", async () => {
    const incentive = await Incentive.deployed();

    // Register client
    await incentive.registerClient(100, { from: accounts[0] });

    // Check client details
    const clientDetails = await incentive.getClientDetails(accounts[0]);
    assert.equal(clientDetails[0], 100, "Stake should be 100");
    assert.equal(clientDetails[1], true, "Client should be registered");

    // Submit round info
    await incentive.submitRoundInfo(1, 0, 50, 1000, { from: accounts[0] });
    
    // Check reward after submission
    const updatedClient = await incentive.getClientDetails(accounts[0]);
    assert.equal(updatedClient[2], 50, "Reward should be 50");
  });
});
