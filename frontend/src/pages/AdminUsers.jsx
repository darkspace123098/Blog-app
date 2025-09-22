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
    Users, 
    Search, 
    MoreHorizontal, 
    Shield, 
    UserX, 
    Trash2,
    Edit
} from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { toast } from 'sonner'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pagination, setPagination] = useState({})
    const [selectedRole, setSelectedRole] = useState('')

    useEffect(() => {
        fetchUsers()
    }, [currentPage, searchTerm])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams({
                page: currentPage,
                limit: 10,
                ...(searchTerm && { search: searchTerm })
            })

            const response = await axios.get(`http://localhost:8000/api/v1/admin/users?${params}`, {
                withCredentials: true
            })
            
            if (response.data.success) {
                setUsers(response.data.users)
                setPagination(response.data.pagination)
            }
        } catch (error) {
            console.error('Error fetching users:', error)
            toast.error('Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1)
    }

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/v1/admin/users/${userId}/role`,
                { role: newRole },
                { withCredentials: true }
            )
            
            if (response.data.success) {
                toast.success('User role updated successfully')
                fetchUsers()
            }
        } catch (error) {
            console.error('Error updating user role:', error)
            toast.error('Failed to update user role')
        }
    }

    const handleToggleStatus = async (userId) => {
        try {
            const response = await axios.put(
                `http://localhost:8000/api/v1/admin/users/${userId}/toggle-status`,
                {},
                { withCredentials: true }
            )
            
            if (response.data.success) {
                toast.success(response.data.message)
                fetchUsers()
            }
        } catch (error) {
            console.error('Error toggling user status:', error)
            toast.error('Failed to update user status')
        }
    }

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return
        }

        try {
            const response = await axios.delete(
                `http://localhost:8000/api/v1/admin/users/${userId}`,
                { withCredentials: true }
            )
            
            if (response.data.success) {
                toast.success('User deleted successfully')
                fetchUsers()
            }
        } catch (error) {
            console.error('Error deleting user:', error)
            toast.error('Failed to delete user')
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getRoleBadgeVariant = (role) => {
        switch (role) {
            case 'superadmin':
                return 'destructive'
            case 'admin':
                return 'default'
            default:
                return 'secondary'
        }
    }

    if (loading) {
        return (
            <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading users...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage users and their roles</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Users ({pagination.totalUsers || 0})
                        </CardTitle>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search users..."
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
                        {users.map((user) => (
                            <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                                        <p className="text-xs text-gray-400">Joined {formatDate(user.createdAt)}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <Badge variant={getRoleBadgeVariant(user.role)}>
                                        {user.role}
                                    </Badge>
                                    
                                    <Badge variant={user.isActive ? "default" : "secondary"}>
                                        {user.isActive ? "Active" : "Inactive"}
                                    </Badge>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="sm">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => setSelectedRole(user._id)}>
                                                <Shield className="h-4 w-4 mr-2" />
                                                Change Role
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleToggleStatus(user._id)}>
                                                <UserX className="h-4 w-4 mr-2" />
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </DropdownMenuItem>
                                            {user.role !== 'superadmin' && (
                                                <DropdownMenuItem 
                                                    onClick={() => handleDeleteUser(user._id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            )}
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
                                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalUsers)} of {pagination.totalUsers} users
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

            {/* Role Change Dialog */}
            {selectedRole && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <Card className="w-96">
                        <CardHeader>
                            <CardTitle>Change User Role</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Select onValueChange={(value) => handleRoleChange(selectedRole, value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select new role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                        <SelectItem value="superadmin">Super Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setSelectedRole('')}>
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}

export default AdminUsers
