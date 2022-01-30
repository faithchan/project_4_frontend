import '../styles/globals.css'
import ExplorePage from './ExplorePage'
import Navbar from '../components/Navbar'


function MyApp() {
  return <div className="bg-bgimg bg-cover">
    <Navbar />
    <ExplorePage />
    
  </div>
}

export default MyApp
