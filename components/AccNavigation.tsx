import React, { useContext } from 'react'
import accountImg from '../public/account.svg'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/solid'
import globalContext from '../context/context'
interface connectWalletProps {
  connectWallet: (a: any) => void
}

const AccNavigation = (props: connectWalletProps) => {
  const context = useContext(globalContext)
  const logoutHandler = () => {
    localStorage.removeItem('token')
    context.setLogin(false)
    context.setSigner(null)
    context.setNftContract(null)
    context.setMarketplaceContract(null)
    context.setWalletAddress('')
  }

  const connectWalletHandler = () => {
    if (context.signer === null && context.login === true) {
      props.connectWallet
    } else {
      console.log('You are not authorised')
    }
  }

  return (
    <div className="text-right font-body">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex justify-center w-full  text-sm font-medium text-white  rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            {context.login ? (
              <Link href="/profile">
                <a onClick={connectWalletHandler}>
                  <Image src={accountImg}></Image>
                </a>
              </Link>
            ) : (
              <Link href="/login">
                <a>
                  <Image src={accountImg}></Image>
                </a>
              </Link>
            )}
            <ChevronDownIcon
              className="w-5 h-5 ml-2 -mr-1 mt-2 text-gold hover:text-violet-100"
              aria-hidden="true"
            />
          </Menu.Button>
        </div>
        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="origin-top-right absolute left-0 mt-2 w-32 rounded-md shadow-lg bg-opacity-20  bg-black  divide-y divide-gray-100 focus:outline-none">
            <div className="py-1 ">
              {!context.login ? (
                <Menu.Item>
                  <Link href="/login">
                    <a className="group flex items-center px-4 py-1  text-gray-300 hover:text-gold">
                      Log In
                    </a>
                  </Link>
                </Menu.Item>
              ) : (
                ''
              )}

              {!context.login ? (
                <Menu.Item>
                  <Link href="/signup">
                    <a className="group flex items-center px-4 py-1 text-gray-300 hover:text-gold">
                      Sign Up
                    </a>
                  </Link>
                </Menu.Item>
              ) : (
                ''
              )}
              {context.login ? (
                <Menu.Item>
                  <Link href="/">
                    <a
                      className="group flex items-center px-4 py-1 text-gray-300 hover:text-gold"
                      onClick={logoutHandler}
                    >
                      Log Out
                    </a>
                  </Link>
                </Menu.Item>
              ) : (
                ''
              )}

              {context.login ? (
                <Menu.Item>
                  <Link href="/edit">
                    <a className="group flex items-center px-4 py-1 text-gray-300 hover:text-gold">
                      Edit Profile
                    </a>
                  </Link>
                </Menu.Item>
              ) : (
                ''
              )}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

export default AccNavigation
