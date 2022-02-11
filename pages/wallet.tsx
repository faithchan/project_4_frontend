import { useState } from 'react'
import Wallet from '../components/Wallet'
import Ellipsis from '../components/Spinner'

const wallet = () => {
  const [connected, setConnected] = useState<boolean>(false)
  return (
    <div>
      <Wallet setConnected={setConnected} isConnected={connected} />
      <Ellipsis />
      <h1>Wallet component has missing props, will need to change this part</h1>
    </div>
  )
}

export default wallet
