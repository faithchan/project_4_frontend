import type { NextPage } from 'next'

import React from 'react'
import LoginForm from '../components/LoginForm'
import Link from 'next/link'

const Login: NextPage = () => {
  return (
    <div className="h-screen">
      <h1 className="text-center mt-28 font-header tracking-widest text-gold text-2xl ">
        WELCOME BACK
      </h1>
      <LoginForm />
      <p className="text-center font-body text-gray-300 tracking-wider text-xs  mt-4 mb-10">
        Don&apos;t have an account with us yet?{' '}
        <Link href="/signup">
          <a className="underline">Sign up now</a>
        </Link>
      </p>
    </div>
  )
}

export default Login
