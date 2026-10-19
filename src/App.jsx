import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import TopBar from './components/TopBar'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import Services from './pages/Services'
import AboutContact from './pages/AboutContact'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section exists after a route change.
      requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView())
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <TopBar />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about-contact" element={<AboutContact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
