import { useEffect, useState, useContext } from 'react'
import TradeCard from '../components/TradeCard'
import globalContext from '../context/context'
import { nftaddress, marketplaceaddress } from '../config'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

const Trades = () => {
  const context = useContext(globalContext)
  const [tokenURIs, setTokenURIs] = useState<any>([])

  const fetchNFTsOwned = async () => {
    const totalSupply = await context.nftContract.totalSupply()
    const ownerTokens = []
    for (let i = 0; i < totalSupply; i++) {
      const owner = await context.nftContract.ownerOf(i)
      if (owner === context.walletAddress) {
        ownerTokens.push(i)
      }
    }
    console.log('owner tokens: ', ownerTokens)
    for (let i in ownerTokens) {
      const uri = await context.nftContract.tokenURI(i)
      const response = await fetch(uri)
      if (!response.ok) throw new Error(response.statusText)
      const data = await response.json()
      console.log('data: ', data)
      setTokenURIs([...tokenURIs, data])
    }
  }

  const burnToken = async (tokenId: number) => {
    if (context.nftContract) {
      const owner = await context.nftContract.ownerOf(tokenId)
      const creator = await context.nftContract.tokenCreator(tokenId)
      if (owner !== context.walletAddress || creator !== context.walletAddress) {
        alert('You do not have the permission to burn this token')
        return
      } else {
        console.log(`burning token ${tokenId}...`)
        await context.nftContract.burn(tokenId)
        console.log('token burned')
      }
    }
  }

  const checkApproval = async () => {
    if (context.nftContract) {
      // console.log(
      //   `checking approval for marketplace ${marketplaceaddress} for user ${walletAddress}`
      // )
      const status = await context.nftContract.isApprovedForAll(
        context.walletAddress,
        marketplaceaddress
      )
      console.log('approval status: ', status)
    }
  }

  const setApproval = async () => {
    if (context.nftContract) {
      console.log(`setting approval for operator ${marketplaceaddress}`)
      await context.nftContract.setApprovalForAll(marketplaceaddress, true)
    }
  }

  const fetchMarketItems = async () => {
    const ownedItems = await context.marketplaceContract.getItemsOwned()
    const listedItems = await context.marketplaceContract.getListedItems()
    // console.log('owned items: ', ownedItems)
    // console.log('listed items: ', listedItems)
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
        context.setSigner(signer)
        context.setWalletAddress(connectedAddress)
      }
    } else {
      alert('Please install Metamask')
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

  useEffect(() => {
    if (context.nftContract) {
      fetchNFTsOwned()
      fetchMarketItems()
      checkApproval()
    }
  }, [context.nftContract])

  useEffect(() => {
    if (context.signer === null) {
      connectWallet()
    }
  }, [context.walletAddress])

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
