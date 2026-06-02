import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Features from './sections/Features'
import Calculator from './sections/Calculator'
import PrepaymentAnalyzer from './sections/PrepaymentAnalyzer'
import YearlyPrepaymentAnalyzer from './sections/YearlyPrepaymentAnalyzer'
import ScenarioComparison from './sections/ScenarioComparison'
import AIRecommendations from './sections/AIRecommendations'
import Analytics from './sections/Analytics'
import Schedule from './sections/Schedule'
import Insights from './sections/Insights'
import CTA from './sections/CTA'
import FAQ from './sections/FAQ'
import Footer from './sections/Footer'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import { CalculatorProvider } from './context/CalculatorContext'

function AppContent() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-50"
        role="status"
        aria-label="Loading LoanVix"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center" aria-hidden="true">
            <span className="text-white text-2xl font-bold">₹</span>
          </div>
          <p className="text-gray-500 text-sm font-medium animate-pulse">Loading LoanVix...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollProgress />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Features />
        <Calculator />
        <Schedule />
        <Analytics />
        <PrepaymentAnalyzer />
        <YearlyPrepaymentAnalyzer />
        <ScenarioComparison />
        <AIRecommendations />
        {/* <Insights />
        <CTA /> */}
        <FAQ />
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}

export default function App() {
  return (
    <CalculatorProvider>
      <AppContent />
    </CalculatorProvider>
  )
}
