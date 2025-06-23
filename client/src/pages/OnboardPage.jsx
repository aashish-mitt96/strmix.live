// External Modules & Dependencies.
import { useState } from "react"
import toast from "react-hot-toast"
import { Loader2, RefreshCcw } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


// Internal Modules: Assets, API, Components.
import logo from "../assets/logo.png"
import { axiosInstance } from "../lib/axios.js"


// Fetch the authenticated user's data from the backend.
const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me")
    return res.data
  } catch (error) {
    console.error("Error in getAuthUser:", error)
    return null
  }
}


// Custom hook to use the authenticated user's data in components.
const useAuthUser = () => {
  const { data, isLoading } = useQuery({ queryKey: ["authUser"], queryFn: getAuthUser, retry: false })
  return { isLoading, authUser: data?.user }
}


// API Fuction.
const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData)
  return response.data
}


// Supported Languages.
const LANGUAGES = [
  "English", "Spanish", "French", "German", "Mandarin", "Japanese",
  "Korean", "Hindi", "Russian", "Portuguese", "Arabic", "Italian",
  "Turkish", "Dutch"
]


// Main Component.
const OnboardPage = () => {


  // Access the global query client.
  const queryClient = useQueryClient()


  // Get the currently authenticated user's data.
  const { authUser } = useAuthUser()


  // Local state for the onboarding form fields, initialized with current user data.
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  })


  // Mutation to complete the onboarding process
  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Onboarding complete!")
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong.")
    }
  })


  // Handles input changes.
  const handleChange = (e) =>
    setFormState({ ...formState, [e.target.name]: e.target.value })


  // Handles form Submission.
  const handleSubmit = (e) => {
    e.preventDefault()
    onboardingMutation(formState)
  }


  // Generates a random avatar.
  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1
    const avatar = `https://avatar.iran.liara.run/public/${idx}.png`
    setFormState({ ...formState, profilePic: avatar })
    toast.success("Random avatar generated!")
  }


  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Glowing Orbs */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[180px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[160px] opacity-25 animate-pulse" />

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[160px] opacity-20" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-violet-600 rounded-full blur-[160px] opacity-20" />

      {/* Main Card */}
      <div className="relative z-10 flex flex-col md:flex-row bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden max-w-5xl w-full">
        {/* Left Side - Preview */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-[#1e3c72]/40 to-[#2a5298]/40 flex flex-col items-center justify-center p-10 text-center space-y-4">
          <img
            src={formState.profilePic || "https://via.placeholder.com/100"}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-xl transition-transform duration-300 hover:scale-105"
          />
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Welcome, {formState.fullName || "Strmix User"}!
          </h2>
          <p className="text-cyan-100 text-sm px-6">
            Customize your profile, connect with partners, and start learning together.
          </p>

          <button
            type="button"
            onClick={handleRandomAvatar}
            className="flex items-center gap-2 text-sm mt-4 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded-md transition shadow-lg"
          >
            <RefreshCcw className="w-4 h-4" />
            Generate Avatar
          </button>
        </div>

        {/* Right Side - Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 p-10 text-white space-y-6"
        >
          {/* Logo and Heading */}
          <div className="flex items-center gap-3 mb-6">
            <img src={logo} alt="Logo" className="w-9 h-9 rounded-md" />
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
              Strmix Onboarding
            </h1>
          </div>

          {/* Input Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-cyan-100 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-cyan-100 mb-1">Short Bio</label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Write about yourself..."
                className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-cyan-100 mb-1">Native Language</label>
                <select
                  name="nativeLanguage"
                  value={formState.nativeLanguage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                >
                  <option value="">Select</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-cyan-100 mb-1">Learning Language</label>
                <select
                  name="learningLanguage"
                  value={formState.learningLanguage}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white focus:ring-2 focus:ring-cyan-400 outline-none"
                >
                  <option value="">Select</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm text-cyan-100 mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formState.location}
                onChange={handleChange}
                placeholder="City, Country"
                className="w-full px-4 py-3 rounded-lg bg-[#0e0e2c] border border-cyan-400 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold tracking-wide hover:brightness-110 hover:shadow-xl transition duration-300 flex justify-center items-center"
          >
            {isPending ? (
              <Loader2 className="animate-spin w-5 h-5" />
            ) : (
              "Finish Onboarding"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OnboardPage