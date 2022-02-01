import React, { createContext } from 'react'

interface userLoginStatus {
   isLoggedIn?:boolean,
   walletID?:string,
   isDesigner?:boolean
}

const userDefaultValue = {
    isLoggedIn: false,
    walletID:"",
    isDesigner:false
}

const userContext = createContext<userLoginStatus>(userDefaultValue);

export default userContext
