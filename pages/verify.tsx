import type { NextPage } from 'next'
import { useState } from 'react'
import emailjs from 'emailjs-com'

const Verify: NextPage = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [wallet, setWallet] = useState('')
  const [description, setDescription] = useState('')
  const [formSent, setFormSent] = useState(false)

  const submit = (e: any) => {
    e.preventDefault()
    if (name && email && wallet && description) {
      const serviceId = 'service_gyzxz0u'
      const templateId = 'template_4im6s3r'
      const userId = 'user_yHG3d36ZhhPAyUiiOiHwd'
      const templateParams = {
        name,
        email,
        wallet,
        description,
      }

      emailjs
        .send(serviceId, templateId, templateParams, userId)
        .then((response) => console.log(response))
        .then((error) => console.log(error))
      setName('')
      setEmail('')
      setWallet('')
      setDescription('')
      setFormSent(true)
    } else {
      alert('Please fill in all fields.')
    }
  }

  const isValidEmail = (email: any) => {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(String(email).toLowerCase())
  }

  return (
    <div className="max-w-xs w-full p-10 my-20 rounded-xl m-auto sm:max-w-xs md:max-w-lg ">
      <div className="text-center ">
        <div className="text-center font-header tracking-widest text-gold text-2xl">
          Get Verified Today
        </div>
        <p className="text-xs font-body mt-4 text-gold tracking-wider">
          Successful applicants will be notified via email
        </p>
      </div>
      <form className="mt-6 space-y-3" action="#" method="POST ">
        <div className="grid grid-cols-1 space-y-2">
          <label className="text-sm font-body text-gray-300 tracking-wide">Your Name</label>
          <input
            className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="text-sm  font-body text-gray-300 tracking-wide">Your Email</label>
          <input
            className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full"
            type="email"
            placeholder="mail@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="text-sm font-body text-gray-300 tracking-wide">Wallet Address</label>
          <input
            className="bg-gray-800 text-white border border-gray-400 px-4 py-2 outline-none rounded-md w-full"
            type="url"
            placeholder="0x"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />

          <label className="text-sm font-body text-gray-300 tracking-wide ">Description</label>
          <textarea
            className="w-full min-h-[100px] max-h-[300px] bg-gray-800 h-28 appearance-none block text-white border border-gray-400 rounded-lg py-4 px-4"
            placeholder="Brief write up of yourself and include portfolio link"
            spellCheck="false"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <p className="text-xs text-center text-gray-300">
          <span>By submitting, you agree to sharing of personal information.</span>
        </p>
        <div className="flex justify-center">
          <button
            className="bg-gold hover:bg-blue-450 text-white font-semibold tracking-widest font-header py-2 px-8 rounded-full text-xs mx-auto mt-4"
            onClick={submit}
          >
            SUBMIT
          </button>
        </div>
        {formSent ? (
          <h2 className="text-sm text-blue-400 text-center">
            Thank you for your message, we will be in touch in no time!
          </h2>
        ) : (
          ''
        )}
      </form>
    </div>
  )
}

export default Verify
