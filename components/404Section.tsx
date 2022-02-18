import React from 'react'
import errorImg from "../public/404.svg"
import Image from 'next/image'

const Error = () => {
    return (
        <div className="h-screen w-screen  flex justify-center">
               <div className="max-w-md">
                  <Image width={250} src={errorImg}></Image>
                  </div>
                  
      </div>
   
    )
}

export default Error
