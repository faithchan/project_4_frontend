import { createContext } from 'react'

interface userLoginStatus {
  login:boolean
  designerState: boolean
  walletAddress: string
  signer: any
  nftContract: any
  marketplaceContract: any
  setLogin:(login: boolean) => void
  setSigner: (signer: any) => void
  setNftContract: (nftContract: any) => void
  setMarketplaceContract: (marketplaceContract: any) => void
  setWalletAddress: (address: string) => void
}

const userDefaultValue = {
  login: false,
  designerState: false,
  walletAddress: '0x',
  signer: null,
  nftContract: null,
  marketplaceContract: null,
  setLogin: (login: boolean) => false,
  setSigner: (signer: any) => null,
  setNftContract: (nftContract: any) => null,
  setMarketplaceContract: (marketplaceContract: any) => null,
  setWalletAddress: (address: string) => '0x',
}

const userContext = createContext<userLoginStatus>(userDefaultValue)

export default userContext
