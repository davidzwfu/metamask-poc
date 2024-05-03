import { FormEvent } from 'react'
import { erc721Abi, parseEther } from 'viem'
import {
  UseAccountReturnType,
  useAccount,
  useBalance,
  useConnect,
  useDisconnect,
  useReadContracts,
  useSendTransaction,
  useWriteContract,
} from 'wagmi'

const NFT_CONTRACT_ADDRESS: `0x${string}` = '0x930558574Ad29f697407c57506A427C85243247E'

function App() {
  const account = useAccount()

  return (
    <>
      <Connectors />
      <Account account={account} />
      <ReadContract
        contractAddress={NFT_CONTRACT_ADDRESS} 
        walletAddress={account.addresses?.at(0)} 
      />
      <WriteContract 
        walletAddress={account.addresses?.at(0)} 
      />
      <SendTransaction />
    </>
  )
}

function Connectors() {
  const { connectors, connect } = useConnect()

  return (
    <div>
      <h2>Connectors</h2>
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          type="button"
        >
          {connector.id}
        </button>
      ))}
    </div>
  )
}

function Account({ 
  account 
}: { 
  account: UseAccountReturnType 
}) {
  const { data: balance } = useBalance({
    address: account.addresses?.at(0)
  })
  const { disconnect } = useDisconnect()

  return (
    <div>
      <h2>Account</h2>

      <div>Status: {account.status}</div>
      <div>Addresses: {JSON.stringify(account.addresses)}</div>
      <div>Chain: {account.chain?.name} ({account.chainId})</div>
      <div>Balance: {balance?.formatted} {balance?.symbol}</div>

      {account.status === 'connected' && (
        <button type="button" onClick={() => disconnect()}>
          Disconnect
        </button>
      )}
    </div>
  )
}

function ReadContract({ 
  contractAddress, walletAddress 
}: {
  contractAddress: `0x${string}`
  walletAddress?: `0x${string}`
}) {
  const { data } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        address: contractAddress,
        abi: erc721Abi,
        functionName: 'name',
      },
      {
        address: contractAddress,
        abi: erc721Abi,
        functionName: 'totalSupply',
      },
      ...walletAddress ? [
        {
          address: contractAddress,
          abi: erc721Abi,
          functionName: 'balanceOf',
          args: [walletAddress],
        }
      ] : [],
    ],
  })
  const [collectionName, totalSupply, userBalance] = data ?? []

  return (
    <div>
      <h2>Read Contract (Get NFT Details)</h2>
      <div>Collection name: {collectionName?.toString()}</div>
      <div>Contract address: {contractAddress}</div>
      <div>Total supply: {totalSupply?.toString()}</div>
      <div>User's balance: {userBalance?.toString()}</div>
    </div>
  )
}

function WriteContract({
  walletAddress 
}: {
  walletAddress?: `0x${string}`
}) {
  const { data: hash, writeContract } = useWriteContract()

  async function transferNft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    const contractAddress = formData.get('contractAddress') as `0x${string}`
    const tokenId = BigInt(formData.get('tokenId') as string)

    writeContract({
      address: contractAddress,
      abi: erc721Abi,
      functionName: 'transferFrom',
      args: [
        walletAddress as `0x${string}`,
        contractAddress,
        tokenId,
      ],
    })
  }

  return (
    <>
      <h2>Write Contract (Transfer NFT)</h2>

      <form onSubmit={(event) => transferNft(event)}>
        <div>
          <div>Smart contract address:</div>
          <input name="contractAddress" defaultValue={'0x...'} />
        </div>
        <div>
          <div>Token ID:</div>
          <input name="tokenId"/>
        </div>

        <button type="submit">Submit</button>
        <div>Transaction hash: {hash}</div>
      </form>
    </>
  )
}

function SendTransaction() {
  const { sendTransaction } = useSendTransaction()

  function transferFunds(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    sendTransaction({
      to: formData.get('contractAddress') as `0x${string}`,
      value: parseEther(formData.get('amount') as string),
    })
  }

  return (
    <>
      <h2>Send Transaction (Transfer Funds)</h2>

      <form onSubmit={(event) => transferFunds(event)}>
        <div>
          <div>Smart contract address:</div>
          <input name="contractAddress" defaultValue={'0x...'} />
        </div>
        <div>
          <div>Amount (in ETH):</div>
          <input name="amount" defaultValue={1} />
        </div>

        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default App
