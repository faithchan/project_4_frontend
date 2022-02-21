import React from 'react'
import { useState, Fragment, useContext } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import globalContext from '../context/context'

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

const Search = () => {
  const { setSigner, setWalletAddress, signer, login, walletAddress, designerState } =
    useContext(globalContext)
  const [selectedPerson, setSelectedPerson] = useState(people[0])
  const [query, setQuery] = useState('')
  const [allUsers, setAllUsers] = useState([])

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
  console.log(allUsers)
  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      {/* Render a `Fragment` instead of an `input` */}
      <Combobox.Input
        className="w-40 border-none focus:ring-0 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 rounded-lg"
        as={Fragment}
        onChange={(event) => setQuery(event.target.value)}
        displayValue={(person: any) => person.name}
      >
        <input />
      </Combobox.Input>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Combobox.Options>
          {filteredPeople.map((person) => (
            <Combobox.Option key={person.id} value={person}>
              {person.name}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Transition>
    </Combobox>
  )
}

export default Search
