# MetaMask PoC
NFT dApp implemented with wagmi and MetaMask SDK

- MetaMask SDK connector is configured in `wagmi.ts` with Infura API key pulled from `.env.local`
- Features implemented in `App.tsx`
  - Supports multiple wallets: MetaMask, WalletConnect, Coinbase
  - Show connected account and chain information
  - Read NFT details from ERC721 token ABI
  - Transfer NFT token to smart contract address
  - Transfer funds to smart contract address

This is a [Vite](https://vitejs.dev) project bootstrapped with [`create-wagmi`](https://github.com/wevm/wagmi/tree/main/packages/create-wagmi).
