import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import axios from 'axios'
import { toast } from 'sonner'
import { Mail, Users, Calendar } from 'lucide-react'

const NewsletterSubscribers = () => {
    const [subscribers, setSubscribers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSubscribers()
    }, [])

    const fetchSubscribers = async () => {
        try {
            setLoading(true)
            const response = await axios.get('http://localhost:8000/api/v1/newsletter/subscribers', {
                withCredentials: true
            })
            
            if (response.data.success) {
                setSubscribers(response.data.subscribers)
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error)
            toast.error('Failed to fetch subscribers')
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
                        <p className="mt-4 text-gray-600">Loading subscribers...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:pr-20 h-screen md:ml-[320px] pt-20">
            <Card className="w-full">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="h-6 w-6" />
                            Newsletter Subscribers
                        </CardTitle>
                        <Badge variant="secondary" className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {subscribers.length} subscribers
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {subscribers.length === 0 ? (
                        <div className="text-center py-10">
                            <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No subscribers yet</p>
                            <p className="text-gray-400 text-sm">Subscribers will appear here when they sign up for your newsletter</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {subscribers.map((subscriber, index) => (
                                <div key={subscriber._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                {subscriber.email}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                Subscribed on {formatDate(subscriber.subscribedAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        Active
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default NewsletterSubscribers
