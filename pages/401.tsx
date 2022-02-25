import Error401 from '../components/401Section'
import type { NextPage } from 'next'

const error: NextPage = () => {
  return (
    <div>
      <Error401 />
    </div>
  )
}

export default error
