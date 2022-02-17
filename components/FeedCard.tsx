import { useEffect } from 'react'

interface FeedProps {
  name: string
  description: string
  image: string
  price: string
  itemId: number
  isListed: boolean
  owner: string
  tokenId: number
  buyModal: boolean
  setBuyModal: (a: boolean) => void
  setCurrentItemId: (a: number) => void
  setCurrentTokenId: (a: number) => void
  setCurrentItemOwner: (a: string) => void
  setCurrentPrice: (a: string) => void
}

const FeedCard = (props: FeedProps) => {
  useEffect(() => {
    props.setCurrentItemId(props.itemId)
    props.setCurrentTokenId(props.tokenId)
    props.setCurrentPrice(props.price)
    props.setCurrentItemOwner(props.owner)
  }, [])

  return (
    <div className="flex justify-center mt-20 mb-10">
      <div className="px-8 pt-6 pb-6 bg-purple opacity-80 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-500">
        <div className="">
          <span className="flex space-x-4 mr-6">
            <img
              className="w-10 h-10 object-cover rounded-full mr-2  mb-4"
              src="https://api.lorem.space/image/face?w=200&h=200&hash=bart89fe"
              alt=""
            />
            <span className="mt-3">
              <p className="text-center text-gold font-header text-xs tracking-widest">FAKURIAN</p>
            </span>
          </span>
          <span className="font-MT font-semibold text-left leading-loose">
            <img className="w-96 h-96 object-cover rounded-3xl" src={props.image} alt="" />
            <p className="text-gold mt-4 text-md font-header tracking-widest">{props.name}</p>
            <p className="text-gray-300 font-body mt-4 text-xs tracking-widest">
              {props.description}
            </p>
            <span className="flex justify-between">
              <p className="text-gray-300 font-body mt-4 text-xs tracking-widest">
                List Price: {props.isListed ? props.price + 'ETH' : '-'}
              </p>
              {props.isListed ? (
                <button
                  className="mb-2 md:mb-0 bg-green-400 px-5 py-2 text-xs shadow-sm  font-header tracking-wider text-white rounded-full hover:shadow-lg"
                  onClick={() => props.setBuyModal(true)}
                >
                  Buy
                </button>
              ) : (
                ''
              )}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default FeedCard
