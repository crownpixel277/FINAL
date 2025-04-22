import Hero from "./components/Hero"
import About from "./components/About"
import Features from "./components/Features"
import CyberAwareness from "./components/CyberAwareness"
import HowItWorks from "./components/HowItWorks"
import Testimonials from "./components/Testimonials"
import CTA from "./components/CTA"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main>
        <Hero />
        <About />
        <Features />
        <CyberAwareness />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
