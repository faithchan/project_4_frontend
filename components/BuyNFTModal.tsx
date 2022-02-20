import { useState } from 'react'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import globalContext from '../context/context'
import { nftaddress } from '../config'
import { ethers } from 'ethers'

interface buyProps {
  itemId: number | undefined
  tokenId: number | undefined
  owner: string | undefined
  price: string
  buyModal: boolean
  setBuyModal: (a: boolean) => void
}

const BuyNFTModal = ({ itemId, tokenId, owner, price, buyModal, setBuyModal }: buyProps) => {
  const { nftContract, marketplaceContract } = useContext(globalContext)
  const router = useRouter()
  const [showPurchase, setShowPurchase] = useState(true)
  const [success, setSuccess] = useState(false)

  const checkOwnership = async () => {
    const txn = await nftContract.ownerOf(tokenId)
    if (txn === owner) {
      return true
    } else {
      return false
    }
  }

  const buyItem = async () => {
    const isOwner = await checkOwnership()
    if (isOwner === true) {
      const priceInWei = ethers.utils.parseUnits(price, 'ether')
      console.log('price in wei: ', priceInWei.toString())
      const txn = await marketplaceContract.purchaseItem(nftaddress, itemId, {
        value: priceInWei,
      })
      const receipt = await txn.wait()
      console.log('item purchased: ', receipt)
      setShowPurchase(false)
      setSuccess(true)
    } else {
      alert('Item is no longer on sale')
      return
    }
  }

  const purchaseHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-purple">
        {showPurchase && (
          <form className="" onSubmit={purchaseHandler}>
            <div className="text-center p-5 flex-auto justify-center">
              <p className="text-2xl text-gold font-header px-8">Purchase NFT</p>
            </div>
            <div className="flex justify-center px-6 pt-2 pb-4">
              <img
                className="w-56 h-56 object-cover rounded-3xl"
                src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80"
                alt=""
              />
              <span className="ml-8 my-auto">
                <p className="text-left text-xl font-header text-gold ">Title of the NFT</p>
                <p className="text-left text-sm font-body text-gray-300 mt-2">
                  Designed by Fakurian
                </p>
                <p className="text-left text-sm font-body text-gray-300 mt-2">
                  List Price {price} ETH
                </p>
              </span>
            </div>
            <div className="p-3 mt-2 text-center space-x-4 md:block">
              <button
                className="mb-2 md:mb-0 bg-white px-5 py-2 text-xs shadow-sm font-header tracking-wider border text-gold rounded-full hover:shadow-lg hover:bg-gray-100"
                onClick={() => setBuyModal(false)}
              >
                Cancel
              </button>
              <button
                className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg "
                type="submit"
                onClick={buyItem}
              >
                Confirm Purchase
              </button>
            </div>
          </form>
        )}
        {success && (
          <div>
            <div className="text-center p-5 flex-auto justify-center">
              <p className="text-2xl text-gold font-header px-8">Success!</p>
            </div>
            <div className="flex justify-center px-6 pt-2 pb-4">
              <img
                className="w-56 h-56 object-cover rounded-3xl"
                src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1856&q=80"
                alt=""
              />
              <span className="ml-8 my-auto">
                <p className="text-left text-xl font-header text-gold ">Title of the NFT</p>
                <p className="text-left text-sm font-body text-gray-300 mt-2">
                  Designed by Fakurian
                </p>
                <p className="text-left text-sm font-body text-gray-300 mt-2">
                  List Price 0.01 Eth
                </p>
              </span>
            </div>
            <div className="p-3 mt-2 text-center space-x-4 md:block">
              <button
                className="mb-2 md:mb-0 bg-gold px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg "
                onClick={() => router.push('/profile')}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default BuyNFTModal
