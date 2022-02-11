import React from 'react'
import { useRouter } from 'next/router'

const Username = () => {
    const router = useRouter()
    const { id } = router.query
  
    return (
        <div>
            <h1>UserName: {id}</h1>
        </div>
    )
}

export default Username
