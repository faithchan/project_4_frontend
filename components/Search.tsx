import React, { useEffect } from 'react'
import { useState, Fragment, useContext } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import globalContext from '../context/context'
import { useRouter } from 'next/router'

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

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      {/* Render a `Fragment` instead of an `input` */}
      <Combobox.Input
        className="w-40 border-none focus:ring-0 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 rounded-lg"
        as={Fragment}
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(person: any) => person}
      >
        <input />
      </Combobox.Input>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Combobox.Options className="bg-black rounded-md p-2 origin-top-right absolute  mt-2 w-32  shadow-lg bg-opacity-20 focus:outline-none cursor-pointer">
          {filteredPeople.map((person) => (
            <Combobox.Option
              key={person}
              value={person}
              className="group flex items-center px-4 py-1  text-gray-300 hover:text-gold"
            >
              {person}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  )
}

export default Search
