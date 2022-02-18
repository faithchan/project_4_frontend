import { useEffect, useState, useContext } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import jwtDecode from 'jwt-decode'
import globalContext from '../context/context'
import { useRouter } from 'next/router'

const admin = () => {
  const context = useContext(globalContext)
  const [whitelistAddress, setWhitelistAddress] = useState('')
  const [connected, setConnected] = useState<boolean>(false)
  const [whitelistedAddrs, setWhitelistedAddrs] = useState<any>([])
  const [allUsers, setAllUsers] = useState([])
  const router = useRouter()

  // console.log('admin context: ', context)

  const getAllWhitelistees = async () => {
    if (allUsers && context.nftContract) {
      for (let user of allUsers) {
        const txn = await context.nftContract.isWhitelisted(user.walletAddress)
        if (txn) {
          console.log(`${user.username} is whitelisted`)
          setWhitelistedAddrs([...whitelistedAddrs, user.walletAddress])
        } else {
          console.log(`${user.username} is not whitelisted`)
        }
      }
    } else {
      console.log('no users in database')
    }
  }

  const addToWhitelist = async () => {
    if (context.nftContract) {
      if (validateAddress(whitelistAddress) === true) {
        console.log(`adding ${whitelistAddress} to whitelist`)
        try {
          const txn = await context.nftContract.addToWhitelist(whitelistAddress)
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

  const removeFromWhitelist = async () => {
    if (context.nftContract) {
      if (validateAddress(whitelistAddress) === true) {
        console.log(`removing ${whitelistAddress} from whitelist`)
        try {
          const txn = await context.nftContract.removeFromWhitelist(whitelistAddress)
          const receipt = await txn.wait()
          console.log('whitelist txn: ', receipt)
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
    if (context.nftContract) {
      if (validateAddress(whitelistAddress) === true) {
        console.log(`checking ${whitelistAddress} whitelist status`)
        try {
          const txn = await context.nftContract.isWhitelisted(whitelistAddress)
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
    } catch (err) {
      console.error(err)
    }
  }

  const removeUser = async (userId: string) => {
    console.log(`trying to remove user with id ${userId}`)
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      console.log('deleted user: ', response)
      router.reload()
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (event: any) => {
    const value = event.target.value
    setWhitelistAddress(value)
  }

  const validateAddress = (input: string) => {
    const prefix = input.slice(0, 2)
    if (input.length === 42 && prefix === '0x') {
      return true
    }
    return false
  }

  useEffect(() => {
    getAllWhitelistees()
  }, [context.nftContract])

  useEffect(() => {
    let token = localStorage.getItem('token')
    let tempToken: any = token
    if (tempToken) {
      let decodedToken: any = jwtDecode(tempToken)
      console.log('decoded token: ', decodedToken)
      if (decodedToken.role !== 'Admin') {
        router.push('/404')
      } else {
        fetchAllUsers()
      }
    } else {
      router.push('/404')
    }
  }, [])

  const renderWhitelist = whitelistedAddrs.map((address: any) => {
    return (
      <div className="md:text-sm text-xs text-white font-body tracking-wider mb-4" key={address}>
        {address}
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
          className="mr-5 w-16 h-16 rounded-full"
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
          <div className="flex items-center justify-center py-5 grid-cols-4">
            <button
              className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto"
              onClick={addToWhitelist}
            >
              ADD
            </button>
            <button
              className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto"
              onClick={removeFromWhitelist}
            >
              REMOVE
            </button>
            <button
              className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto"
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
