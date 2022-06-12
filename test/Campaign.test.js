const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

const MINIMUN_VALUE = '1000000';
let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({
      data: compiledFactory.evm.bytecode.object,
    })
    .send({ gas: "2000000", from: accounts[0] });

  await factory.methods.createCampaign(MINIMUN_VALUE)
    .send({
      from: accounts[0],
      gas: '2000000'
    });

 [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

 campaign = await new web3.eth.Contract(
   compiledCampaign.abi,
   campaignAddress
 );
});

describe("Campaign Tests", () => {
  it("Should deploy contracts", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("Should have a manager", async () => {
    assert.equal(accounts[0], await campaign.methods.owner().call());
  });

  it("Should have one approve", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      gas: "1000000",
      value: MINIMUN_VALUE,
    });

    assert(!(await campaign.methods.approvers(accounts[2]).call()));
    assert(await campaign.methods.approvers(accounts[1]).call());
  });

  it("Should throw an error if value of contribution is less than minimum value", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        gas: "1000000",
        value: "20",
      });
      assert(false);
    } catch (e) {
      assert.ok(e);
    }
  });

  it("Should allow manager to create a payment request", async () => {
    await campaign.methods
      .createRequest("Buy battery", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const request = await campaign.methods.requests(0).call();
    assert.ok("Buy battery", request.description);
  });

  it("Should end to end testing", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      gas: "1000000",
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods.contribute().send({
      from: accounts[2],
      gas: "1000000",
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest(
        "Buy battery",
        web3.utils.toWei("10", "ether"),
        accounts[3]
      )
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const initialBalance = await web3.eth.getBalance(accounts[3]);

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    const finalBalance = await web3.eth.getBalance(accounts[3]);
    const differenceBalance = finalBalance - initialBalance;
    assert(differenceBalance > web3.utils.toWei("5", "ether"));
  });
});
