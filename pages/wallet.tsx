import { useEffect, useState, useContext } from 'react'
import Wallet from '../components/Wallet'
import Ellipsis from '../components/Spinner'
import globalContext from '../context/context'

// useHistory to push to previous page once connected

const wallet = () => {
  const [connected, setConnected] = useState<boolean>(false)
  const context = useContext(globalContext)

  return (
    <div className="flex place-content-center">
      <div>
        <Wallet setConnected={setConnected} isConnected={connected} />
        <Ellipsis />
      </div>
    </div>
  )
}

export default wallet
