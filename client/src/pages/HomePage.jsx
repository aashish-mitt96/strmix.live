// External Modules & Dependencies.
import toast from "react-hot-toast"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


// Internal Modules: Assets, API, Components.
import logo from "../assets/logo.png"
import { axiosInstance } from "../lib/axios.js"
import FriendCard from "../components/FriendCard.jsx"
import RecommendedCard from "../components/RecommendedCard.jsx"


// API Fuctions.
const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends")
  return response.data
}
const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users")
  return response.data
}
const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests")
  return response.data
}
const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`)
  return response.data
}
const logout = async () => {
  const response = await axiosInstance.post("/auth/logout")
  return response.data
}


// Main Component.
const HomePage = () => {


  // Access the global query client.
  const queryClient = useQueryClient()


  // React state variables.
  const [tab, setTab] = useState("friends")
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set())


  // Fetch the current user's friends list.
  const { data: friends = [], isLoading: loadingFriends } = useQuery({ queryKey: ["friends"], queryFn: getUserFriends })


  // Fetch the list of recommended users.
  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({ queryKey: ["users"], queryFn: getRecommendedUsers})


  // Fetch the list of outgoing friend requests sent by the user.
  const { data: outgoingFriendReqs } = useQuery({ queryKey: ["outgoingFriendReqs"], queryFn: getOutgoingFriendReqs })


  // Mutation for sending a friend request.
  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries(["outgoingFriendReqs"])
  })


  // Update local state with IDs of users who have pending outgoing friend requests.
  useEffect(() => {
    const ids = new Set()
    if (outgoingFriendReqs?.length > 0) {
      outgoingFriendReqs.forEach((req) => ids.add(req.recipient._id))
      setOutgoingRequestsIds(ids)
    }
  }, [outgoingFriendReqs])


  // Handle user Logout.
  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Logged out successfully!")
      navigate("/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" />

        {/* Floating particles */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20 animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 px-2 py-2">
        {/* Enhanced Header */}
        <div className="sticky top-6 z-50 mb-10">
          <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl px-6 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12  flex items-center justify-center">
                  <img src={logo} alt="logo" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text">
                    Strmix
                  </h1>
                  <p className="text-white/70 text-sm font-medium">
                    Connect • Learn • Chat
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/notifications"
                  className="group relative bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 px-6 py-3 rounded-2xl font-semibold hover:from-cyan-400/30 hover:to-blue-400/30 hover:border-cyan-300/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
                >
                  <span className="text-lg mr-2">🔔</span>
                  <span>Notifications</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="group relative bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-sm border border-red-400/30 text-red-300 px-6 py-3 rounded-2xl font-semibold hover:from-red-400/30 hover:to-pink-400/30 hover:border-red-300/50 transition-all duration-300 shadow-lg hover:shadow-red-500/20"
                >
                  <span className="text-lg mr-2">🗝️</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Switcher */}
        <div className="max-w-6xl mx-auto mb-10">
          <div className="flex justify-center">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
              <div className="flex gap-2">
                <button
                  onClick={() => setTab("friends")}
                  className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    tab === "friends"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 scale-105"
                      : "text-cyan-300 hover:bg-cyan-500/10 hover:text-cyan-200"
                  }`}
                >
                  <span className="mr-2">👥</span>
                  My Friends
                  {tab === "friends" && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/20 to-blue-500/20 animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => setTab("recommended")}
                  className={`relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                    tab === "recommended"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                      : "text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200"
                  }`}
                >
                  <span className="mr-2">✨</span>
                  Discover
                  {tab === "recommended" && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-400/20 to-purple-500/20 animate-pulse" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Cards Display */}
        <div className="max-w-7xl mx-auto">
          {tab === "friends" ? (
            loadingFriends ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-white text-xl font-semibold">
                  Loading your friends...
                </p>
              </div>
            ) : friends.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-6xl">👋</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  No Friends Yet
                </h2>
                <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                  Start your language learning journey by connecting with native
                  speakers from around the world!
                </p>
                <button
                  onClick={() => setTab("recommended")}
                  className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
                >
                  <span className="mr-2">🔍</span>
                  Discover People
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {friends.map((friend, index) => (
                  <div
                    key={friend._id}
                    className="animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <FriendCard friend={friend} />
                  </div>
                ))}
              </div>
            )
          ) : loadingUsers ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white text-xl font-semibold">
                Finding amazing people...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {recommendedUsers.map((user, index) => (
                <div
                  key={user._id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <RecommendedCard
                    user={user}
                    isRequested={outgoingRequestsIds.has(user._id)}
                    sendRequest={sendRequestMutation}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage