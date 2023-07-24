module.exports = {
  '*.{js,jsx,ts,tsx}': ['pnpm conventions'],
  '**/*.ts?(x)': () => 'pnpm build:types',
  '*.json': ['prettier --write --ignore-unknown']
};
