import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { 
    FileText, 
    Search, 
    MoreHorizontal, 
    Eye, 
    EyeOff, 
    Trash2,
    Edit,
    Calendar
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { toast } from 'sonner'

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({})

    useEffect(() => {
        fetchBlogs()
    }, [currentPage, searchTerm, statusFilter])

    const fetchBlogs = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...(searchTerm && { search: searchTerm }),
                ...(statusFilter !== 'all' && { status: statusFilter })
            })

            const response = await axios.get(`http://localhost:8000/api/v1/admin/blogs?${params}`, {
                withCredentials: true
            })
            
            if (response.data.success) {
                setBlogs(response.data.blogs)
                setPagination(response.data.pagination)
            }
        } catch (error) {
            console.error('Error fetching blogs:', error)
            toast.error('Failed to fetch blogs')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleStatusChange = (value) => {
        setStatusFilter(value)
        setCurrentPage(1)
    }

    const handleTogglePublish = async (blogId) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/v1/admin/blogs/${blogId}/toggle-status`,
                {},
                { withCredentials: true }
            )
            
            if (response.data.success) {
                toast.success(response.data.message)
                fetchBlogs()
            }
        } catch (error) {
            console.error('Error toggling blog status:', error)
            toast.error('Failed to update blog status')
        }
    }

    const handleDeleteBlog = async (blogId) => {
        if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
            return
        }

        try {
            const response = await axios.delete(
                `http://localhost:8000/api/v1/admin/blogs/${blogId}`,
                { withCredentials: true }
            )
            
            if (response.data.success) {
                toast.success('Blog deleted successfully')
                fetchBlogs()
            }
        } catch (error) {
            console.error('Error deleting blog:', error)
            toast.error('Failed to delete blog')
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading blogs...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all blogs and their status</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Blogs ({pagination.totalBlogs || 0})
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Blogs</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="unpublished">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search blogs..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-10 w-64"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {blogs.map((blog) => (
                            <div key={blog._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    {blog.thumbnail && (
                                        <img 
                                            src={blog.thumbnail} 
                                            alt={blog.title}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {blog.title}
                                        </p>
                                        {blog.subtitle && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                {blog.subtitle}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            by {blog.author.firstName} {blog.author.lastName}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="outline">{blog.category}</Badge>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(blog.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <Badge variant={blog.isPublished ? "default" : "secondary"}>
                                        {blog.isPublished ? "Published" : "Draft"}
                                    </Badge>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleTogglePublish(blog._id)}>
                                                {blog.isPublished ? (
                                                    <>
                                                        <EyeOff className="h-4 w-4 mr-2" />
                                                        Unpublish
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        Publish
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem 
                                                onClick={() => handleDeleteBlog(blog._id)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <p className="text-sm text-gray-500">
                                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalBlogs)} of {pagination.totalBlogs} blogs
                            </p>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={!pagination.hasPrev}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm">
                                    Page {currentPage} of {pagination.totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={!pagination.hasNext}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminBlogs
