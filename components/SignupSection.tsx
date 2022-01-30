import React from 'react'
import Image from 'next/image'
import aboutImg from "../public/aboutImg.png"

const SignupSection = () => {
    return (
        <div>
          <div className="flex my-20 justify-center">
                <span className="w-80 ">
                    <Image src={aboutImg}/>
                </span>
                <span className="mt-20 ml-28">
                <h2 className="text-gray-200 text-sm mb-4 font-header tracking-widest">
                    WHO ARE WE?
                </h2>
                <h1 className="text-2xl leading-normal tracking-wider font-header mb-4 text-gold">
                    We are ARKIV <br/> <span className="text-gray-300 text-sm">Collective for NFTs</span>
                </h1>
                <p className="font-body text-xs mb-6 text-gray-300 leading-normal tracking-wide">A platform for verified designers to showcase and sell NFTs.<br/> Sign up now and get connected with our growing network. </p>
                <button className="bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-4 rounded-full text-xs mx-auto "  >SIGN UP</button>
                </span>
            </div>  
        </div>
    )
}

export default SignupSection