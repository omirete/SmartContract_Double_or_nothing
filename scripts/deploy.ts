import { ethers } from "hardhat";
const fs = require("fs");
const path = require("path");

async function main() {
  //   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  const DoubleOrNothing = await ethers.getContractFactory("DoubleOrNothing");
  const double_or_nothing = await DoubleOrNothing.deploy();

  await double_or_nothing.deployed();

  console.log(`DoubleOrNothing deployed to ${double_or_nothing.address}`);
  const dir = path.resolve(
    __dirname,
    "../artifacts/contracts/DoubleOrNothing.sol/DoubleOrNothing.json"
  );

  const file = fs.readFileSync(dir, "utf8");
  const json = JSON.parse(file);
  const abi = json.abi;
  fs.writeFile(
    "src/abi/DoubleOrNothing.json",
    JSON.stringify(abi),
    (error: any) => {
      if (error) throw error;
    }
  );

  return abi;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
