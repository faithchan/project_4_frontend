import type { NextPage } from 'next'
import { useContext } from 'react'
import SignupSection from '../components/SignupSection'
import FeaturedCard from '../components/FeaturedCard'
import userContext from '../context/context'
import { useRouter } from 'next/router'

const About: NextPage = () => {
  const router = useRouter()
  const context = useContext(userContext)
  // console.log('context: ', context)

  return (
    <div className="mx-32">
      <div>
        <SignupSection />
      </div>

      <div className="">
        <h1 className="font-header text-gold text-center text-xl">Featured Artist NFTs</h1>
        <div className="flex flex-wrap justify-center space-x-20">
          <FeaturedCard />
          <FeaturedCard />
          <FeaturedCard />
        </div>
      </div>

      <div className="mx-32 mt-16">
        <h1 className="font-header text-center text-gold text-xl">About Arkiv</h1>
        <p className="mt-12 mx-20 font-body text-gray-300 text-md leading-loose text-center">
          A place to showcase your style at the same time provide designers a safe space where works
          here are valued and verified by our internal team. Start buying and trading NFTs today! To
          upload NFTs, user must be verified by our Team by submitting a request below
        </p>
        <button
          className="mt-8 mb-14 bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-4 rounded-full text-xs mx-auto  flex justify-center"
          onClick={() => router.push('/verify')}
        >
          GET VERIFIED
        </button>
      </div>
    </div>
  )
}

export default About
