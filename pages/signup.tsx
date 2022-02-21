import type { NextPage } from 'next'
import SignUpForm from '../components/SignUpForm'

const Signup: NextPage = () => {
  return (
    <div>
      <h1 className="text-center mt-28 font-header tracking-widest text-gold text-2xl">
        CREATE AN ACCOUNT
      </h1>
      <SignUpForm />
    </div>
  )
}

export default Signup
