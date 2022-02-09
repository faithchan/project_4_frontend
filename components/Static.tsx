import Navbar from './Navbar'
import Footer from './Footer'
import 'tailwindcss/tailwind.css'
import TradesNavigation from './TradesNavigation'

const Layout = ({ children }: { children: any }) => {
  return (
    <div className="bg-bgimg bg-cover">
      <Navbar />
      <TradesNavigation />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
