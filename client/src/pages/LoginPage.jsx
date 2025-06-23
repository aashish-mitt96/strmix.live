// External Modules & Dependencies.
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"


// Internal Modules: Assets, API, Components.
import logo from "../assets/logo.png"
import { axiosInstance } from "../lib/axios"


// API Login Function.
const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData)
  return response.data
}


// React Custom Hook.
const useLogin = () => {
  const queryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
  })
  return { error, isPending, loginMutation: mutate }
}


// Main Component.
const LoginPage = () => {


  // To store user input for the login form.
  const [loginData, setLoginData] = useState({ email: "", password: "" })


  // Custom hook to handle login API mutation.
  const { isPending, error, loginMutation } = useLogin()


  // Handles form submission.
  const handleLogin = (e) => {
    e.preventDefault()
    loginMutation(loginData)
  }


  // Handles input changes.
  const handleChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }


  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 sm:px-6 md:px-8 py-12 relative overflow-hidden">
      {/* Glows */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[160px] opacity-20" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[160px] opacity-20" />

      {/* Login Box */}
      <div className="z-10 w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 text-white">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded" />
          <h1 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Login to Strmix
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} onChange={handleChange} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm text-cyan-100 block mb-1 font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              required
              placeholder="example@mail.com"
              className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:shadow-md transition duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-cyan-100 block mb-1 font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:shadow-md transition duration-200"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-400 -mt-2">
              {error.response?.data?.message || "Login failed"}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold tracking-wide hover:brightness-110 hover:shadow-xl transition duration-300 flex justify-center items-center"
          >
            {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-cyan-100 mt-5">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-cyan-400 hover:underline hover:text-cyan-300"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
