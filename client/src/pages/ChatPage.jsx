import toast from "react-hot-toast";
import { StreamChat } from "stream-chat";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Thread,
  Window,
  useChannelStateContext,
} from "stream-chat-react";

import { axiosInstance } from "../lib/axios.js";
import ChatLoader from "../components/ChatLoader.jsx";
import logo from "../assets/logo.png";

const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });
  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
};

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const WelcomeMessage = () => {
  const { messages } = useChannelStateContext();
  const isEmpty = messages.length === 0;

  return (
    isEmpty && (
      <div className="text-center py-6">
        <p className="text-white/80 text-lg flex items-center justify-center gap-2">
          👋 <span>Say hi and start the conversation!</span> 💬
        </p>
      </div>
    )
  );
};

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const navigate = useNavigate();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [targetUser, setTargetUser] = useState(null);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        const members = Object.values(currChannel.state.members);
        const targetMember = members.find(
          (member) => member.user.id !== authUser._id
        );
        if (targetMember) setTargetUser(targetMember.user);

        setChatClient(client);
        setChannel(currChannel);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `🎥 I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  const handleBack = () => navigate(-1);

  if (loading || !chatClient || !channel) return <ChatLoader />;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Sidebar (Left Column) */}
      <div className="w-72 p-6 border-r border-white/10 bg-white/5 backdrop-blur-lg relative z-10 flex flex-col text-white">
        {/* App Logo and Name */}
        <div className="flex items-center gap-3 mb-8">
          <img src={logo} alt="App Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-xl font-bold text-white">StrMix</h1>
        </div>

        {/* Placeholder for additional content */}
        <div className="flex flex-col space-y-4 text-sm text-white/70">
          <button className="hover:text-white">📂 Recent Chats</button>
          <button className="hover:text-white">🔍 Search</button>
          <button className="hover:text-white">⚙️ Settings</button>
          <button onClick={handleBack} className="text-red-400 hover:text-red-200 mt-auto">← Go Back</button>
        </div>
      </div>

      {/* Chat Section (Right Column) */}
      <div className="flex-1 h-screen flex flex-col">
        {/* Top Sticky Header with Target User Info */}
        <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={targetUser?.image || "https://via.placeholder.com/48"}
                alt="User"
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <h2 className="text-white font-semibold">{targetUser?.name || "User"}</h2>
              <p className="text-sm text-cyan-200/80">Active now</p>
            </div>
          </div>

          <button
            onClick={handleVideoCall}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-xl text-white shadow-lg hover:scale-105 transition"
          >
            🎥 Video Call
          </button>
        </div>

        {/* Chat UI */}
        <Chat client={chatClient} theme="str-chat__theme-dark">
          <Channel channel={channel}>
            <Window>
              <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto">
                  <WelcomeMessage />
                  <MessageList />
                </div>
                <div className="p-4 border-t border-white/10 bg-white/5">
                  <MessageInput />
                </div>
              </div>
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>

      {/* Background Glow Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Chat Scroll Area Background */}
      <style>
        {`
          .str-chat__message-list-scroll {
            background: linear-gradient(to bottom right, #0f172a, #312e81, #4c1d95) !important;
          }
        `}
      </style>
    </div>
  );
};

export default ChatPage;
