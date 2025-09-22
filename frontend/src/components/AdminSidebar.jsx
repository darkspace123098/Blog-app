import { 
    LayoutDashboard, 
    Users, 
    FileText, 
    Mail, 
    Settings,
    Shield
} from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {
  return (
    <div className='hidden mt-10 fixed md:block border-r-2 dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-600 0 w-[300px] p-10 space-y-2 h-screen z-10'>
      <div className='text-center pt-10 px-3 space-y-2'>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your blog platform</p>
        </div>
        
        <NavLink to='/admin/dashboard' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
          <LayoutDashboard />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to='/admin/users' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
          <Users />
          <span>Users</span>
        </NavLink>
        
        <NavLink to='/admin/blogs' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
          <FileText />
          <span>Blogs</span>
        </NavLink>
        
        <NavLink to='/admin/newsletter' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
          <Mail />
          <span>Newsletter</span>
        </NavLink>
        
        <NavLink to='/admin/settings' className={({ isActive }) => `text-2xl  ${isActive ? "bg-gray-800 dark:bg-gray-900 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
          <Settings />
          <span>Settings</span>
        </NavLink>
      </div>
    </div>
  )
}

export default AdminSidebar
