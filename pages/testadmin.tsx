import type { NextPage } from 'next'
import { useEffect, useState, useContext, useRef } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import jwtDecode from 'jwt-decode'
import globalContext from '../context/context'
import { useRouter } from 'next/router'

const TestAdmin: NextPage = () => {
  const context = useContext(globalContext)
  const [whitelistAddress, setWhitelistAddress] = useState('')
  const [whitelistedAddrs, setWhitelistedAddrs] = useState<any>(new Set())
  const [allUsers, setAllUsers] = useState([])
  const router = useRouter()

  const getAllWhitelistees = async () => {
    if (allUsers && context.nftContract) {
      for (let user of allUsers) {
        const txn = await context.nftContract.isWhitelisted(user.walletAddress)
        if (txn) {
          // console.log(`${user.username} is whitelisted`)
          setWhitelistedAddrs((prev: any) => new Set(prev.add(user.walletAddress)))
        } else {
          // console.log(`${user.username} is not whitelisted`)
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
          setWhitelistedAddrs((prev: any) => new Set(prev.add(whitelistAddress)))
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
  console.log(whitelistedAddrs)
  const removeFromWhitelist = async () => {
    if (context.nftContract) {
      if (validateAddress(whitelistAddress) === true) {
        console.log(`removing ${whitelistAddress} from whitelist`)
        try {
          const txn = await context.nftContract.removeFromWhitelist(whitelistAddress)
          const receipt = await txn.wait()
          console.log('whitelist txn: ', receipt)
          setWhitelistAddress('')
          setWhitelistedAddrs(
            (prev: any) => new Set([...prev].filter((x) => x !== whitelistAddress))
          )
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

  const validateAddress = (input: any) => {
    const prefix = input.slice(0, 2)
    if (input.length === 42 && prefix === '0x') {
      return true
    }
    return false
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

  useEffect(() => {
    getAllWhitelistees()
  }, [context.nftContract, allUsers])

  useEffect(() => {
    console.log('whitelist: ', whitelistedAddrs)
  }, [whitelistedAddrs])

  useEffect(() => {
    let token = localStorage.getItem('token')
    let tempToken: any = token
    if (tempToken) {
      let decodedToken: any = jwtDecode(tempToken)
      // console.log('decoded token: ', decodedToken)
      if (decodedToken.role !== 'Admin') {
        router.push('/404')
      } else {
        fetchAllUsers()
      }
    } else {
      router.push('/404')
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

  return (
    <div className="bg-purple opacity-80 py-8 px-14 rounded-xl mx-32 my-20">
      <div className="text-center my-8 font-header tracking-widest text-gold text-2xl">
        MANAGE WHITELIST
      </div>
      <div className="mx-56">
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
        <div className="flex items-center justify-center py-5 mt-2 grid-cols-4">
          <button
            className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto"
            onClick={addToWhitelist}
          >
            ADD USER
          </button>
          <button
            className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto"
            onClick={removeFromWhitelist}
          >
            DELETE USER
          </button>
          <button
            className="bg-gold text-white tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto"
            onClick={checkWhitelistStatus}
          >
            VERIFY USER
          </button>
        </div>
      </div>
      <button className="text-white" onClick={getAllWhitelistees}>
        Get whitelistees
      </button>
      <div>
        <div className="sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 pl-10 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Wallet Address
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Delete User
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* //.map here */}
                {allUsers.map((user: any) => (
                  <tr>
                    <td className="px-5 py-5 pl-10 border-b border-gray-200 bg-white text-sm">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                          <img className="w-full h-full rounded-full" src={user.avatar} alt="" />
                        </div>
                        <div className="ml-3">
                          <p className="text-gray-900 whitespace-no-wrap">{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.type}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.walletAddress}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {whitelistedAddrs.has(user.walletAddress) ? (
                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"
                          ></span>
                          <span className="relative">Yes</span>
                        </span>
                      ) : (
                        <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                          <span
                            aria-hidden
                            className="absolute inset-0 bg-red-200 opacity-50 rounded-full"
                          ></span>
                          <span className="relative">No</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {whitelistedAddrs.has(user.walletAddress) ? (
                        <button
                          className="bg-gray-400 text-white tracking-widest font-body py-2 px-4 rounded-full text-xs mx-auto"
                          onClick={removeFromWhitelist}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          className="bg-gray-500 text-white tracking-widest font-body py-2 px-4 rounded-full text-xs mx-auto"
                          onClick={addToWhitelist}
                        >
                          Add
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <button
                        className="bg-gray-400 text-white tracking-widest font-body py-2 px-4 rounded-full text-xs mx-auto"
                        onClick={() => removeUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {/* // end of array render */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestAdmin
