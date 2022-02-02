import React from 'react'
import LoginForm from '../components/LoginForm'
import Link from 'next/link'

const login = () => {
    return (
        <div>
            <h1 className="text-center mt-28 font-header tracking-widest text-gold text-2xl">WELCOME BACK</h1>
            <LoginForm />
            <p className="text-center font-body text-gray-300 tracking-wider text-xs mb-28 mt-4">Dont' have an account with us yet? <Link href="/signup">
            <a className="underline">Sign up now</a>
            </Link></p>

        </div>
        
    )
}

export default login
