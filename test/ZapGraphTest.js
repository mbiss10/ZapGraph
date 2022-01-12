const { assert } = require("chai");
const { ethers } = require("hardhat");
const keccak256 = require("keccak256");

describe("ZapGraph", function () {
  let ZapGraph;
  let signer;
  let signee;
  let signerAddress;
  let signeeAddress;
  let timestamp = 1641217908;

  before(async () => {
    signer = await ethers.getSigner(0);
    signerAddress = signer.address;
    signee = await ethers.getSigner(1);
    signeeAddress = signee.address;
    console.log("signerAddress: ", signerAddress);
    console.log("signeeAddress: ", signeeAddress);
  });

  beforeEach(async () => {
    const ZapGraphFactory = await ethers.getContractFactory("ZapGraph");
    ZapGraph = await ZapGraphFactory.deploy();
    await ZapGraph.deployed();
  });

  it("Should verify a correct signature", async function () {
    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ["string", "uint", "string", "address"],
      ["timestamp:", timestamp, " signee:", signeeAddress]
    );

    console.log("encodedData: ", encodedData);
    const hashedEncodedData = keccak256(encodedData);
    console.log("hashedEncodedData: ", hashedEncodedData);

    const signature = await signer.signMessage(hashedEncodedData);
    console.log("ethers signature: ", signature);

    console.log("---- \n SOLIDITY");
    const res = await ZapGraph.connect(signee).verifySignature(
      timestamp,
      signerAddress,
      signature
    );
    assert(res);
  });

  it("Should not verify a signature meant for a different signee", async function () {
    const signer3 = await ethers.getSigner(2);

    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ["string", "uint", "string", "address"],
      ["timestamp:", timestamp, " signee:", signeeAddress]
    );

    const hashedEncodedData = keccak256(encodedData);
    const signature = await signer.signMessage(hashedEncodedData);
    const res = await ZapGraph.connect(signer3).verifySignature(
      timestamp,
      signerAddress,
      signature
    );

    assert(!res);
  });

  it("Should not verify a signature with the wrong timestamp", async function () {
    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ["string", "uint", "string", "address"],
      ["timestamp:", timestamp - 1000, " signee:", signeeAddress]
    );

    const hashedEncodedData = keccak256(encodedData);
    const signature = await signer.signMessage(hashedEncodedData);
    const res = await ZapGraph.connect(signee).verifySignature(
      timestamp,
      signerAddress,
      signature
    );

    assert(!res);
  });

  it("Should allow signers to set time allotments", async function () {
    await ZapGraph.connect(signer).setAllotment(50);
    const allotment = await ZapGraph.timeAllotments(signerAddress);
    assert(allotment == 50);
  });

  it("Should not verify a signature with an expired timestamp", async function () {
    let timestamp = 100;
    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ["string", "uint", "string", "address"],
      ["timestamp:", timestamp, " signee:", signeeAddress]
    );
    const hashedEncodedData = keccak256(encodedData);
    const signature = await signer.signMessage(hashedEncodedData);
    await ZapGraph.connect(signer).setAllotment(1);
    let err;
    try {
      await ZapGraph.connect(signee).purchase(
        timestamp,
        signerAddress,
        signature,
        "0x0"
      );
    } catch (_err) {
      err = _err;
    }

    assert(err);
  });

  it("Should allow a signer to set a price", async () => {
    const startPrice = await ZapGraph.prices(signerAddress);
    assert(startPrice == 0);
    await ZapGraph.connect(signer).setPrice(ethers.utils.parseEther("1"));
    const newPrice = await ZapGraph.prices(signerAddress);
    assert(newPrice > startPrice);
  });

  it("Should transfer funds to signer upon a valid purchase", async () => {
    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ["string", "uint", "string", "address"],
      ["timestamp:", timestamp, " signee:", signeeAddress]
    );
    const hashedEncodedData = keccak256(encodedData);
    const signature = await signer.signMessage(hashedEncodedData);

    const overrides = {
      value: ethers.utils.parseEther("1"),
    };

    const startBalance = await signer.getBalance();
    await ZapGraph.connect(signee).purchase(
      timestamp,
      signerAddress,
      signature,
      0x0,
      overrides
    );
    const newBalance = await signer.getBalance();
    assert(newBalance.gt(startBalance));
  });
});
