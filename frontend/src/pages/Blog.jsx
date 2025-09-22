import BlogCard from '@/components/BlogCard'
import TagFilter from '@/components/TagFilter'
import React, { useEffect, useState } from 'react'
import LMS from "../assets/LMS.png"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setBlog } from '@/redux/blogSlice'
import { useSearchParams } from 'react-router-dom'
// import BlogCardList from '@/components/BlogCardList'

export const blogJson = [
    {
        "id": 1,
        "title": "The Ultimate Guide to Digital Marketing in 2025",
        "author": "Irshad Ali",
        "date": "2025-03-27",
        "content": "Digital marketing is constantly evolving. In 2025, businesses must focus on AI-driven strategies, voice search optimization, and hyper-personalization. This guide covers the latest trends and strategies for success.",
        "tags": ["digital marketing", "SEO", "social media", "PPC"],
        "category": "Marketing",
        "image": LMS
    },
    {
        "id": 2,
        "title": "Building a Full-Stack LMS with MERN Stack",
        "author": "Rahil Ahmed",
        "date": "2025-03-27",
        "content": "A step-by-step guide to building a Learning Management System (LMS) using React, Tailwind CSS, Node.js, Express.js, and MongoDB. Learn how to create courses, manage users, and process payments.",
        "tags": ["MERN stack", "LMS", "React", "Node.js"],
        "category": "Web Development",
        "image": LMS
    },
    {
        "id": 3,
        "title": "Top 10 WordPress Plugins for 2025",
        "author": "Irshad Ali",
        "date": "2025-03-27",
        "content": "WordPress remains the most popular CMS. This article covers the top 10 must-have plugins for security, SEO, performance, and customization in 2025.",
        "tags": ["WordPress", "plugins", "SEO", "website optimization"],
        "category": "WordPress",
        "image": LMS
    },
    {
        "id": 4,
        "title": "How to Use APIs in Web Development",
        "author": "Irshad Ali",
        "date": "2025-03-27",
        "content": "APIs play a crucial role in modern web development. Learn how to integrate third-party APIs, create RESTful APIs with Node.js, and use authentication methods like OAuth.",
        "tags": ["APIs", "web development", "Node.js", "RESTful API"],
        "category": "Web Development",
        "image": LMS
    },
    {
        "id": 5,
        "title": "Search Engine Optimization: The Complete Beginner’s Guide",
        "author": "Rahil Ahmed",
        "date": "2025-03-27",
        "content": "SEO is vital for ranking higher on Google. This guide explains keyword research, on-page and off-page SEO, technical SEO, and the latest trends.",
        "tags": ["SEO", "Google ranking", "keyword research", "backlinks"],
        "category": "Marketing",
        "image": LMS
    }
]


const Blog = () => {
    const dispatch = useDispatch()
    const { blog } = useSelector(store => store.blog)
    const [filteredBlogs, setFilteredBlogs] = useState([])
    const [selectedTag, setSelectedTag] = useState('all')
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const getAllPublsihedBlogs = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/blog/get-published-blogs`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setBlog(res.data.blogs))
                    setFilteredBlogs(res.data.blogs)
                }
            } catch (error) {
                console.log(error);
            }
        }
        getAllPublsihedBlogs()
    }, [])

    // Handle URL parameter for tag filtering
    useEffect(() => {
        const tagFromUrl = searchParams.get('tag')
        if (tagFromUrl) {
            handleTagSelect(tagFromUrl)
        }
    }, [searchParams])

    const handleTagSelect = async (tag) => {
        setSelectedTag(tag)
        if (tag === 'all') {
            setFilteredBlogs(blog)
        } else {
            try {
                const res = await axios.get(`http://localhost:8000/api/v1/blog/tag/${encodeURIComponent(tag)}`, {
                    withCredentials: true
                })
                if (res.data.success) {
                    setFilteredBlogs(res.data.blogs)
                }
            } catch (error) {
                console.error('Error fetching blogs by tag:', error)
            }
        }
    }

    return (
        <div className='pt-16 min-h-screen bg-gray-50 dark:bg-gray-900'>
            {/* Header Section */}
            <div className='max-w-7xl mx-auto text-center flex flex-col space-y-4 items-center py-8'>
                <h1 className='text-4xl md:text-5xl font-bold text-center pt-10 text-gray-900 dark:text-white'>Our Blogs</h1>
                <hr className='w-24 text-center border-2 border-red-500 rounded-full' />
                <p className='text-gray-600 dark:text-gray-300 max-w-2xl px-4'>
                    Discover insights, tutorials, and stories from our community of developers and creators.
                </p>
            </div>
            
            {/* Tag Filter Section */}
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8'>
                    <TagFilter onTagSelect={handleTagSelect} selectedTag={selectedTag} />
                </div>
            </div>

            {/* Blog Grid Section */}
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16'>
                <div className='grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                    {filteredBlogs?.map((blog, index) => (
                        <BlogCard blog={blog} key={blog._id || index} />
                    ))}
                </div>
                
                {filteredBlogs.length === 0 && (
                    <div className='text-center py-16'>
                        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12'>
                            <div className='text-gray-400 dark:text-gray-500 mb-4'>
                                <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
                                </svg>
                            </div>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>No blogs found</h3>
                            <p className='text-gray-500 dark:text-gray-400'>No blogs found for the selected tag. Try selecting a different tag or browse all posts.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Blog
