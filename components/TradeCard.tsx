import React from 'react'

const TradeCard = () => {
    return (
        <div>
            <div className="w-96 p-8 bg-purple opacity-80 rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all transform duration-500">

              <div className="flex justify-between p-6">
              <span className="font-MT font-semibold text-xs leading-loose mr-10">
                <p>Patient: </p>
                <p>Date:</p>
                <p>Doctor: </p>
                <p>Type:</p>
                <p>Notes:</p>
              </span>

              <span className="font-MT font-semibold text-right leading-loose">
              
              <button className="bg-blue-400 hover:bg-blue-450 text-white font-semibold tracking-widest font-MT py-2 px-4 rounded-full text-xs mx-auto " onClick={()=>window.open("https://us05web.zoom.us/j/5314369063?pwd=SEZzVVR5VE5hYW9XVW4xa1o4SElRdz09")}>Join Zoom</button>
                <ul className="text-xs flex mt-4" >
                <li><button className="bg-red rounded-full w-4 h-4 mr-2 " /></li>
                <p className="text-left cursor-pointer hover:underline">Cancel Appointment</p>
                </ul>
              </span>
              </div>
 
            </div>
        </div>
      
    )
}

export default TradeCard
