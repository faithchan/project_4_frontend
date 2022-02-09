import Navbar from './Navbar'
import Footer from './Footer'
import 'tailwindcss/tailwind.css'
import TradesNavgiation from './TradesNavgiation'

const Layout = ({ children }: { children: any }) => {
  return (
    <div className="bg-bgimg bg-cover">
      <Navbar />
      <TradesNavgiation />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
