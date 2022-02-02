import { useEffect, useState } from 'react'
import { nftaddress, marketplaceaddress } from '../config'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import NFT from '../contract-abis/NFT.json'
import Marketplace from '../contract-abis/Marketplace.json'
import Wallet from '../components/Wallet'

const url: string | any = 'https://ipfs.infura.io:5001/api/v0'
const client = create(url)

const Contracts = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [connected, setConnected] = useState<boolean>(false)
  const [chainId, setChainId] = useState<string>('')
  const [nftContract, setNftContract] = useState({})
  const [marketContract, setMarketContract] = useState({})
  const [signer, setSigner] = useState<any>()
  const [fileUrl, setFileUrl] = useState('')

  const initialiseContracts = async () => {
    if (signer != undefined) {
      const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
      const marketContract = new ethers.Contract(
        marketplaceaddress,
        Marketplace.abi,
        signer
      )
      console.log('nft: ', nftContract)
      console.log('marketplace: ', marketContract)
      setNftContract(nftContract)
      setMarketContract(marketContract)
    } else {
      console.log('connect metamask')
    }
  }

  const onFileUpload = async (e: any) => {
    const file = e.target.files[0]
    try {
      const addedFile = await client.add(file)
      const url = `https://ipfs.infura.io/ipfs/${addedFile.path}`
      console.log('ipfs url: ', url)
      setFileUrl(url)
    } catch (e) {
      console.error('Error uploading file: ', e)
    }
  }

  useEffect(() => {
    initialiseContracts()
  }, [walletAddress])

  return (
    <div className="text-white">
      Contract initializing
      <Wallet
        setWalletAddress={setWalletAddress}
        setSigner={setSigner}
        setConnected={setConnected}
        setChainId={setChainId}
        chainId={chainId}
        connected={connected}
        signer={signer}
      />
    </div>
  )
}

export default Contracts
