import { useEffect, useState, useContext } from 'react'
import { ethers } from 'ethers'
import globalContext from '../context/context'
import { nftaddress } from '../config'
import { useRouter } from 'next/router'

interface listingProps {
  tokenId: number
  ListNFTModal: boolean
  isCreator: boolean
  setListNFTModal: (a: boolean) => void
}

const ListNFTToken = (props: listingProps) => {
  const context = useContext(globalContext)
  const router = useRouter()
  const [showRoyalty, setShowRoyalty] = useState(true)
  const [showList, setShowList] = useState(true)
  const [showContBtn, setShowContBtn] = useState(false)
  const [showRoyaltyBtn, setShowRoyaltyBtn] = useState(true)
  const [royaltyAmount, setRoyaltyAmount] = useState<any>() // convert % to number between 0-10000
  const [listPrice, setListPrice] = useState('')

  // console.log('list card tokenId: ', props.tokenId)

  //----------------Setting Royalties----------------//

  const setTokenRoyalty = async () => {
    console.log(`setting royalties of ${royaltyAmount} for token id ${props.tokenId}`)
    if (context.nftContract) {
      const txn = await context.nftContract.setTokenRoyalty(props.tokenId, royaltyAmount)
      console.log('royalty txn: ', txn)
      setShowRoyalty(false)
      setShowList(true)
    } else {
      console.log('no contract')
    }
  }

  const handleRoyaltyInputChange = (event: any) => {
    const value = event.target.value
    const bp = value * 100
    console.log('royalty bp: ', bp)
    setRoyaltyAmount(bp)
  }

  //----------------Listing Token----------------//

  const listToken = async () => {
    if (context.marketplaceContract) {
      const salePrice = ethers.utils.parseUnits(listPrice, 'ether')
      console.log(`setting price of ${salePrice} for token ${props.tokenId}`)
      const txn = await context.marketplaceContract.listItem(nftaddress, props.tokenId, salePrice)
      await txn.wait()
      setShowList(false)
      props.setListNFTModal(false)
      setTimeout(() => {
        router.push('/feed')
      }, 1000)
    }
  }

  const handlePriceInputChange = (event: any) => {
    const value = event.target.value
    console.log('price: ', value)
    setListPrice(value)
  }

  const royaltyHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  const listTokenHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (props.isCreator) {
      setShowRoyalty(true)
      setShowList(false)
    } else {
      setShowRoyalty(false)
      setShowList(true)
    }
  }, [])

  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover"
      id="modal-id"
    >
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg  bg-purple">
        {props.isCreator && showRoyalty ? (
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
                onChange={handleRoyaltyInputChange}
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
                  onClick={setTokenRoyalty}
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
                <div></div>
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
                onChange={handlePriceInputChange}
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
                onClick={listToken}
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
