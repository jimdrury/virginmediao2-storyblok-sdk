module.exports = {
  "*.{ts,tsx,js,jsx}": ["biome check --write --no-errors-on-unmatched"],
  "*.{json,md}": ["biome format --write --no-errors-on-unmatched"],
};
