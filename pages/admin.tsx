import { useEffect, useState } from 'react'
import Wallet from '../components/Wallet'
import { nftaddress } from '../config'
import { ethers } from 'ethers'
import NFT from '../contract-abis/NFT.json'

const admin = () => {
  const [whitelistAddress, setWhitelistAddress] = useState('')
  const [nftContract, setNftContract] = useState<any>()
  const [walletAddress, setWalletAddress] = useState('')
  const [connected, setConnected] = useState<boolean>(false)
  const [signer, setSigner] = useState<any>()

  const initialiseContract = async () => {
    if (signer != undefined) {
      const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
      setNftContract(nftContract)
    }
  }

  const validateAddress = (input: string) => {
    const prefix = input.slice(0, 2)
    if (input.length === 42 && prefix === '0x') {
      return true
    }
    return false
  }

  const addToWhitelist = async () => {
    if (nftContract) {
      if (validateAddress(whitelistAddress) === true) {
        console.log(`adding ${whitelistAddress} to whitelist`)
        try {
          const txn = await nftContract.addToWhitelist(walletAddress)
          const receipt = await txn.wait()
          console.log('whitelist txn: ', receipt)
          setWhitelistAddress('')
        } catch (err) {
          console.error('error adding to whitelist: ', err)
        }
      } else {
        alert('Please enter a valid address.')
      }
    } else {
      alert('Please connect your Metamask wallet')
    }
  }

  const handleInputChange = (event: any) => {
    const value = event.target.value
    console.log('value: ', value)
    setWhitelistAddress(value)
  }

  useEffect(() => {
    initialiseContract()
  }, [walletAddress])

  return (
    <div className="flex items-center justify-center mt-10 mb-20">
      <div className="grid w-6/12 md:w-5/12 lg:w-4/12">
        <div className="text-center my-20 font-header tracking-widest text-gold text-2xl">
          MANAGE ACCOUNTS
        </div>
        <div>
          <div className="grid grid-cols-1 ">
            <label className="md:text-sm text-xs text-white font-body tracking-wider">
              Add to Whitelist
            </label>
            <input
              className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
              type="text"
              name="whitelistAddress"
              onChange={handleInputChange}
              value={whitelistAddress}
            />
          </div>
          <div className="flex items-center justify-center py-5 grid grid-cols-2">
            <Wallet
              setWalletAddress={setWalletAddress}
              setSigner={setSigner}
              setConnected={setConnected}
              isConnected={connected}
            />
            <button
              className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
              onClick={addToWhitelist}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default admin
