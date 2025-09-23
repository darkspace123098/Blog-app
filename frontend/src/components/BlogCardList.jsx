import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const BlogCardList = ({ blog }) => {
    const navigate = useNavigate()
    const date = new Date(blog.createdAt)
    const formattedDate = date.toLocaleDateString("en-GB");
    
    return (
        <article className="bg-white dark:bg-gray-700 dark:border-gray-600 flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            {/* Image Section */}
            <div className="flex-shrink-0 w-full md:w-80 lg:w-72">
                <div className="relative overflow-hidden rounded-lg">
                    <img 
                        src={blog.thumbnail} 
                        alt={blog.title}
                        className='w-full h-48 md:h-40 lg:h-44 object-cover hover:scale-105 transition-transform duration-300' 
                    />
                    <div className="absolute top-3 left-3">
                        <span className="bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full font-medium">
                            {blog.category}
                        </span>
                    </div>
                </div>
            </div>
            
            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    {/* Meta Information */}
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                        <span>By {blog.author?.firstName || 'Unknown'}</span>
                        <span className="mx-2">•</span>
                        <span>{formattedDate}</span>
                    </div>
                    
                    {/* Title */}
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">
                        {blog.title}
                    </h2>
                    
                    {/* Subtitle */}
                    {blog.subtitle && (
                        <p className='text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4 line-clamp-2'>
                            {blog.subtitle}
                        </p>
                    )}
                </div>
                
                {/* Read More Button */}
                <div className="mt-4">
                    <Button 
                        onClick={() => navigate(`/blogs/${blog._id}`)} 
                        className="w-full md:w-auto px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        Read More
                    </Button>
                </div>
            </div>
        </article>
    )
}

export default BlogCardList
