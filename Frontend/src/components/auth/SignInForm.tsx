import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, Mail } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export interface UserCredentials {
    username: string;
    password: string;
    rememberMe?: boolean;
  }
export const SignInForm = ({setIsRegistering} : {setIsRegistering : (state : boolean) => void}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserCredentials>();

  const onSubmit = async (data: UserCredentials) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/v1/signin",{
             username : data.username,
             password : data.password
      });
      if(response.status !== 200){
        console.log("response:",response);
          alert(response.data.message)
          return;
      }
      const token = response.data.token;
      Cookies.set('token',token, {expires : 2});
      navigate(`/voter/dashboard/${token}`)
      alert(response.data.message);
    }catch(error : any){
      alert(error.response.data.message)
    }
     finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username / Voter ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('username', { required: 'Username is required' })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
                placeholder="Enter your username"
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                {...register('password', { required: 'Password is required' })}
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('rememberMe')}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition duration-300"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a
              href="#forgot-password"
              className="text-sm text-purple-600 hover:text-purple-800 transition duration-300"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-100 transition duration-300"
          >
            <Mail className="h-5 w-5" />
            <span>Sign in with Google</span>
          </button>
        </form>
      </motion.div>
      <p className="text-center mt-4 text-amber-50">
            Don't have an account?{' '}
            <button
              onClick={() => setIsRegistering(true)}
              className="text-fuchsia-400 hover:text-fuchsia-200 transition duration-300 cursor-pointer"
            >
              Register now
            </button>
          </p>
    </div>
  );
};