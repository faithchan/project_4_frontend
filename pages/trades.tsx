import { useEffect, useState } from 'react'
import TradeCard from '../components/TradeCard'
import { nftaddress, marketplaceaddress } from '../config'
import { ethers, Wallet } from 'ethers'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'
import Web3Modal from 'web3modal'

const Trades = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [signer, setSigner] = useState<any>()
  const [nftContract, setNftContract] = useState<any>()
  const [marketplaceContract, setMarketplaceContract] = useState<any>()

  const fetchNFTsOwned = async () => {
    const totalSupply = await nftContract.totalSupply()
    const ownerTokens = []
    console.log('supply: ', totalSupply)
    for (let i = 0; i < totalSupply; i++) {
      const owner = await nftContract.ownerOf(i)
      if (owner === walletAddress) {
        ownerTokens.push(i)
      }
    }
    console.log('ownertokens: ', ownerTokens)
    for (let i in ownerTokens) {
      const uri = await nftContract.tokenURI(i)
      console.log('uri: ', uri)
    }
  }

  const fetchMarketItems = async () => {
    const owner = await marketplaceContract.owner()
    console.log('owner: ', owner)
  }

  const initialiseContract = async () => {
    if (signer != undefined) {
      const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
      const marketplaceContract = new ethers.Contract(marketplaceaddress, Marketplace.abi, signer)
      setNftContract(nftContract)
      setMarketplaceContract(marketplaceContract)
      console.log('nft contract: ', nftContract)
    }
  }

  const changeNetwork = async () => {
    try {
      if (!window.ethereum) throw new Error('No crypto wallet found')
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      })
    } catch (err: any) {
      console.log('error changing network: ', err.message)
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.chainId !== '0x4') {
        console.log('switch to rinkeby network')
        changeNetwork()
      } else {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const connectedAddress = await signer.getAddress()
        console.log('Connected Wallet: ', connectedAddress)
        console.log('signer: ', signer)
        localStorage.setItem('walletAddress', connectedAddress)
        setSigner(signer)
        setWalletAddress(connectedAddress)
      }
    } else {
      alert('Please install Metamask')
    }
  }

  useEffect(() => {
    if (nftContract) {
      fetchNFTsOwned()
      fetchMarketItems()
    }
  }, [nftContract])

  useEffect(() => {
    initialiseContract()
  }, [walletAddress])

  useEffect(() => {
    connectWallet()
  }, [])

  return (
    <div className="my-20 mx-32">
      <div className="flex flex-wrap gap-10 justify-center">
        <TradeCard />
        <TradeCard />
        <TradeCard />
        <TradeCard />
      </div>
    </div>
  )
}

export default Trades
