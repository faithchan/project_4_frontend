import React, { createContext } from 'react'

interface userLoginStatus {
   login:boolean,
   walletID:string,
   designerState:boolean,
}

const userContext = createContext<userLoginStatus | null>(null);

export default userContext
