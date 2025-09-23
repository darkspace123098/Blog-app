import React from 'react'
import Signup from './pages/Signup'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Profile from './pages/Profile'
import Blog from './pages/Blog'
import CreateBlog from './pages/CreateBlog'
import Dashboard from './pages/Dashboard'
import YourBlog from './pages/YourBlog'
import BlogView from './pages/BlogView'
import Footer from './components/Footer'
import About from './pages/About'
import Comments from './pages/Comments'
import UpdateBlog from './pages/UpdateBlog'
import ProtectedRoute from './components/ProtectedRoute'
import SearchList from './pages/SearchList'
import PageShell from './components/PageShell'
import NewsletterSubscribers from './pages/NewsletterSubscribers'
import AdminLayout from './components/AdminLayout'
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminBlogs from './pages/AdminBlogs'
import AdminSetup from './pages/AdminSetup'
import AdminSettings from './pages/AdminSettings'

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageShell><Navbar/><Home /><Footer/></PageShell>
  },
  {
    path: "/blogs",
    element: <PageShell><Navbar/><Blog /><Footer/></PageShell>
  },
  {
    path: "/about",
    element: <PageShell><Navbar/><About /><Footer/></PageShell>
  },
  {
    path: "/search",
    element: <PageShell><Navbar/><SearchList/><Footer/></PageShell>
  },
  {
    path: "/blogs/:blogId",
    element: <PageShell><Navbar/><ProtectedRoute><BlogView /></ProtectedRoute></PageShell>
  },
 
  {
    path: "/profile",
    element: <PageShell><Navbar/><Profile /></PageShell>
  },
  // {
  //   path: "write-blog/:blogId",
  //       element: <><Navbar/><CreateBlog /></>
  // },
  // {
  //   path: "/dashboard",
  //   element: <><Navbar/><Dashboard /></>
  // },
  {
    path:"/dashboard",
    element: <><Navbar/><ProtectedRoute><Dashboard/></ProtectedRoute></>,
    children:[
      {
        path: "write-blog",
        element:<><CreateBlog/></>
      },
      {
        path: "write-blog/:blogId",
        element: <><UpdateBlog /></>
      },
      {
        path: "your-blog",
        element:<YourBlog/>
      },
      {
        path: "comments",
        element:<Comments/>
      },
      {
        path: "profile",
        element:<Profile/>
      },
      {
        path: "newsletter",
        element:<NewsletterSubscribers/>
      },
      
      
    ]
   },
  {
    path: "/signup",
    element: <PageShell><Navbar/><Signup /></PageShell> 
  },
  {
    path: "/login",
    element: <PageShell><Navbar/><Login /></PageShell>
  },
  {
    path: "/admin-setup",
    element: <AdminSetup />
  },
  // Admin routes
  {
    path: "/admin",
    element: <AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>,
    children: [
      {
        path: "dashboard",
        element: <AdminDashboard />
      },
      {
        path: "users",
        element: <AdminUsers />
      },
      {
        path: "blogs",
        element: <AdminBlogs />
      },
      {
        path: "newsletter",
        element: <NewsletterSubscribers />
      },
      {
        path: "settings",
        element: <AdminSettings />
      }
    ]
  },
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
