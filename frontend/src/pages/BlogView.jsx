import React, { useEffect, useState } from 'react'
import {
    Breadcrumb,
    // BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bookmark, Heart, MessageSquare, Share2 } from 'lucide-react'
import CommentBox from '@/components/CommentBox'
import axios from 'axios'
import { FaHeart, FaRegHeart } from 'react-icons/fa6'
import { setBlog } from '@/redux/blogSlice'
import { toast } from 'sonner'

const BlogView = () => {
    const params = useParams()
    const blogId = params.blogId
    const { blog } = useSelector(store => store.blog)
    const { user } = useSelector(store => store.auth)
    const [selectedBlog, setSelectedBlog] = useState(blog.find(p => p._id === blogId))
    const [loading, setLoading] = useState(!selectedBlog)
    const [blogLike, setBlogLike] = useState(selectedBlog?.likes?.length || 0)
    const { comment } = useSelector(store => store.comment)
    const [liked, setLiked] = useState(selectedBlog?.likes?.includes(user?._id) || false);
    const dispatch = useDispatch()
    console.log(selectedBlog);

    // Fetch blog if not available in store
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`http://localhost:8000/api/v1/blog/get-blog/${blogId}`, { withCredentials: true })
                if (res.data.success) {
                    setSelectedBlog(res.data.blog)
                    setBlogLike(res.data.blog?.likes?.length || 0)
                    setLiked(res.data.blog?.likes?.includes(user?._id) || false)
                }
            } catch (error) {
                console.error('Failed to fetch blog:', error)
            } finally {
                setLoading(false)
            }
        }

        if (!selectedBlog) {
            fetchBlog()
        }
    }, [blogId])

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/blog/${selectedBlog?._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
                setBlogLike(updatedLikes);
                setLiked(!liked)

                //apne blog ko update krunga
                const updatedBlogData = blog.map(p =>
                    p._id === selectedBlog._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                )
                toast.success(res.data.message);
                dispatch(setBlog(updatedBlogData))
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        }
    }

    const changeTimeFormat = (isoDate) => {
        const date = new Date(isoDate);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        return formattedDate
    }

    // const handleShare = (blogId) => {
    //     const blogUrl = `${window.location.origin}/blogs/${blogId}`;
    //     navigator.clipboard.writeText(blogUrl).then(() => {
    //         toast.success('Blog link copied to clipboard!');
    //     }).catch((err) => {
    //         console.error('Failed to copy:', err);
    //     });
    // };
    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`;
      
        if (navigator.share) {
          navigator
            .share({
              title: 'Check out this blog!',
              text: 'Read this amazing blog post.',
              url: blogUrl,
            })
            .then(() => console.log('Shared successfully'))
            .catch((err) => console.error('Error sharing:', err));
        } else {
          // fallback: copy to clipboard
          navigator.clipboard.writeText(blogUrl).then(() => {
            toast.success('Blog link copied to clipboard!');
          });
        }
      };

      useEffect(()=>{
        window.scrollTo(0,0)
      },[])
    if (loading) {
        return (
            <div className='pt-14'>
                <div className='max-w-6xl mx-auto p-10'>
                    <p className='text-center text-gray-500'>Loading post...</p>
                </div>
            </div>
        )
    }
    if (!selectedBlog) {
        return (
            <div className='pt-14'>
                <div className='max-w-6xl mx-auto p-10'>
                    <p className='text-center text-gray-500'>Post not found or may have been removed.</p>
                    <div className='text-center mt-4'>
                        <Link to={'/blogs'} className='underline'>Back to Blogs</Link>
                    </div>
                </div>
            </div>
        )
    }

    // Normalize blog to ensure arrays/objects exist
    const safeBlog = {
        ...selectedBlog,
        likes: Array.isArray(selectedBlog.likes) ? selectedBlog.likes : [],
        tags: Array.isArray(selectedBlog.tags) ? selectedBlog.tags : [],
        author: selectedBlog.author || {},
        comments: Array.isArray(selectedBlog.comments) ? selectedBlog.comments : []
    }

    return (
        <div className='pt-14'>
            <div className='max-w-6xl mx-auto p-10'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to={'/'}><BreadcrumbLink >Home</BreadcrumbLink></Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />


                        <BreadcrumbItem>
                            <Link to={'/blogs'}><BreadcrumbLink >Blogs</BreadcrumbLink></Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{safeBlog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {/* Blog Header */}
                <div className="my-8">
                    <h1 className="text-4xl font-bold tracking-tight mb-4">{safeBlog.title}</h1>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <Avatar>
                                <AvatarImage src={safeBlog.author?.photoUrl} alt="Author" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{safeBlog.author?.firstName} {safeBlog.author?.lastName}</p>
                                <p className="text-sm text-muted-foreground">{safeBlog.author?.occupation}</p>
                            </div>
                        </div>
                        <div className="text-sm text-muted-foreground">Published on {changeTimeFormat(safeBlog.createdAt)} • 8 min read</div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="mb-8 rounded-lg overflow-hidden">
                    <img
                        src={safeBlog?.thumbnail}
                        alt="Next.js Development"
                        width={1000}
                        height={500}
                        className="w-full object-cover"
                    />
                    <p className="text-sm text-muted-foreground mt-2 italic">{safeBlog.subtitle}</p>
                </div>

                <p className='' dangerouslySetInnerHTML={{ __html: safeBlog.description }} />

                <div className='mt-10'>
                    {/* Tags */}
                    {safeBlog.tags && safeBlog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            {safeBlog.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    )}

                    {/* Engagement */}
                    <div className="flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8">
                        <div className="flex items-center space-x-4">
                            <Button onClick={likeOrDislikeHandler} variant="ghost" size="sm" className="flex items-center gap-1">
                                {/* <Heart className="h-4 w-4"/> */}
                                {
                                    liked ? <FaHeart size={'24'} className='cursor-pointer text-red-600' /> : <FaRegHeart size={'24'} className='cursor-pointer hover:text-gray-600 text-white' />
                                }

                                <span>{blogLike}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                <span>{(comment?.length || 0)} Comments</span>
                            </Button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                                <Bookmark className="h-4 w-4" />
                            </Button>
                            <Button onClick={()=>handleShare(safeBlog._id)} variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                </div>
                <CommentBox selectedBlog={safeBlog} />

                {/* Author Bio */}
                {/* <Card className="mb-12">
                    <CardContent className="flex items-start space-x-4 pt-6">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" alt="Author" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold mb-1">About Jane Doe</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Jane is a lead developer with over 10 years of experience in web development. She specializes in React and
                                Next.js and has helped numerous companies build modern, performant websites.
                            </p>
                            <Button variant="outline" size="sm">
                                Follow
                            </Button>
                        </div>
                    </CardContent>
                </Card> */}
            </div>
        </div>
    )
}

export default BlogView
