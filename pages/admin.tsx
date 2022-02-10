import { useEffect, useState } from 'react'
import Wallet from '../components/Wallet'
import { nftaddress } from '../config'
import { ethers } from 'ethers'
import NFT from '../contract-abis/NFT.json'
import jwtDecode from 'jwt-decode'

const dummyUser = '6203148937e32a0a9519be13'

const admin = () => {
  const [whitelistAddress, setWhitelistAddress] = useState('')
  const [nftContract, setNftContract] = useState<any>()
  const [walletAddress, setWalletAddress] = useState('')
  const [connected, setConnected] = useState<boolean>(false)
  const [signer, setSigner] = useState<any>()
  const [whitelistedAddrs, setWhitelistedAddrs] = useState([])
  const [allUsers, setAllUsers] = useState([])

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
          const txn = await nftContract.addToWhitelist(whitelistAddress)
          const receipt = await txn.wait()
          console.log('whitelist txn: ', receipt)
          await updateDatabaseStatus(true)
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

  const removeFromWhitelist = async () => {
    if (nftContract) {
      if (validateAddress(whitelistAddress) === true) {
        console.log(`removing ${whitelistAddress} from whitelist`)
        try {
          const txn = await nftContract.removeFromWhitelist(whitelistAddress)
          const receipt = await txn.wait()
          console.log('whitelist txn: ', receipt)
          await updateDatabaseStatus(false)
          setWhitelistAddress('')
        } catch (err) {
          console.error('error removing from whitelist: ', err)
        }
      } else {
        alert('Please enter a valid address.')
      }
    } else {
      alert('Please connect your Metamask wallet')
    }
  }

  const checkWhitelistStatus = async () => {
    if (nftContract) {
      if (validateAddress(whitelistAddress) === true) {
        console.log(`checking ${whitelistAddress} whitelist status`)
        try {
          const txn = await nftContract.isWhitelisted(whitelistAddress)
          console.log('whitelist txn: ', txn)
          setWhitelistAddress('')
        } catch (err) {
          console.error('checking whitelist status: ', err)
        }
      } else {
        alert('Please enter a valid address.')
      }
    } else {
      alert('Please connect your Metamask wallet')
    }
  }

  const updateDatabaseStatus = async (status: boolean) => {
    if (walletAddress) {
      console.log(`updating whitelist status for ${dummyUser}`)
      try {
        const response = await fetch(`${process.env.API_ENDPOINT}/users/${dummyUser}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            whitelistStatus: status,
          }),
        })
        const data = await response.json()
        console.log('updated user status: ', data)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const fetchExistingWhitelist = async () => {
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/users/whitelist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setWhitelistedAddrs(data)
      console.log('updated user status: ', data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      setAllUsers(data)
      console.log('all users from database: ', data)
    } catch (err) {
      console.error(err)
    }
  }

  const renderWhitelist = whitelistedAddrs.map((user: any) => {
    return (
      <div className="md:text-sm text-xs text-white font-body tracking-wider mb-4" key={user._id}>
        {user.walletAddress}
      </div>
    )
  })

  const renderUsers = allUsers.map((user: any) => {
    return (
      <div
        className="md:text-sm text-xs text-white font-body tracking-wider my-4 flex items-center"
        key={user._id}
      >
        <img
          src={user.avatar}
          alt={user.username}
          width={50}
          height={50}
          className="mr-5 rounded-full"
        />
        {user.username}
        <button
          className="border-2 border-gold hover:bg-blue-450 text-gold font-semibold font-header py-2 px-6 rounded-full text-xs ml-5"
          onClick={() => {
            removeUser(user._id)
          }}
        >
          Remove
        </button>
      </div>
    )
  })

  const removeUser = async (userId: string) => {
    console.log(`trying to remove user with id ${userId}`)
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      console.log('deleted user: ', data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (event: any) => {
    const value = event.target.value
    setWhitelistAddress(value)
  }

  useEffect(() => {
    initialiseContract()
    fetchExistingWhitelist()
    fetchAllUsers()
  }, [walletAddress])

  useEffect(() => {
    let token = localStorage.getItem('token')
    let tempToken: any = token
    if (tempToken) {
      let decodedToken: any = jwtDecode(tempToken)
      console.log('decoded token: ', decodedToken)
    }
  }, [])

  return (
    <div className="flex items-center justify-center mt-10 mb-20">
      <div className="grid w-6/12 md:w-5/12 lg:w-4/12">
        <div className="text-center my-20 font-header tracking-widest text-gold text-2xl">
          MANAGE WHITELIST
        </div>
        <div className="mb-5">
          <label className="md:text-sm text-lg text-white font-body tracking-wider underline underline-offset-4">
            Whitelisted Addresses
          </label>
          {renderWhitelist}
        </div>
        <div>
          <div className="grid grid-cols-1 ">
            <label className="md:text-sm text-xs text-white font-body tracking-wider">
              Wallet Address
            </label>
            <input
              className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md mt-2"
              type="text"
              name="whitelistAddress"
              onChange={handleInputChange}
              value={whitelistAddress}
            />
          </div>
          <div className="flex items-center justify-center py-5 grid grid-cols-4">
            <Wallet
              setWalletAddress={setWalletAddress}
              setSigner={setSigner}
              setConnected={setConnected}
              isConnected={connected}
              signer={signer}
            />
            <button
              className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
              onClick={addToWhitelist}
            >
              ADD
            </button>
            <button
              className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
              onClick={removeFromWhitelist}
            >
              REMOVE
            </button>
            <button
              className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-8"
              onClick={checkWhitelistStatus}
            >
              VERIFY
            </button>
          </div>
        </div>
        <div>
          <div className="text-center my-10 font-header tracking-widest text-gold text-2xl">
            MANAGE USERS
          </div>
          <div className="mb-5">
            <label className="md:text-sm text-lg text-white font-body tracking-wider underline underline-offset-4">
              All Users
            </label>
            {renderUsers}
          </div>
        </div>
      </div>
    </div>
  )
}

export default admin
