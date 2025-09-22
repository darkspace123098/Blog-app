import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/logo.png'
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa'
import axios from 'axios'
import { toast } from 'sonner'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post('http://localhost:8000/api/v1/newsletter/subscribe', 
        { email }, 
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true 
        }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        setEmail('') // Clear the form
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error(error.response?.data?.message || 'Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className='bg-gray-800 text-gray-200 py-10'>
      <div className='max-w-7xl mx-auto px-4 md:flex md:justify-between'>
        {/*  info */}
        <div className='mb-6 md:mb-0'>
            <Link to='/' className='flex gap-3 items-center'>
              {/* <img src={Logo} alt="" className='w-32'/> */}
              <img src={Logo} alt="" className='invert w-12 h-12'/>
              <h1 className=' text-3xl font-bold'>Tech-Blog</h1>
            </Link>
            <p className='mt-2'>Sharing insights, tutorials, and ideas on web development and tech.</p>
            <p className='mt-2 text-sm'>Fish Dev, Mangalore City, KA 574-142</p>
            <p className='text-sm'>Email: darkspace123098@gmail.com</p>
            <p className='text-sm'>Phone: (91) 8861510777</p>
        </div>
        {/* customer service link */}
        <div className='mb-6 md:mb-0'>
            <h3 className='text-xl font-semibold'>Quick Links</h3>
            <ul className='mt-2 text-sm space-y-2'>
                <li>Home</li>
                <li>Blogs</li>
                <li>About Us</li>
                {/* <li>Contact Us</li> */}
                <li>FAQs</li>
            </ul>
        </div>
        {/* social media links */}
        <div className='mb-6 md:mb-0'>
            <h3 className='text-xl font-semibold'>Follow Us</h3>
            <div className='flex space-x-4 mt-2'>
                <a href="https://instagram.com/irshadali_313" target="_blank" rel="noopener noreferrer"><FaFacebook/></a>
                <a href="https://instagram.com/irshadali_313" target="_blank" rel="noopener noreferrer"><FaInstagram/></a>
                <FaTwitterSquare/>
                <FaPinterest/>
            </div>
        </div>
        {/* newsletter subscription */}
        <div>
            <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
            <p className='mt-2 text-sm'>Subscribe to get special offers, free giveaways, and more</p>
            <form onSubmit={handleNewsletterSubmit} className='mt-4 flex'>
                <input 
                type="email" 
                placeholder='Your email address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className='w-full p-2 rounded-l-md bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50'
                />
                <button 
                type='submit' 
                disabled={loading}
                className='bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  {loading ? 'Subscribing...' : 'Subscribe'}
                </button>
            </form>
        </div>
      </div>
      {/* bottom section */}
      <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
        <p>&copy; {new Date().getFullYear()} <span className='text-red-500'>Tech-Blog</span>. All rights reserved</p>
      </div>
    </footer>
  )
}

export default Footer