import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogCard from './BlogCard';
import BlogCardList from './BlogCardList';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
import { setBlog } from '@/redux/blogSlice';
import axios from 'axios';

const tags = [
    {
        category: "Blogging"
    },
    {
        category: "Web Development"
    },
    {
        category: "Digital Marketing"
    },
    {
        category: "Cooking"
    },
    {
        category: "Photography"
    },
    {
        category: "Sports"
    },
]



const RecentBlog = () => {
    const { blog } = useSelector(store => store.blog)
    const [category, setCategory] = useState("")
    const [suggestedBlogs, setSuggestedBlogs] = useState([])
    const navigate = useNavigate()
    const dispatch = useDispatch()
    console.log(blog);

    useEffect(() => {
        const getAllPublsihedBlogs = async () => {
            try {
                const res = await axios.get(`${process.env.SERVER_PORT}/api/v1/blog/get-published-blogs`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setBlog(res.data.blogs))
                }
            } catch (error) {
                console.log(error);
            }
        }

        const getSuggestedBlogs = async () => {
            try {
                const res = await axios.get(`${process.env.SERVER_PORT}/api/v1/blog/suggested?limit=3`, { withCredentials: true })
                if (res.data.success) {
                    setSuggestedBlogs(res.data.blogs)
                }
            } catch (error) {
                console.log(error);
            }
        }

        getAllPublsihedBlogs()
        getSuggestedBlogs()
    }, [])

    return (
        <div className='bg-gray-100 dark:bg-gray-800 py-12 md:py-16'>
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
                {/* Header Section */}
                <div className='flex flex-col space-y-4 items-center mb-12'>
                    <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center'>Recent Blogs</h1>
                    <hr className='w-24 border-2 border-red-500 rounded-full' />
                </div>
                
                {/* Main Content Layout */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Blog Posts Section */}
                    <div className='lg:col-span-2'>
                        <div className='space-y-6'>
                            {blog?.slice(0, 4)?.map((blog, index) => (
                                <BlogCardList key={index} blog={blog} />
                            ))}
                        </div>
                    </div>
                    
                    {/* Sidebar Section */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg sticky top-8'>
                            {/* Popular Categories */}
                            <div className='mb-8'>
                                <h2 className='text-xl md:text-2xl font-semibold mb-4'>Popular Categories</h2>
                                <div className='flex flex-wrap gap-2'>
                                    {tags.map((item, index) => (
                                        <Badge 
                                            onClick={() => navigate(`/search?q=${item.category}`)} 
                                            key={index} 
                                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                        >
                                            {item.category}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Newsletter Subscription */}
                            <div className='mb-8'>
                                <h2 className='text-lg md:text-xl font-semibold mb-3'>Subscribe to Newsletter</h2>
                                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                                    Get the latest posts and updates delivered straight to your inbox.
                                </p>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full rounded-md border bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm"
                                    />
                                    <Button className="w-full">Subscribe</Button>
                                </div>
                            </div>
                            
                            {/* Suggested Blogs */}
                            <div>
                                <h2 className="text-lg md:text-xl font-semibold mb-3">Suggested Blogs</h2>
                                {suggestedBlogs.length > 0 ? (
                                    <ul className="space-y-3">
                                        {suggestedBlogs.map((blog, idx) => {
                                            const date = new Date(blog.createdAt)
                                            const formattedDate = date.toLocaleDateString("en-GB")
                                            return (
                                                <li
                                                    key={blog._id}
                                                    onClick={() => navigate(`/blogs/${blog._id}`)}
                                                    className="group cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0">
                                                            <img 
                                                                src={blog.thumbnail} 
                                                                alt={blog.title}
                                                                className="w-12 h-12 rounded-lg object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                                                {blog.title}
                                                            </h3>
                                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                                <span>By {blog.author?.firstName || 'Unknown'}</span>
                                                                <span className="mx-1">•</span>
                                                                <span>{formattedDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            No suggested blogs available at the moment.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecentBlog
