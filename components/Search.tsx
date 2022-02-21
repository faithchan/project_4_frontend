import React, { useEffect } from 'react'
import { useState, Fragment, useContext } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import globalContext from '../context/context'
import { useRouter } from 'next/router'
import { SearchIcon } from '@heroicons/react/solid'

const Search = () => {
  const router = useRouter()
  const { setSigner, setWalletAddress, signer, login, walletAddress, designerState } =
    useContext(globalContext)

  const [query, setQuery] = useState('')
  const [allUsers, setAllUsers] = useState([])
  const [selectedPerson, setSelectedPerson] = useState(allUsers[0])

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${process.env.API_ENDPOINT}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (data.length === 0) {
        console.log('error, no data was fetched')
      } else {
        let newArray = []
        await data.map((user: any) => newArray.push(user.username))
        console.log(data)
        setAllUsers(newArray)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => fetchAllUsers(), [])

  const filteredPeople =
    query === ''
      ? allUsers
      : allUsers.filter((person) => {
          return person.toLowerCase().includes(query.toLowerCase())
        })

  const searchHandler = () => router.push(`/user/${selectedPerson}`)

  console.log(query)
  console.log(selectedPerson)
  return (
    <div className="mt-7 ">
      <Combobox value={selectedPerson} onChange={setSelectedPerson}>
        {/* Render a `Fragment` instead of an `input` */}
        <div className="">
          <div className="rounded-full text-xs font-body focus:outline-none flex bg-white">
            <div>
              <Combobox.Input
                onChange={(event) => setQuery(event.target.value)}
                displayValue={(person: any) => person}
                className=" h-9 w-32 px-4  rounded-full text-sm focus:outline-none"
                placeholder="Search User"
              ></Combobox.Input>
            </div>
            <div className="">
              <button className="mr-2 pb-1 pr-1" onClick={searchHandler}>
                <SearchIcon className="w-5 h-5 mt-2 text-gray-400" />
              </button>
            </div>
          </div>
          <div>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <div className="bg-black absolute bg-opacity-20 w-40 mt-4 rounded-lg py-1">
                <Combobox.Options className="font-body ">
                  {filteredPeople.map((person) => (
                    <Combobox.Option
                      key={person}
                      value={person}
                      className="group flex items-center px-4 py-1 cursor-pointer text-gray-300 hover:text-gold "
                    >
                      {person}
                    </Combobox.Option>
                  ))}
                </Combobox.Options>
              </div>
            </Transition>
          </div>
        </div>
      </Combobox>
    </div>
  )
}

export default Search
