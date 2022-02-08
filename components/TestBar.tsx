import React from 'react'
import accountImg from "../public/account.svg"
import Link from 'next/link'
import Image from 'next/image'
import {Menu} from "@headlessui/react"

const TestBar = () => {
    return (
        <div>
            <Menu as="div" className="relative" >
            <Menu.Button>
              <a>
                <Image src={accountImg}></Image>
              </a>
            </Menu.Button>

            <Menu.Items className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-back ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
            <div className="py-1">
                <Menu.Item>
                    <Link href="/login">
                    <a className="group flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-500 hover:text-white">
                     Login</a>
                    </Link>
                </Menu.Item>

                <Menu.Item>
                    <Link href="/signup">
                    <a className="group flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-500 hover:text-white">
                     Sign Up</a>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link href="/">
                    <a className="group flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-500 hover:text-white">
                    Log Out</a>
                    </Link>
                </Menu.Item>

            </div>

            </Menu.Items>

            </Menu>
          

        </div>
    )
}

export default TestBar
