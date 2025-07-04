// External Modules & Dependencies.
import toast from "react-hot-toast"
import { StreamChat } from "stream-chat"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useParams, useNavigate } from "react-router"
import { Chat, Channel, MessageInput, MessageList, Thread, Window } from "stream-chat-react"


// Internal Modules: Assets, API, Components.
import logo from "../assets/logo.png"
import { axiosInstance } from "../lib/axios.js"
import ChatLoader from "../components/ChatLoader.jsx"
import WelcomeMessage from "../components/WelcomeMessage.jsx"


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


// Main Component.
const ChatPage = () => {


  // React Router Hooks.
  const navigate = useNavigate()
  const { id: targetUserId } = useParams()


  // React state variables.
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chatClient, setChatClient] = useState(null)
  const [targetUser, setTargetUser] = useState(null)


  // Get authenticated user details.
  const { authUser } = useAuthUser()


  // Fetch Stream Chat token once authUser is available.
  const { data: tokenData } = useQuery({ queryKey: ["streamToken"], queryFn: getStreamToken, enabled: !!authUser })


  // useEffect to initialize the chat once token and user are available.
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY)
        await client.connectUser({ id: authUser._id, name: authUser.fullName, image: authUser.profilePic},tokenData.token)
        const channelId = [authUser._id, targetUserId].sort().join("-")
        const currChannel = client.channel("messaging", channelId, { members: [authUser._id, targetUserId]})
        await currChannel.watch()
        const members = Object.values(currChannel.state.members)
        const targetMember = members.find( (member) => member.user.id !== authUser._id)
        if (targetMember) setTargetUser(targetMember.user)
        setChatClient(client)
        setChannel(currChannel)
      } catch (error) {
        console.error("Error initializing chat:", error)
        toast.error("Could not connect to chat. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    initChat()
  }, [tokenData, authUser, targetUserId])


  // Sends a video call link as a chat message.
  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`
      channel.sendMessage({ text: `🎥 I've started a video call. Join me here: ${callUrl}`})
      toast.success("Video call link sent successfully!")
    }
  }


  // Handle going back to the previous page.
  const handleBack = () => navigate(-1)


  // Show a loader while initializing chat.
  if (loading || !chatClient || !channel) return <ChatLoader/>


  // Handle navigation from sidebar buttons.
  const handleNavigation = (label) => {
    if (label === "People Feed") {
      navigate("/")
    } else if (label === "Notifications") {
      navigate("/notifications")
    }
  }


  return (

    <div className="h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden flex">
      
     {/* Sidebar */}
     <div className="hidden md:flex w-75 h-screen bg-slate-800/30 backdrop-blur-xl flex-col ">

        {/* Header Section */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center"> <img src={logo} alt="logo" /></div>
              <div>
                <h1 className="text-3xl md:text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-transparent bg-clip-text"> Strmix </h1>
                <p className="text-white/70 text-sm font-medium"> Connect • Learn • Chat </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="hidden md:block flex-1 p-4 space-y-2">
          {[
            { icon: "💬", label: "Chat Feed", active: true },
            { icon: "👥", label: "People Feed" },
            { icon: "🔔", label: "Notifications" },
          ].map((item, index) => (
            <button key={index} onClick={() => handleNavigation(item.label)} className={`w-full flex items-center gap-3 px-2 py-2 rounded-2xl transition-all duration-200 ${ item.active ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 shadow-lg border border-cyan-400/30" : "hover:bg-white/10 text-white/70 hover:text-white border border-white/10" }`}>
              <span className="text-md">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer Section */}
        <div className="hidden md:block p-4 space-y-3">
          <button onClick={handleBack} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors border border-red-400/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            <span className="font-medium">Go Back</span>
          </button>
          {authUser && ( <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-inner">
              <img src={authUser.profilePic || "https://i.pinimg.com/236x/bf/a7/07/bfa7073c69751c9144efba0b9039c196.jpg "} alt="Your avatar" className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400/50 shadow-md"/>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate"> {authUser.fullName}</p>
                  <p className="text-xs text-emerald-400">● Online</p>
                </div>
            </div> )}
        </div>
      </div>
      

      {/* Right Side Content */}
      <div className="flex-1 flex flex-col bg-slate-800/20 backdrop-blur-sm relative z-10 ">
        {/* Header */}
        <div className="bg-slate-800/30 backdrop-blur-xl border-b border-white/10 px-6 py-2 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={targetUser?.image || "https://i.pinimg.com/236x/bf/a7/07/bfa7073c69751c9144efba0b9039c196.jpg"}alt="Contact" className="w-10 h-10 rounded-full object-cover border-3 border-cyan-400/50 shadow-xl" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-800 shadow-sm"></div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white"> {targetUser?.name || "User"}</h2>
                <div className="flex items-center gap-1">
                  <p className="text-[12px] text-emerald-400 font-medium"> Verified User </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleVideoCall} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-200 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                Video Call
              </button>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="flex-1 relative overflow-hidden">
          <Chat client={chatClient}>
            <Channel channel={channel}>
              <Window>
                <div className="h-full flex flex-col relative z-10">
                  <div className="flex-1 overflow-y-auto p-4 scrollbar-none"> <WelcomeMessage /> <MessageList /> </div>
                  <div className="pb-3 "> <MessageInput /> </div>
                </div>
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>


      {/* Custom Styles */}
      <style> {` .scrollbar-none { -ms-overflow-style: none;  scrollbar-width: none}`} </style>
     </div>
  )
}


export default ChatPage
