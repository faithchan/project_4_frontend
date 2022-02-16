import { useEffect, useState, useContext } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import jwtDecode from 'jwt-decode'
import globalContext from '../context/context'
import { create } from 'ipfs-http-client'
import { useRouter } from 'next/router'

const url: string | any = 'https://ipfs.infura.io:5001/api/v0'
const client = create(url)

const UploadNFTForm = () => {
  const context = useContext(globalContext)
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [fileName, setFileName] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [metadata, setMetadata] = useState({ name: '', description: '', image: '' })

  const mintToken = async () => {
    if (context.signer) {
      if (await checkWhitelist()) {
        if (!metadata.name || !metadata.description || !metadata.image) {
          alert('Please do not leave any fields blank.')
          return
        }
        const { cid } = await client.add({ path: `${fileName}`, content: JSON.stringify(metadata) })
        const uri = `https://ipfs.infura.io/ipfs/${cid}`
        console.log('token URI: ', uri)
        const mintTxn = await context.nftContract.mint(context.walletAddress, uri)
        const txn = await mintTxn.wait()
        console.log('txn: ', txn)
        const id = txn.events[0].args['tokenId']
        const idNum = id.toNumber()
        console.log('tokenId: ', idNum)
        router.push('/trades')
      } else {
        alert('This wallet address is not whitelisted')
        return
      }
    } else {
      alert('Please connect your Metamask wallet')
    }
  }

  const checkWhitelist = async () => {
    if (context.nftContract) {
      const whitelisted = await context.nftContract.isWhitelisted(context.walletAddress)
      return whitelisted
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
      console.log('ipfs url: ', url)
      setImageURL(url)
      setMetadata({ ...metadata, image: url })
    } catch (e) {
      console.error('Error uploading file: ', e)
    }
  }

  const handleInputChange = (event: any) => {
    const name = event.target.name
    const value = event.target.value
    setMetadata({ ...metadata, [name]: value })
  }

  useEffect(() => {
    checkWhitelist()
    let token = localStorage.getItem('token')
    let tempToken: any = token
    if (tempToken) {
      let decodedToken: any = jwtDecode(tempToken)
      // console.log('decoded token: ', decodedToken)
      setLoggedIn(true)
    }
  }, [])

  //----------------Initialising Wallet----------------//

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
    if (!window.ethereum) throw new Error('No crypto wallet found')
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }],
    })
  }

  useEffect(() => {
    if (context.signer === null) {
      connectWallet()
    }
  }, [])

  //   if (!loggedIn) {
  //     return (
  //       <div className="flex items-center justify-center mt-10 mb-20">
  //         <div className="text-white">Please Log In</div>
  //       </div>
  //     )
  //   }

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
          <button
            className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs"
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
