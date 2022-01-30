import React from 'react'
import SignupSection from '../components/SignupSection'
import FeaturedCard from '../components/FeaturedCard'

const ExplorePage = () => {
    return (
        <div className="">

            <div className="">
            <SignupSection />
            </div>

            <div className="mx-52">
                <h1 className="font-header text-gold text-center text-xl">
                    Featured Artist NFTs
                </h1>
                <div className="flex justify-between space-x-14 mt-14">
                    <FeaturedCard />
                    <FeaturedCard />
                    <FeaturedCard />
                </div>
            </div>

            <div className="mx-32 mt-20">
                <h1 className="font-header text-center text-gold text-xl">
                    About Arkiv
                </h1>
                <p className="my-14 mx-20 font-body text-gray-300 text-md leading-loose text-center">
                A place to showcase your style at the same time provide designers a safe space where works here are valued and verified by our internal team. Anyone can sign up, start buying and trading NFTs, however, users who wish to put up digital works for sale must be verified. To get verified click here. Our team will notify you once checks have been completed. Successful verification is subjected to our team’s approval.  
                </p>
                <hr className="mb-6"></hr>
            </div>
      
        </div>
    )
}

export default ExplorePage
