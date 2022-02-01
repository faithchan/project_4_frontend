import React from 'react'

const Search = () => {
    return (
        <div className="relative text-gray-400">
            <input type="search" name="search" placeholder="Search" className="bg-white h-10 pl-5 rounded-full text-sm focus:outline-none"/>
                <button type="submit" className="absolute right-0 top-0 mt-3 pr-4 ">
                    go
                </button>
        </div>
   
    )
}

export default Search
