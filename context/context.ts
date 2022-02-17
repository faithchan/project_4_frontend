import { createContext } from 'react'

interface userLoginStatus {
  login:boolean
  designerState: boolean
  walletAddress: string
  signer: any
  nftContract: any
  marketplaceContract: any
  setLogin: (a: boolean) => void
  setSigner: (signer: any) => void
  setNftContract: (nftContract: any) => void
  setMarketplaceContract: (marketplaceContract: any) => void
  setWalletAddress: (address: string) => void
}

const userDefaultValue = {
  login:false,
  designerState: false,
  walletAddress: '',
  signer: null,
  nftContract: null,
  marketplaceContract: null,
  setLogin: (a: boolean) => null,
  setSigner: (signer: any) => null,
  setNftContract: (nftContract: any) => null,
  setMarketplaceContract: (marketplaceContract: any) => null,
  setWalletAddress: (address: string) => '',
}

const userContext = createContext<userLoginStatus>(userDefaultValue)

export default userContext
