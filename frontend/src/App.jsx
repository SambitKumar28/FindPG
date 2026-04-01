import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VisitePg from './pages/VisitePg'
import About from './pages/About'
import Contact from './pages/Contact'

const App = () => {
  return (
    <BrowserRouter>
    
      <Navbar/>
      <Routes>
       <Route path='/' element={<Home/>} />
       <Route path='/visitpg' element={<VisitePg/>} />
       <Route path='/about' element={<About/>} />
       <Route path='/contact' element={<Contact/>} />
       <Route path='/login' element={<Login/>}/>
       <Route path='/register' element={<Register/>}/>
      </Routes>
      <Footer/>
    
    </BrowserRouter>
    
  )
}

export default App
