module.exports = {
  '*.{js,ts,tsx,json}': 'prettier --write --config ./.prettierrc',
  '*.{js,ts,tsx}': 'eslint --fix'
};
