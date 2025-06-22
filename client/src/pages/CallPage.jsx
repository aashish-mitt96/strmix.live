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
    
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}> <StreamCall call={call}> <CallContent /> </StreamCall> </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}


export default CallPage
