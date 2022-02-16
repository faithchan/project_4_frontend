import { createContext } from 'react'

interface userLoginStatus {
  designerState: boolean
  walletAddress: string
  signer: any
  nftContract: any
  marketplaceContract: any
  setSigner: (signer: any) => void
  setNftContract: (nftContract: any) => void
  setMarketplaceContract: (marketplaceContract: any) => void
  setWalletAddress: (address: string) => void
}

const userDefaultValue = {
  designerState: false,
  walletAddress: '',
  signer: null,
  nftContract: null,
  marketplaceContract: null,
  setSigner: (signer: any) => null,
  setNftContract: (nftContract: any) => null,
  setMarketplaceContract: (marketplaceContract: any) => null,
  setWalletAddress: (address: string) => '',
}

const userContext = createContext<userLoginStatus>(userDefaultValue)

export default userContext
