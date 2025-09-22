import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/authSlice";
import auth from "../assets/auth.jpg"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false)
  const [resetStep, setResetStep] = useState(1)
  const [resetInput, setResetInput] = useState({ email: "", code: "", newPassword: "" })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
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
    
    // Email validation
    if (!input.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(input.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }
    
    // Password validation
    if (!input.password) {
      newErrors.password = "Password is required";
    } else if (input.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
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
      const response = await axios.post(`/api/v1/user/login`, input, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true
      });
      
      if (response.data.success) {
        navigate('/')
        dispatch(setUser(response.data.user))
        toast.success(response.data.message)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed. Please try again.";
      setErrors({ general: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const [showPassword, setShowPassword] = useState(false);

  const requestResetCode = async () => {
    if (!resetInput.email) {
      return toast.error("Email is required")
    }
    try {
      const res = await axios.post(`/api/v1/user/password/request-reset`, { email: resetInput.email }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      })
      if (res.data) {
        toast.success("If the email exists, a code was sent")
        setResetStep(2)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Could not send code")
    }
  }

  const resetPassword = async () => {
    if (!resetInput.email || !resetInput.code || !resetInput.newPassword) {
      return toast.error("All fields are required")
    }
    try {
      const res = await axios.post(`/api/v1/user/password/reset`, resetInput, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      })
      if (res.data.success) {
        toast.success("Password reset successful")
        setForgotOpen(false)
        setResetStep(1)
        setResetInput({ email: "", code: "", newPassword: "" })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reset failed")
    }
  }
  return (
    <div className="flex items-center h-screen md:pt-14 md:h-[760px] ">
      <div className="hidden md:block">
        <img src={auth} alt="" className='h-[700px]' />
      </div>
      <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 dark:border-gray-600">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">Login into your account</CardTitle>
          <p className='text-gray-600 dark:text-gray-300 mt-2 text-sm font-serif text-center'>Enter your details below to login your account</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}
            
            <div>
              <Label>Email</Label>
              <Input 
                type="email"
                placeholder="Email Address"
                name="email"
                value={input.email}
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
                placeholder="Enter Your Password"
                name="password"
                value={input.password}
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

            <div className="flex items-center justify-between">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <p className='text-gray-600 dark:text-gray-300'>Don't have an account? <Link to={'/signup'}><span className='underline cursor-pointer hover:text-gray-800'>Sign up</span></Link></p>
              <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
                <DialogTrigger asChild>
                  <button type="button" className="underline text-blue-600 dark:text-blue-400">Forgot password?</button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reset your password</DialogTitle>
                  </DialogHeader>
                  {resetStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label>Email</Label>
                        <Input type="email" placeholder="Email Address" value={resetInput.email} onChange={(e)=> setResetInput((p)=> ({...p, email: e.target.value}))} className="dark:border-gray-600 dark:bg-gray-900" />
                      </div>
                      <Button type="button" onClick={requestResetCode} className="w-full">Send code</Button>
                    </div>
                  )}
                  {resetStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label>Verification code</Label>
                        <Input type="text" placeholder="6-digit code" value={resetInput.code} onChange={(e)=> setResetInput((p)=> ({...p, code: e.target.value}))} className="dark:border-gray-600 dark:bg-gray-900" />
                      </div>
                      <div>
                        <Label>New password</Label>
                        <Input type="password" placeholder="New password" value={resetInput.newPassword} onChange={(e)=> setResetInput((p)=> ({...p, newPassword: e.target.value}))} className="dark:border-gray-600 dark:bg-gray-900" />
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="secondary" onClick={()=> setResetStep(1)}>Back</Button>
                        <Button type="button" onClick={resetPassword} className="flex-1">Reset password</Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

export default Login
