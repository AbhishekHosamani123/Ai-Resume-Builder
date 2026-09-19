import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import EditResume from './components/EditResume'
import AtsChecker from './pages/AtsChecker'

const App = () => {
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
            background: '#0b1b33',
            color: '#fff',
          },
        }}
      />
    </>
  )
}

export default App
