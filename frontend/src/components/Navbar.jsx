import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='bg-amber-100 shadow-md sticky top-0 z-50'>
      <div className='flex justify-center items-center px-4 py-3 max-w-7xl mx-auto'>

        {/* logo */}
        <Link to="/" ></Link>
      </div>

    </nav>
  )
}

export default Navbar
