import { createContext } from 'react'

interface userLoginStatus {
  login: boolean
  walletID: string
  designerState: boolean
  setLoginState(state: boolean): void
}

const userDefaultValue = {
  login: false,
  walletID: '0x0',
  designerState: false,
  setLoginState: (state: boolean) => false,
}

const userContext = createContext<userLoginStatus>(userDefaultValue)

export default userContext
