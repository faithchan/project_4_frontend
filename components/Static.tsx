import Navbar from './Navbar'
import Footer from './Footer'
import TestBar from './TestBar'
import 'tailwindcss/tailwind.css'

const Layout = ({ children }: { children: any }) => {
  return (
    <div className="bg-bgimg bg-cover">
      <Navbar />
      <TestBar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
