import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import VerifyEmail from './pages/VerifyEmail.jsx'
import CreateAd from './pages/CreateAd.jsx'
import Advertisement from './pages/Advertisement.jsx'
import ProfileAdvertiser from './pages/ProfileAdvertiser.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route
          path="/create-ad"
          element={
            <ProtectedRoute requiredUserType="ADVERTISER">
              <CreateAd />
            </ProtectedRoute>
          }
        />
        <Route path="/advertisement/:id" element={<Advertisement />} />
        <Route path="/profile-advertiser/:id" element={<ProfileAdvertiser />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)