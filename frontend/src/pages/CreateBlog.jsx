import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { setBlog } from '@/redux/blogSlice'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const CreateBlog = () => {
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [tags, setTags] = useState("")
    const [errors, setErrors] = useState({})
    const {blog} = useSelector(store=>store.blog)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    const getSelectedCategory = (value) => {
        setCategory(value)
        // Clear category error when user selects a category
        if (errors.category) {
            setErrors(prev => ({ ...prev, category: "" }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!title.trim()) {
            newErrors.title = "Title is required"
        } else if (title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters long"
        }
        
        if (!category) {
            newErrors.category = "Please select a category"
        }
        
        if (tags.trim() && tags.split(',').some(tag => tag.trim().length === 0)) {
            newErrors.tags = "Tags cannot be empty"
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const createBlogHandler = async () => {
        if (!validateForm()) {
            return
        }
        
        try {
            setLoading(true)
            const res = await axios.post(`http://localhost:8000/api/v1/blog/`, { title, category, tags }, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            })
            if (res.data.success) {
                dispatch(setBlog([...blog, res.data.blog]))
                navigate(`/dashboard/write-blog/${res.data.blog._id}`)
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message || "Something went wrong");
            }
        } catch (error) {
            console.log(error)
            if (error.response?.data?.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Failed to create blog. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className='p-4 md:pr-20 h-screen md:ml-[320px] pt-20'>
            <Card className="md:p-10 p-4 dark:bg-gray-800">
            <h1 className='text-2xl font-bold'>Lets create blog</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex eius necessitatibus fugit vel distinctio architecto, ut ratione rem nobis eaque?</p>
            <div className='mt-10 '>
                <div>
                    <Label>Title *</Label>
                    <Input 
                        type="text" 
                        placeholder="Your Blog Name" 
                        value={title} 
                        onChange={(e) => {
                            setTitle(e.target.value)
                            if (errors.title) {
                                setErrors(prev => ({ ...prev, title: "" }))
                            }
                        }} 
                        className={`bg-white dark:bg-gray-700 ${errors.title ? 'border-red-500' : ''}`} 
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div className='mt-4 mb-5'>
                    <Label>Category *</Label>
                    <Select onValueChange={getSelectedCategory} value={category}>
                        <SelectTrigger className={`w-[180px] bg-white dark:bg-gray-700 ${errors.category ? 'border-red-500' : ''}`}>
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="Web Development">Web Development</SelectItem>
                                <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                                <SelectItem value="Blogging">Blogging</SelectItem>
                                <SelectItem value="Photography">Photography</SelectItem>
                                <SelectItem value="Cooking">Cooking</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
                <div className='mt-4 mb-5'>
                    <Label>Tags</Label>
                    <Input 
                        type="text" 
                        placeholder="Enter tags separated by commas (e.g., react, javascript, tutorial)" 
                        value={tags} 
                        onChange={(e) => {
                            setTags(e.target.value)
                            if (errors.tags) {
                                setErrors(prev => ({ ...prev, tags: "" }))
                            }
                        }} 
                        className={`bg-white dark:bg-gray-700 ${errors.tags ? 'border-red-500' : ''}`} 
                    />
                    <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
                    {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
                </div>
                <div className='flex gap-2'>
                    {/* <Button  variant="outline">Cancel</Button> */}
                    <Button className="" disabled={loading} onClick={createBlogHandler}>
                        {
                            loading ? <><Loader2 className='mr-1 h-4 w-4 animate-spin' />Please wait</> : "Create"
                        }
                    </Button>
                </div>
            </div>
            </Card>
           
        </div>
    )
}

export default CreateBlog
