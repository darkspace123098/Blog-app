import React, { useState, useEffect } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import axios from 'axios'

const TagFilter = ({ onTagSelect, selectedTag }) => {
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/v1/blog/tags', {
                    withCredentials: true
                })
                if (res.data.success) {
                    setTags(res.data.tags)
                }
            } catch (error) {
                console.error('Error fetching tags:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchTags()
    }, [])

    if (loading) {
        return <div className="text-center py-4">Loading tags...</div>
    }

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
                Filter by Category
            </h3>
            <div className="flex flex-wrap gap-3 justify-center items-center">
                <Button
                    variant={selectedTag === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onTagSelect('all')}
                    className="min-w-[100px]"
                >
                    All Posts
                </Button>
                {tags.map((tag, index) => (
                    <Badge
                        key={index}
                        variant={selectedTag === tag ? 'default' : 'secondary'}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200 px-3 py-1 text-sm font-medium"
                        onClick={() => onTagSelect(tag)}
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
            {tags.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                    No tags available
                </p>
            )}
        </div>
    )
}

export default TagFilter
