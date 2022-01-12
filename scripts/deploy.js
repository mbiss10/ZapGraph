const { ethers } = require("hardhat");

async function main() {
  const ZapGraph = await ethers.getContractFactory("ZapGraph");
  const zapgraph = await ZapGraph.deploy();
  await zapgraph.deployed();

  console.log("Contract deployed to:", zapgraph.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
