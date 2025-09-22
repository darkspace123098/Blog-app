import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'

const AdminSetup = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleInitializeAdmin = async (e) => {
        e.preventDefault()
        
        try {
            setLoading(true)
            const response = await axios.post('http://localhost:8000/api/v1/user/initialize-admin', 
                {}, 
                { 
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true 
                }
            )

            if (response.data.success) {
                toast.success(response.data.message)
                setSuccess(true)
                console.log('Admin credentials:', response.data.credentials)
            }
        } catch (error) {
            console.error('Error initializing admin:', error)
            toast.error(error.response?.data?.message || 'Failed to initialize admin')
        } finally {
            setLoading(false)
        }
    }

    const handlePromoteToAdmin = async (e) => {
        e.preventDefault()
        
        if (!email) {
            toast.error('Please enter an email address')
            return
        }

        try {
            setLoading(true)
            const response = await axios.post('http://localhost:8000/api/v1/user/promote-admin', 
                { email }, 
                { 
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true 
                }
            )

            if (response.data.success) {
                toast.success(response.data.message)
                setSuccess(true)
                setEmail('')
            }
        } catch (error) {
            console.error('Error promoting user to admin:', error)
            toast.error(error.response?.data?.message || 'Failed to promote user to admin')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Shield className="mx-auto h-12 w-12 text-blue-600" />
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                        Admin Setup
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Promote a user to admin role
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Promote User to Admin</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    Admin has been successfully created! You can now access the admin panel.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <div className="space-y-4">
                                <Button onClick={handleInitializeAdmin} className="w-full" disabled={loading}>
                                    {loading ? 'Creating Admin...' : 'Create First Admin'}
                                </Button>
                                
                                <div className="text-center text-sm text-gray-500">OR</div>
                                
                                <form onSubmit={handlePromoteToAdmin} className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter user's email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                
                                <Alert className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                                        This will promote the user to admin role. Make sure the user exists in the system.
                                    </AlertDescription>
                                </Alert>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? 'Promoting...' : 'Promote to Admin'}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        After promoting a user, they can access the admin panel at{' '}
                        <a href="/admin/dashboard" className="text-blue-600 hover:underline">
                            /admin/dashboard
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default AdminSetup
