import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
    Users, 
    FileText, 
    MessageSquare, 
    Mail, 
    TrendingUp, 
    Eye,
    Calendar,
    UserPlus
} from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

const AdminDashboard = () => {
    const [stats, setStats] = useState(null)
    const [recentActivity, setRecentActivity] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAdminStats()
    }, [])

    const fetchAdminStats = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:8000/api/v1/admin/stats', {
                withCredentials: true
            })
            
            if (response.data.success) {
                setStats(response.data.stats)
                setRecentActivity(response.data.recentActivity)
            }
        } catch (error) {
            console.error('Error fetching admin stats:', error)
            toast.error('Failed to fetch dashboard data')
        } finally {
            setLoading(false)
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
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome to the admin panel</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.activeUsers || 0} active users
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalBlogs || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats?.publishedBlogs || 0} published
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Comments</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalComments || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Total comments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Newsletter</CardTitle>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Active subscribers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Published Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.totalBlogs > 0 
                                ? Math.round((stats.publishedBlogs / stats.totalBlogs) * 100) 
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Blog publication rate
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">User Activity</CardTitle>
                        <UserPlus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.activeUsers > 0 
                                ? Math.round((stats.activeUsers / stats.totalUsers) * 100) 
                                : 0}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Active user rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Recent Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity?.users?.map((user, index) => (
                                <div key={user._id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">{formatDate(user.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Recent Blogs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity?.blogs?.map((blog, index) => (
                                <div key={blog._id} className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">{blog.title}</p>
                                        <p className="text-sm text-gray-500">
                                            by {blog.author.firstName} {blog.author.lastName}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={blog.isPublished ? "default" : "secondary"}>
                                            {blog.isPublished ? "Published" : "Draft"}
                                        </Badge>
                                        <p className="text-sm text-gray-500 mt-1">{formatDate(blog.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default AdminDashboard
