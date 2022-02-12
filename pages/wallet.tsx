import { useEffect, useState, useContext } from 'react'
import Wallet from '../components/Wallet'
import Ellipsis from '../components/Spinner'
import globalContext from '../context/context'

// useHistory to push to previous page once connected

const wallet = () => {
  const [connected, setConnected] = useState<boolean>(false)
  const context = useContext(globalContext)

  const createContract = async () => {
    const body: any = { object: 'hello world' }
    try {
      const response = await fetch(`${process.env.API_ENDPOINT}/contract/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: body,
      })
      const res = await response.json()
      console.log('response:', res)
    } catch (err) {
      console.log(err)
    }
  }

  // useEffect(() => {
  //   if (context.signer) {
  //     createContract()
  //   } else {
  //     console.log('connect wallet')
  //   }
  // }, [context.signer])

  return (
    <div className="flex place-content-center">
      <div>
        <Wallet setConnected={setConnected} isConnected={connected} />
        <Ellipsis />
        {/* <h1>Wallet component has missing props, will need to change this part</h1> */}
      </div>
    </div>
  )
}

export default wallet
