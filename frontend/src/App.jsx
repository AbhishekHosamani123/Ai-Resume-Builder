import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import UserProvider from './context/UserContext'
import Dashboard from './pages/Dashboard'
import EditResume from './components/EditResume'

const App = () => {
  return (
    <UserProvider>
    <Routes>
      <Route path='/' element={<LandingPage />} /> 
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/resume/:resumeId' element={<EditResume />}/>
    </Routes>
    
    <Toaster toastOptions={{
      className: "",
      style : {
        fontSize: "13px"
      }
    }}/>
    </UserProvider>
  )
}

export default App