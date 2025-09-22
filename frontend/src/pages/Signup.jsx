import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import React, { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import auth from "../assets/auth.jpg"
// const SERVER_URI = import.meta.env.SERVER_PORT;

const Signup = () => {

    const navigate = useNavigate()
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // First name validation
        if (!user.firstName.trim()) {
            newErrors.firstName = "First name is required";
        } else if (user.firstName.trim().length < 2) {
            newErrors.firstName = "First name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(user.firstName.trim())) {
            newErrors.firstName = "First name can only contain letters and spaces";
        }
        
        // Last name validation
        if (!user.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        } else if (user.lastName.trim().length < 2) {
            newErrors.lastName = "Last name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(user.lastName.trim())) {
            newErrors.lastName = "Last name can only contain letters and spaces";
        }
        
        // Email validation
        if (!user.email.trim()) {
            newErrors.email = "Email is required";
        } else {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(user.email)) {
                newErrors.email = "Please enter a valid email address";
            }
        }
        
        // Password validation
        if (!user.password) {
            newErrors.password = "Password is required";
        } else if (user.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        } else if (user.password.length > 50) {
            newErrors.password = "Password must be less than 50 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(user.password)) {
            newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await axios.post(`http://localhost:8000/api/v1/user/register`, user, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            
            if (response.data.success) {
                navigate('/login')
                toast.success(response.data.message)
            } else {
                const errorMessage = response.data.message || "Registration failed. Please try again.";
                setErrors({ general: errorMessage });
                toast.error(errorMessage);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            setErrors({ general: errorMessage });
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex  h-screen md:pt-14 md:h-[760px] ">
            <div className='hidden md:block'>
                <img src={auth} alt="" className='h-[700px]'  />
            </div>
            <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
                <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
                    <CardHeader>
                        <CardTitle>
                            <h1 className="text-center text-xl font-semibold">Create an account</h1>
                        </CardTitle>
                        <p className=' mt-2 text-sm font-serif text-center dark:text-gray-300'>Enter your details below to create your account</p>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {errors.general && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errors.general}</AlertDescription>
                                </Alert>
                            )}
                            
                            <div className='flex gap-3'>
                                <div className="flex-1">
                                    <Label>First Name</Label>
                                    <Input 
                                        type="text"
                                        placeholder="First Name"
                                        name="firstName"
                                        value={user.firstName}
                                        onChange={handleChange}
                                        className={`dark:border-gray-600 dark:bg-gray-900 ${errors.firstName ? 'border-red-500' : ''}`}
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <Label>Last Name</Label>
                                    <Input 
                                        type="text"
                                        placeholder="Last Name"
                                        name="lastName"
                                        value={user.lastName}
                                        onChange={handleChange}
                                        className={`dark:border-gray-600 dark:bg-gray-900 ${errors.lastName ? 'border-red-500' : ''}`}
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <Label>Email</Label>
                                <Input 
                                    type="email"
                                    placeholder="john.doe@example.com"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    className={`dark:border-gray-600 dark:bg-gray-900 ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div className="relative">
                                <Label>Password</Label>
                                <Input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a Password"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    className={`dark:border-gray-600 dark:bg-gray-900 ${errors.password ? 'border-red-500' : ''}`}
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-9 text-gray-500"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating Account..." : "Sign Up"}
                            </Button>
                            <p className='text-center text-gray-600 dark:text-gray-300'>Already have an account? <Link to={'/login'}><span className='underline cursor-pointer hover:text-gray-800 dark:hover:text-gray-100'>Sign in</span></Link></p>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default Signup
