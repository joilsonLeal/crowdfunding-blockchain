const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

const source = fs.readFileSync(campaignPath, "utf8");

fs.ensureDirSync(buildPath);

const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const contracts = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];

for (const contract in contracts) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract + ".json"),
    contracts[contract]
  );
}
