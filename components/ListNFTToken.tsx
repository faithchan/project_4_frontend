import { useEffect, useState, useContext } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import globalContext from '../context/context'
import { nftaddress } from '../config'

interface uploadProps {
  ListNFTModal: boolean
  setListNFTModal: (a: boolean) => void
}

const ListNFTToken = (props: uploadProps) => {
  const context = useContext(globalContext)
  const [showRoyalty, setShowRoyalty] = useState(true)
  const [showList, setShowList] = useState(false)
  const [showContBtn, setShowContBtn] = useState(false)
  const [showRoyaltyBtn, setShowRoyaltyBtn] = useState(true)
  const [royaltyAmount, setRoyaltyAmount] = useState() // convert % to number between 0-10000
  const [listPrice, setListPrice] = useState('')
  const [tokenId, setTokenId] = useState()

  const listToken = async () => {
    if (context.marketplaceContract) {
      const salePrice = ethers.utils.parseUnits(listPrice, 'ether')
      const txn = await context.marketplaceContract.listItem(nftaddress, tokenId, salePrice)
    }
  }

  const setTokenRoyalty = async () => {
    if (context.nftContract) {
      await context.nftContract.setTokenRoyalty(tokenId, royaltyAmount)
    }
  }

  const getRoyaltyInfo = async () => {
    if (context.nftContract) {
      const salePrice = ethers.utils.parseUnits(listPrice, 'ether')
      const info = await context.nftContract.royaltyInfo(tokenId, salePrice)
      console.log('royalty info: ', info)
    }
  }

  const handleRoyaltyInputChange = (event: any) => {
    const value = event.target.value
    setRoyaltyAmount(value)
  }

  const handlePriceInputChange = (event: any) => {
    const value = event.target.value
    setListPrice(value)
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

  const royaltyHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowRoyalty(false)
    setShowList(true)
  }
  const listTokenHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowList(false)
    props.setListNFTModal(false)
  }

  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-purple">
        {showRoyalty ? (
          <form className="" onSubmit={royaltyHandler}>
            <div className="text-center p-5 flex-auto justify-center">
              <p className="text-2xl text-gold font-header px-8">Set Royalty</p>
            </div>
            <div className="px-20">
              <label className="block mb-1 md:text-sm text-xs text-gray-400 font-body">
                *In Percent (%)
              </label>
              <input
                type="number"
                className="bg-gray-100 px-4 py-2 border text-gray-600 border-gray-400 outline-none rounded-md w-full mt-2"
                placeholder="2%"
                min="0"
                step=".01"
                max="99"
                required
              />
            </div>
            <div className="p-3 mt-2 text-center space-x-4 md:block">
              <button
                className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs shadow-sm font-header tracking-wider border text-gold rounded-full hover:shadow-lg hover:bg-gray-100"
                onClick={() => props.setListNFTModal(false)}
              >
                Cancel
              </button>
              {showRoyaltyBtn ? (
                <button
                  className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg "
                  onClick={() => {
                    setShowContBtn(true)
                    setShowRoyaltyBtn(false)
                  }}
                >
                  Set Royalty
                </button>
              ) : (
                ''
              )}
              {showContBtn ? (
                <button
                  className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg "
                  type="submit"
                >
                  Continue to List
                </button>
              ) : (
                ''
              )}
            </div>
          </form>
        ) : (
          ''
        )}
        {/* Next Form */}
        {showList ? (
          <form className="" onSubmit={listTokenHandler}>
            <div className="text-center p-5 flex-auto justify-center">
              <p className="text-2xl text-gold font-header px-8">Enter Price</p>
            </div>

            <div className="px-20">
              <label className="block mb-1 md:text-sm text-xs text-gray-400 font-body">
                *In Eth
              </label>
              <input
                type="number"
                className="bg-gray-100 px-4 py-2 border text-gray-600 border-gray-400 outline-none rounded-md w-full mt-2"
                placeholder="1 Eth"
                min="0.01"
                step=".01"
                required
              />
            </div>

            <div className="p-3 mt-2 text-center space-x-4 md:block">
              <button
                className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs shadow-sm font-header tracking-wider border text-gold rounded-full hover:shadow-lg hover:bg-gray-100"
                onClick={() => props.setListNFTModal(false)}
              >
                Cancel
              </button>
              <button
                className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg"
                type="submit"
              >
                List Token
              </button>
            </div>
          </form>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default ListNFTToken
