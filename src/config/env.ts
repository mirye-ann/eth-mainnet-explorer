const DEFAULT_ETHERSCAN_API_URL = "https://api.etherscan.io/api";

export const env = {
  etherscanApiUrl: process.env.ETHERSCAN_API_URL ?? DEFAULT_ETHERSCAN_API_URL,
} as const;

function getRequiredServerEnv(name: "ETHERSCAN_API_KEY") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required. Copy .env.example to .env.local and set the value.`);
  }

  return value;
}

export function getEtherscanEnv() {
  // Delay validation until the API client actually runs so the bootstrap app still builds cleanly.
  return {
    apiKey: getRequiredServerEnv("ETHERSCAN_API_KEY"),
    apiUrl: env.etherscanApiUrl,
  };
}
