// External Modules & Dependencies.
import { Link } from "react-router-dom"
import { BellIcon, UserCheck, UserPlus, ArrowLeft } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


// Internal Modules: Assets, API, Components.
import logo from "../assets/logo.png"
import { axiosInstance } from '../lib/axios.js'
import IncomingRequestCard from "../components/IncomingCard.jsx"
import AcceptedRequestCard from "../components/AcceptRequest.jsx"
import NoNotificationsFound from "../components/NoNotificationsFound.jsx"


// API Fuctions.
const getFriendRequests = async () => {
  const response = await axiosInstance.get("/users/friend-requests")
  return response.data
}
const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`)
  return response.data
}


// Main Component.
const NotificationPage = () => {


  // Access the global query client.
  const queryClient = useQueryClient()


  // Fetches the list of friend requests.
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  })


  // Mutation to accept a friend request.
  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    }
  })


  // Extract incoming and accepted friend requests from the API response.
  const incomingRequests = friendRequests?.incomingReqs || []
  const acceptedRequests = friendRequests?.acceptedReqs || []


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
                <Link
                  to="/"
                  className="group bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 p-3 rounded-2xl hover:from-cyan-400/30 hover:to-blue-400/30 hover:border-cyan-300/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src={logo} alt="logo" />
                </div>
               
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 text-cyan-300 px-6 py-3 rounded-2xl shadow-lg">
                <BellIcon className="w-5 h-5" />
                <span className="font-semibold">
                  {incomingRequests.length + acceptedRequests.length} notifications
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-white text-xl font-semibold">
                Loading notifications...
              </p>
            </div>
          ) : incomingRequests.length === 0 && acceptedRequests.length === 0 ? (
            <NoNotificationsFound />
          ) : (
            <div className="space-y-12">
              {/* Incoming Friend Requests */}
              {incomingRequests.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-400/30 rounded-2xl">
                      <UserPlus className="w-6 h-6 text-cyan-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Incoming Friend Requests
                      </h2>
                      <p className="text-cyan-300/80 text-sm">
                        {incomingRequests.length} pending request{incomingRequests.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {incomingRequests.map((req, index) => (
                      <div
                        key={req._id}
                        className="animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <IncomingRequestCard
                          req={req}
                          onAccept={acceptRequestMutation}
                          isPending={isPending}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Accepted */}
              {acceptedRequests.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-400/30 rounded-2xl">
                      <UserCheck className="w-6 h-6 text-green-300" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Recently Accepted
                      </h2>
                      <p className="text-green-300/80 text-sm">
                        {acceptedRequests.length} new connection{acceptedRequests.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {acceptedRequests.map((req, index) => (
                      <div
                        key={req._id}
                        className="animate-fadeInUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <AcceptedRequestCard req={req} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

     
    </div>
  )
}

export default NotificationPage