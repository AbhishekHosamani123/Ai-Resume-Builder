import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import EditResume from './components/EditResume'
import AtsChecker from './pages/AtsChecker'
import { initSmoothScroll } from './lib/smoothScroll'

const App = () => {
  useEffect(() => initSmoothScroll(), [])

  return (
    <>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/resume/:resumeId' element={<EditResume />} />
        <Route path='/ats' element={<AtsChecker />} />
      </Routes>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontSize: '13px',
            borderRadius: '12px',
            background: '#0b282e',
            color: '#fff',
          },
        }}
      />
    </>
  )
}

export default App
