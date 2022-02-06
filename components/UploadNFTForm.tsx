import { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import Wallet from '../components/Wallet'
import { nftaddress } from '../config'
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import NFT from '../contract-abis/NFT.json'

const url: string | any = 'https://ipfs.infura.io:5001/api/v0'
const client = create(url)

interface Metadata {
  name: string
  description: string
  imageUrl: string
}

const UploadNFTForm = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [connected, setConnected] = useState<boolean>(false)
  const [signer, setSigner] = useState<any>()
  const [nftContract, setNftContract] = useState<any>()
  const [fileName, setFileName] = useState('')
  const [metadata, setMetadata] = useState({ name: '', description: '', imageUrl: '' })

  const mintToken = async () => {
    console.log('nft contract: ', nftContract)
    if (!metadata.name || !metadata.description || !metadata.imageUrl) {
      alert('Please do not leave any fields blank.')
      return
    }
    await createNFTMetadata()
    const mintTxn = await nftContract.mint(metadata, walletAddress)
    const txn = await mintTxn.wait()
    const id = await txn.events[0].args[3]
    console.log('tokenId: ', id)
  }

  const createNFTMetadata = async () => {
    try {
      const { cid } = await client.add({ path: `${fileName}`, content: JSON.stringify(metadata) })
      console.log('cid: ', cid)
      const url = `https://ipfs.infura.io/ipfs/${cid}`
      console.log('token URI: ', url)
    } catch (err) {
      console.error('Error posting metadata to IPFS.')
    }
  }

  const initialiseContract = async () => {
    if (signer != undefined) {
      const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
      setNftContract(nftContract)
    }
  }

  const onFileUpload = async (e: any) => {
    const file = e.target.files[0]
    setFileName(file.name)
    try {
      console.log(`adding ${file.name} to ipfs....`)
      const { cid } = await client.add(
        { content: file },
        {
          cidVersion: 1,
          hashAlg: 'sha2-256',
        }
      )
      console.log('cid: ', cid)
      const url = `https://ipfs.infura.io/ipfs/${cid}`
      // console.log('ipfs url: ', url)
      setMetadata({ ...metadata, imageUrl: url })
    } catch (e) {
      console.error('Error uploading file: ', e)
    }
  }

  const handleInputChange = (event: any) => {
    const name = event.target.name
    const value = event.target.value
    setMetadata({ ...metadata, [name]: value })
  }

  const addTokenToDatabase = async () => {}

  useEffect(() => {
    initialiseContract()
  }, [walletAddress])

  useEffect(() => {
    let token = localStorage.getItem('token')
    let tempToken: any = token
    if (tempToken) {
      let decodedToken: any = jwtDecode(tempToken)
      setLoggedIn(true)
    }
  }, [])

  if (!loggedIn) {
    return (
      <div className="flex items-center justify-center mt-10 mb-20">
        <div className="text-white">Please Log In</div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center mt-10 mb-20">
      <div className="grid w-6/12 md:w-5/12 lg:w-4/12">
        <div className="grid grid-cols-1  mx-7">
          <label className="md:text-sm text-xs text-white font-body tracking-wider">Name</label>
          <input
            className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
            type="text"
            placeholder="Silo"
            name="name"
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-1 mt-5 mx-7">
          <label className="md:text-sm text-xs text-white font-body tracking-wider">
            Description
          </label>
          <textarea
            className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
            placeholder="Brief write up about NFT"
            name="description"
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-1 mt-5 mx-7">
          <label className="md:text-sm text-xs text-white font-body tracking-wider">Price</label>
          <input
            className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
            type="text"
            placeholder="0.01 Eth"
          />
        </div>

        <div className="grid grid-cols-1 mt-5 mx-7">
          <label className="md:text-sm text-xs text-white font-body tracking-wider">
            Upload Photo
          </label>
          <div className="flex items-center justify-center w-full mt-2">
            <label className="flex flex-col border-2 border-dashed w-full rounded-lg h-32 group">
              <div className="flex flex-col items-center justify-center pt-7 cursor-pointer">
                <svg
                  className="w-10 h-10 text-purple-400 group-hover:text-purple-600"
                  fill="none"
                  stroke="white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <p className="lowercase text-sm text-white group-hover:text-purple-600 pt-1 tracking-wider">
                  Select a photo
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".jpeg,.jpg,.png,.gif"
                onChange={onFileUpload}
              />
            </label>
          </div>
        </div>
        <div className="flex items-center justify-center pt-5 pb-5">
          <Wallet
            setWalletAddress={setWalletAddress}
            setSigner={setSigner}
            setConnected={setConnected}
            isConnected={connected}
          />
          <button
            className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
            onClick={mintToken}
          >
            MINT TOKEN
          </button>
        </div>
      </div>
    </div>
  )
}

export default UploadNFTForm
