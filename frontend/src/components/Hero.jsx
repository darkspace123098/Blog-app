import React from 'react'
import heroImg from "../assets/blog2.png"
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='px-4 md:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col lg:flex-row items-center justify-between min-h-[600px] py-8 md:py-12'>
          {/* text section */}
          <div className="flex-1 max-w-2xl lg:max-w-none lg:flex-1 mb-8 lg:mb-0 lg:pr-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Explore the Latest Tech & Web Trends
            </h1>
            <p className="text-base sm:text-lg md:text-xl opacity-80 mb-6 leading-relaxed">
              Stay ahead with in-depth articles, tutorials, and insights on web development, digital marketing, and tech innovations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={"/dashboard/write-blog"}>
                <Button className="w-full sm:w-auto text-base sm:text-lg px-6 py-3">
                  Get Started
                </Button>
              </Link>
              <Link to={"/about"}>
                <Button variant="outline" className="w-full sm:w-auto border-2 px-6 py-3 text-base sm:text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          
          {/* image section */}
          <div className='flex-1 flex items-center justify-center lg:justify-end'>
            <div className="relative">
              <img 
                src={heroImg} 
                alt="Tech and Web Development" 
                className='w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl h-auto object-contain'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
