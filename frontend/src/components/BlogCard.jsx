import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { Badge } from './ui/badge'

const BlogCard = ({blog}) => {
    const navigate = useNavigate()
    const date = new Date(blog.createdAt)
    const formattedDate = date.toLocaleDateString("en-GB");
    
    return (
        <div className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
            {/* Image Section */}
            <div className="relative overflow-hidden">
                <img 
                    src={blog.thumbnail} 
                    alt={blog.title}
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
                        {blog.category}
                    </Badge>
                </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6 flex flex-col flex-grow">
                {/* Meta Information */}
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>By {blog.author?.firstName || 'Unknown'}</span>
                    <span className="mx-2">•</span>
                    <span>{formattedDate}</span>
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight overflow-hidden" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                }}>
                    {blog.title}
                </h2>
                
                {/* Subtitle */}
                {blog.subtitle && (
                    <h3 className='text-gray-600 dark:text-gray-300 text-sm mb-4 overflow-hidden' style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {blog.subtitle}
                    </h3>
                )}
                
                {/* Tags Section */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="mt-auto mb-4">
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.slice(0, 3).map((tag, index) => (
                                <Badge 
                                    key={index} 
                                    variant="outline" 
                                    className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors border-gray-300 dark:border-gray-600"
                                    onClick={() => navigate(`/blogs?tag=${encodeURIComponent(tag)}`)}
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {blog.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs border-gray-300 dark:border-gray-600">
                                    +{blog.tags.length - 3} more
                                </Badge>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Read More Button */}
                <Button 
                    onClick={() => navigate(`/blogs/${blog._id}`)} 
                    className="w-full mt-auto bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-colors"
                >
                    Read More
                </Button>
            </div>
        </div>
    )
}

export default BlogCard
