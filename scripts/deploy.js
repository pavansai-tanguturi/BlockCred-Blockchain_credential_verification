const hre = require("hardhat");

async function main() {

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Credential = await hre.ethers.getContractFactory("Credential");

  // Deploy contract — deployer becomes the super-admin (owner)
  const credential = await Credential.deploy(deployer.address);

  await credential.deployed();

  console.log("Credential deployed to:", credential.address);

  // Register the deployer as the first university
  const tx = await credential.registerUniversity(deployer.address, "Default University");
  await tx.wait();
  console.log("Deployer registered as first university:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});