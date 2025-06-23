// External Modules & Dependencies.
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"


// Internal Modules: Assets, API, Components.
import logo from "../assets/logo.png"
import { axiosInstance } from "../lib/axios.js"


// API Fuction.
const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData)
  return response.data
}


// React Custom Hook.
const useSignUp = () => {
  const queryClient = useQueryClient()
  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  })
  return { isPending, error, signupMutation: mutate }
}


// Main Component
const SignupPage = () => {


  // Local state for the signup form field.
  const [signupData, setSignupData] = useState({ fullName: "", email: "", password: "" })


  // Custom hook to handle login API mutation.
  const { isPending, error, signupMutation } = useSignUp()


  // Handles form submission.
  const handleSignup = (e) => {
    e.preventDefault()
    signupMutation(signupData)
  }


  // Animation CSS
  if (
    typeof document !== "undefined" &&
    !document.getElementById("bulge-keyframes")
  ) {
    const style = document.createElement("style");
    style.id = "bulge-keyframes";
    style.innerHTML = `
    @keyframes bulge {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
    }
  `;
    document.head.appendChild(style);
  }


  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Glowing Orbs */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[180px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[160px] opacity-25 animate-pulse" />

      {/* Main Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl rounded-3xl flex flex-col md:flex-row overflow-hidden max-w-5xl w-full transition-transform duration-300 hover:scale-[1.01]">
        {/* Left Section */}
        <div className="w-full md:w-1/2 p-10 text-white">
          <div className="flex items-center justify-center mb-8 space-x-3">
            <img
              src={logo}
              alt="Logo"
              className="w-10 h-10 rounded-md shadow-lg"
            />
            <h1 className="text-4xl font-extrabold tracking-wide  bg-cyan-400 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_12px_rgba(0,255,255,0.4)]">
              Strmix
            </h1>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="text-sm text-cyan-100 block mb-1 font-medium">
                Enter Name
              </label>
              <input
                type="text"
                value={signupData.fullName}
                placeholder="Good Name"
                required
                onChange={(e) =>
                  setSignupData({ ...signupData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:shadow-md transition duration-200"
              />
            </div>
            <div>
              <label className="text-sm text-cyan-100 block mb-1 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={signupData.email}
                placeholder="custom@example.com"
                required
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:shadow-md transition duration-200"
              />
            </div>
            <div>
              <label className="text-sm text-cyan-100 block mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                value={signupData.password}
                placeholder="••••••••"
                required
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 hover:shadow-md transition duration-200"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-400 text-sm -mt-2">
                {error?.response?.data?.message ||
                  "Signup failed. Please try again."}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold tracking-wide hover:brightness-110 hover:shadow-xl transition duration-300 flex justify-center items-center"
            >
              {isPending ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                "Create My Account"
              )}
            </button>

            <p className="text-sm text-center text-cyan-100 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>

        {/* Right Section */}
        <div className="relative w-full md:w-1/2 bg-gradient-to-br from-[#1e3c72]/30 to-[#2a5298]/40 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
          <img
            src={logo}
            alt="Video chat"
            className="w-60 h-60 object-contain mb-6 drop-shadow-xl rounded-xl z-10"
            style={{
              animation: "bulge 5s ease-in-out infinite",
            }}
          />
          <h2 className="text-2xl font-bold text-white drop-shadow-md mb-2 z-10">
            Face-to-Face, Anywhere
          </h2>
          <p className="text-cyan-100 text-sm max-w-xs z-10">
            Engage in real-time chats, build confidence, and grow your language skills together
          </p>

          {/* Stars / Particles */}
          <div className="absolute inset-0">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-white/30 animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
