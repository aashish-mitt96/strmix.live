// External Modules & Dependencies.
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router"
import "@stream-io/video-react-sdk/dist/css/styles.css"
import { StreamVideo, StreamVideoClient, StreamCall, CallControls, SpeakerLayout, StreamTheme, CallingState, useCallStateHooks }from "@stream-io/video-react-sdk"


// Internal Modules: Assets, API, Components.
import { axiosInstance } from "../lib/axios"
import CallLoader from "../components/CallLoader"


// Fetch the authenticated user's data from the backend.
const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me")
    return res.data
  } catch (error) {
    console.log("Error in getAuthUser:", error)
    return null
  }
}


// Custom hook to use the authenticated user's data in components.
const useAuthUser = () => {
  const authUser = useQuery({ queryKey: ["authUser"], queryFn: getAuthUser, retry: false })
  return { isLoading: authUser.isLoading, authUser: authUser.data?.user }
}


// Fetch a Stream Chat token for the current authenticated user.
const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token")
  return response.data
}


// Fetch from .env file.
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY


// Call Content Component.
const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks()
  const callingState = useCallCallingState()
  const navigate = useNavigate()
  if (callingState === CallingState.LEFT) return navigate("/")
  return (
    <StreamTheme> <SpeakerLayout /> <CallControls /> </StreamTheme>
  )
}


// Main Component.
const CallPage = () => {


  // React Router Hooks.
  const { id: callId } = useParams()


  // React state variables.
  const [call, setCall] = useState(null)
  const [client, setClient] = useState(null)
  const [isConnecting, setIsConnecting] = useState(true)


  // Get authenticated user details.
  const { authUser, isLoading } = useAuthUser()


  // Fetch Stream Chat token once authUser is available.
  const { data: tokenData } = useQuery({ queryKey: ["streamToken"], queryFn: getStreamToken, enabled: !!authUser })


  // Initialize and join a Stream video call when token, user, and callId are available.
  useEffect(() => {
    const initCall = async () => {
      if (!tokenData.token || !authUser || !callId) return
      try {
        const user = { id: authUser._id, name: authUser.fullName, image: authUser.profilePic }
        const videoClient = new StreamVideoClient({ apiKey: STREAM_API_KEY, user, token: tokenData.token })
        const callInstance = videoClient.call("default", callId)
        await callInstance.join({ create: true })
        setClient(videoClient)
        setCall(callInstance)
      } catch (error) {
        toast.error("Could not join the call. Please try again.")
      } finally {
        setIsConnecting(false)
      }
    }
    initCall()
  }, [tokenData, authUser, callId])


  // Show a loader while initializing call.
  if (isLoading || isConnecting) return <p> <CallLoader/> </p>


  return (
    
    <div className="h-screen relative overflow-hidden">
      {/* Beautiful animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
          <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-3000"></div>
        </div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20"></div>
      </div>

      {/* Call content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <div className="relative w-full h-full">
          {client && call ? (
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <CallContent />
              </StreamCall>
            </StreamVideo>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-2xl">
                <p className="text-white text-lg font-medium">Could not initialize call. Please refresh or try again later.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  )
}


export default CallPage
