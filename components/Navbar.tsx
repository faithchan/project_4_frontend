import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from "../public/ArkivLogo.svg"
import Search from './Search'

const Navbar = () => {
    return (
        <div className="text-gold font-header text-xs">
            <nav className="flex pt-10 px-20 place-content-between">
                <span className="mt-2 w-24"><Link href="/"><Image src={logo} alt="Logo" className="h-10 ml-8 mb-6"/></Link></span>
                <ul className="flex items-right  mt-2 h-full tracking-wider">
                    <li className="mx-10 mt-2"><Link href="/login">LOGIN</Link></li>
                    <li className="ml-10 mr-20 mt-2"><Link href="/explore">EXPLORE</Link></li>
                    <Search />
                </ul>
            </nav>
      </div>
    )
}

export default Navbar
