import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'

const AdminProtectedRoute = ({ children }) => {
    const { user } = useSelector(store => store.auth)
    const [isAdmin, setIsAdmin] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user) {
                console.log('No user found, redirecting to login')
                setLoading(false)
                return
            }

            console.log('Checking admin status for user:', user)
            console.log('User role:', user.role)

            try {
                // Check if user has admin role
                if (user.role && ['admin', 'superadmin'].includes(user.role)) {
                    console.log('User has admin privileges')
                    setIsAdmin(true)
                } else {
                    console.log('User does not have admin privileges')
                    setIsAdmin(false)
                }
            } catch (error) {
                console.error('Error checking admin status:', error)
                setIsAdmin(false)
            } finally {
                setLoading(false)
            }
        }

        checkAdminStatus()
    }, [user])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking permissions...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    if (isAdmin === false) {
        toast.error('Access denied. Admin privileges required.')
        return <Navigate to="/" />
    }

    return <>{children}</>
}

export default AdminProtectedRoute
