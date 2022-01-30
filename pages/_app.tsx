import '../styles/globals.css'
import ExplorePage from './ExplorePage'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'


function MyApp() {
  return <div className="bg-bgimg bg-cover">
    <Navbar />
    <ExplorePage />
    <Footer />
    
  </div>
}

export default MyApp
