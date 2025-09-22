import AdminSidebar from './AdminSidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <div className='flex'>
            <AdminSidebar />
            <div className='flex-1'>
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout
