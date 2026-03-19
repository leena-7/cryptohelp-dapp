import { ethers } from "ethers";
import * as dotenv from "dotenv";
import * as fs from "fs";
import { createRequire } from "module";

dotenv.config();

const require = createRequire(import.meta.url);

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

  console.log("Deploying from address:", wallet.address);

  // Load artifact
  const artifact = require("../artifacts/contracts/CrowdFunding.sol/Crowdfunding.json");

  // Deploy
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ Crowdfunding deployed to:", address);
}

main().catch(console.error);