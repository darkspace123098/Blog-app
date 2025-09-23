import axios from 'axios'
import React, { useEffect, useState } from 'react'
import userLogo from "../assets/user.jpg"

const PopularAuthors = () => {
    const [popularUser, setPopularUser] = useState([])
    const getAllUsers = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/user/all-users`)
            if (res.data.success) {
                setPopularUser(res.data.users)
            }
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        getAllUsers()
    }, [])
    return (
        <div className='py-12 md:py-16 bg-white dark:bg-gray-900'>
            <div className='max-w-7xl mx-auto px-4 md:px-6 lg:px-8'>
                {/* Header Section */}
                <div className='flex flex-col space-y-4 items-center mb-12'>
                    <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-center'>Popular Authors</h1>
                    <hr className='w-24 border-2 border-red-500 rounded-full' />
                </div>
                
                {/* Authors Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12'>
                    {popularUser?.slice(0, 6)?.map((user, index) => (
                        <div 
                            key={index} 
                            className='flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1'
                        >
                            <div className="relative mb-4">
                                <img 
                                    src={user.photoUrl || userLogo} 
                                    alt={`${user.firstName} ${user.lastName}`}
                                    className='rounded-full h-20 w-20 md:h-24 md:w-24 lg:h-28 lg:w-28 object-cover border-4 border-white dark:border-gray-700 shadow-lg' 
                                />
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"></div>
                            </div>
                            <h3 className='text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-1'>
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                                {user.occupation || 'Content Creator'}
                            </p>
                            <div className="flex space-x-2">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                    Follow
                                </button>
                                <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PopularAuthors
