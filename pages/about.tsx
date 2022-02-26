import type { NextPage } from 'next'
import { useContext } from 'react'
import SignupSection from '../components/SignupSection'
import FeaturedCard from '../components/FeaturedCard'
import userContext from '../context/context'
import { useRouter } from 'next/router'

const About: NextPage = () => {
  const featureCardArr = [
    {
      image:
        'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTA1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=700&q=60',
      title: 'MILKY WAY',
      artist: 'FAKURIAN',
      price: '0.01',
    },
    {
      image:
        'https://images.unsplash.com/photo-1617791160536-598cf32026fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTEzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=700&q=60',
      title: 'BRAIN SURGE',
      artist: 'FAKURIA',
      price: '0.02',
    },
    {
      image:
        'https://images.unsplash.com/photo-1617791160505-6f00504e3519?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwcm9maWxlLXBhZ2V8MTA5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=700&q=60',
      title: 'DISC RAP',
      artist: 'FAKURIA',
      price: '0.01',
    },
  ]
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
          {featureCardArr.map((card) => (
            <FeaturedCard
              image={card.image}
              title={card.title}
              artist={card.artist}
              price={card.price}
              key={card.title}
            />
          ))}
          {/* <FeaturedCard />
          <FeaturedCard />
          <FeaturedCard /> */}
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
