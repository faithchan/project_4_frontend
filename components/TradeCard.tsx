import { useState, useContext, useEffect } from 'react'
import deleteImg from '../public/delete.svg'
import Image from 'next/image'
import ListNFTToken from './ListNFTToken'
import globalContext from '../context/context'
import { useRouter } from 'next/router'
import { PencilIcon } from '@heroicons/react/solid'

interface CardProps {
  listPrice: number
  itemId: any
  tokenId: number
  name: string
  image: string
  isListed: boolean
  avatar: string
  creator: string
  burnModal: boolean
  setBurnModal: (a: boolean) => void
  setCurrentTokenId: (a: number) => void
}

const TradeCard = (props: CardProps) => {
  const { nftContract, walletAddress, marketplaceContract } = useContext(globalContext)
  const router = useRouter()
  const [ListNFTModal, setListNFTModal] = useState(false)
  const [creator, setCreator] = useState() // creator's wallet address
  const [isCreator, setIsCreater] = useState<boolean>(false) // checks if current token holder is creator
  const [creatorProfile, setCreatorProfile] = useState<any>()
  const [profileLoaded, setProfileLoaded] = useState<boolean>(false)

  const checkIfHolderIsCreator = async () => {
    const creator = await nftContract.tokenCreator(props.tokenId)
    setCreator(creator)
    if (creator === walletAddress) {
      setIsCreater(true)
    } else {
      setIsCreater(false)
    }
  }

  const delistItem = async () => {
    const txn = await marketplaceContract.delistItem(props.itemId)
    const receipt = await txn.wait()
    console.log('delisted item: ', receipt)
    router.reload()
  }

  const shortenAddress = (str: any) => {
    return str.substring(0, 5) + '...' + str.substring(str.length - 2)
  }

  useEffect(() => {
    if (creatorProfile !== undefined) {
      setProfileLoaded(true)
    }
  }, [creatorProfile])

  useEffect(() => {
    if (nftContract) {
      checkIfHolderIsCreator()
    }
  }, [nftContract])

  useEffect(() => {
    props.setCurrentTokenId(props.tokenId)
  }, [])

  return (
    <div>
      {ListNFTModal && (
        <ListNFTToken
          tokenId={props.tokenId}
          ListNFTModal={ListNFTModal}
          setListNFTModal={setListNFTModal}
          isCreator={isCreator}
        />
      )}
      <div className="w-full px-8 pt-8 pb-6 bg-purple opacity-80 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-500 ">
        <div className="flex justify-between space-x-14">
          <span className="font-MT font-semibold text-left leading-loose">
            <img
              className="w-44 h-44 object-cover rounded-3xl"
              src={props.image}
              alt={props.name}
            />
            <p className="text-gold mt-4 text-md font-header tracking-widest">{props.name}</p>
            <p className="text-gray-300 font-body text-xs mt-1 tracking-widest">
              List Price:{' '}
              {props.listPrice === 0 || props.isListed === false ? '-' : props.listPrice + ' ETH'}
            </p>
            {props.listPrice === 0 || props.isListed === false ? (
              <p
                className="text-gray-300 font-body text-xs mt-1 tracking-widest underline cursor-pointer"
                onClick={() => setListNFTModal(true)}
              >
                List this NFT
              </p>
            ) : (
              ''
            )}
          </span>
          <span>
            <p className="text-gold text-sm font-header tracking-widest">Designed by</p>
            <span className="flex space-x-4 mr-6">
              <img
                className="w-16 h-16 object-cover rounded-full mr-4 mt-6 mb-4"
                src={props.avatar}
                alt=""
              />
              <span className="my-auto">
                <p className="text-center text-gold font-header text-xs tracking-widest">
                  {props.creator}
                </p>
                <hr className="border-gold border my-2"></hr>
                <p
                  className="text-center text-white font-body text-xs tracking-widest"
                  onClick={() => router.push(`/user/${creatorProfile.username}`)}
                >
                  View Profile
                </p>
              </span>
            </span>
            <p className="text-gold text-sm font-header tracking-widest mt-2">Owned by</p>
            <p className="text-gold text-xs font-header tracking-widest mt-2">
              {shortenAddress(walletAddress)}
            </p>

            <span className="grid justify-end">
              {props.isListed && (
                <span className="grid-cols-1" onClick={delistItem}>
                  <span className="p-auto cursor-pointer w-10 h-10 border-gold border-2 rounded-full grid grid-cols-1 justify-items-center">
                    {/* <Image className="mt-4" src={deleteImg} alt="Logo" />
                     */}
                    <PencilIcon className="text-gold w-6 h-6 my-auto" />
                  </span>
                  <p className="text-xs font-body text-center pt-2 text-gray-300">Delist</p>
                </span>
              )}
            </span>
            {/* {props.isListed && (
                <button className="text-white" onClick={delistItem}>
                  Delist
                </button>
              )} */}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TradeCard
