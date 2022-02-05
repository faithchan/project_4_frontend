import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from "../public/ArkivLogo.svg"
import Search from './Search'
import accountImg from "../public/account.svg"


const Navbar = () => {
    return (
        <div className="text-gold font-header text-xs">
            <nav className="flex pt-10 px-32 place-content-between">
                <span className="mt-10 w-28"><Link href="/"><a><Image src={logo} alt="Logo" /></a></Link></span>
                <ul className="flex items-right mt-6 h-full tracking-widest">
                    <li className="mx-10 mt-4"><Link href="/login"><a>LOGIN</a></Link></li>
                    <li className="ml-10 mr-10 mt-4 "><Link href="/explore"><a>EXPLORE</a></Link></li>
                    <li className="ml-10 mr-10 mt-4 "><Link href="/uploadnft"><a>UPLOAD</a></Link></li>
                    <li className="ml-10 mr-10 mt-4 "><Link href="/trades"><a>TRADES</a></Link></li>
                    <li className="ml-10 mr-20 mt-2 "><Link href="/account"><a><Image src={accountImg}></Image></a></Link></li>
                    <Search />
                </ul>
            </nav>
      </div>
    )
}

export default Navbar
