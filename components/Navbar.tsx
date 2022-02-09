import React, {Fragment}from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../public/ArkivLogo.svg'
import Search from './Search'
import accountImg from '../public/account.svg'
import exploreImg from '../public/explore.svg'
import homeImg from '../public/home.svg'
import tradeImg from '../public/trade.svg'
import uploadImg from '../public/upload.svg'
import AccNavigation from './AccNavigation'
import TradesNavigation from './TradesNavigation'


const Navbar = () => {
  return (
    <div className="text-gold font-header text-xs">
      <nav className="flex pt-10 px-32 place-content-between">
        <span className="mt-10 w-28">
          <Link href="/">
            <a>
              <Image src={logo} alt="Logo" />
            </a>
          </Link>
        </span>

        <span>
        <ul className="flex items-right mt-6 h-full tracking-widest">
            

            <li className="ml-10 mr-10 mt-2 ">
            <Link href="/feed">
              <a>
                <Image src={homeImg}></Image>
              </a>
            </Link>
          </li>
          <li className="ml-10 mr-10 mt-2 ">
            <Link href="/uploadnft">
              <a>
                <Image src={uploadImg}></Image>
              </a>
            </Link>
          </li>
          <li className="ml-10 mr-20 mt-2 ">
            <TradesNavigation />
          </li>
          <li className="mr-10 mt-2">
                <AccNavigation />
            </li>
          
          <Search />
        </ul>
        </span>
       

      </nav>
    </div>
  )
}

export default Navbar
