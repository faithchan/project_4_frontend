import { useEffect, useState, useContext } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import jwtDecode from 'jwt-decode'
import globalContext from '../context/context'
import { useRouter } from 'next/router'

// console.log('admin context: ', context)

const testadmin = () => {
const context = useContext(globalContext)
const [whitelistAddress, setWhitelistAddress] = useState('')
const [connected, setConnected] = useState<boolean>(false)
const [whitelistedAddrs, setWhitelistedAddrs] = useState<any>([])
const [allUsers, setAllUsers] = useState([])
const router = useRouter()
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

  const check = async (x:any) => {
    const txn = await context.nftContract.isWhitelisted(x)
    if(txn){return true}
    else{return false}}

    console.log(whitelistedAddrs)
  
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
      <div className="md:text-sm text-xs  text-white font-body tracking-wider mb-4" key={address}>
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
  console.log(allUsers)
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
        <div className="bg-purple opacity-80 p-8 rounded-xl mx-32 my-20">
	
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
			<div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
				<div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
					<table className="min-w-full leading-normal">
						<thead>
							<tr>
								<th
									className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									User
								</th>
								<th
									className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									Role
								</th>
								<th
									className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									Wallet Address
								</th>
								<th
									className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
									Whitelisted Status
								</th>
							</tr>
						</thead>
						<tbody>
                        {/* //.map here */}
							{allUsers.map((user:any)=><tr>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<div className="flex items-center">
										<div className="flex-shrink-0 w-10 h-10">
											<img className="w-full h-full rounded-full"
                                                src={user.avatar}
                                                alt="" />
                                        </div>
											<div className="ml-3">
												<p className="text-gray-900 whitespace-no-wrap">
													{user.username}
												</p>
											</div>
										</div>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<p className="text-gray-900 whitespace-no-wrap">{user.type}</p>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<p className="text-gray-900 whitespace-no-wrap">
										{user.walletAddress}
									</p>
								</td>
								<td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
									<span
                                        className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                        <span aria-hidden
                                            className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
									<span className="relative">{
                                    whitelistedAddrs.find((add:string) =>add ===user.walletAddress)?"Active":"Unlisted"}</span>
									</span>
								</td>
							</tr>)}
                            {/* // end of array render */}
							
							
						</tbody>
					</table>
					<div
						className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
						<span className="text-xs xs:text-sm text-gray-900">
                            Showing 1 to 4 of 50 Entries
                        </span>
						<div className="inline-flex mt-2 xs:mt-0">
							<button
                                className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-l">
                                Prev
                            </button>
							&nbsp; &nbsp;
							<button
                                className="text-sm text-indigo-50 transition duration-150 hover:bg-indigo-500 bg-indigo-600 font-semibold py-2 px-4 rounded-r">
                                Next
                            </button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
    )
}

export default testadmin
