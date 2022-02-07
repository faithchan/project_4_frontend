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
  const [marketContract, setMarketContract] = useState({})

  return <div className="text-white">Contract initializing</div>
}

export default Contracts
