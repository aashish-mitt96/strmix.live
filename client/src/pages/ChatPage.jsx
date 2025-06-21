import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { useQuery } from "@tanstack/react-query";
import {axiosInstance} from '../lib/axios.js'
import { LoaderIcon } from "lucide-react";
import { VideoIcon } from "lucide-react";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";


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
    retry: false, // auth check
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
};

const ChatLoader = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center p-4">
      <LoaderIcon className="animate-spin size-10 text-primary" />
      <p className="mt-4 text-center text-lg font-mono">Connecting to chat...</p>
    </div>
  );
}

const CallButton = ({ handleVideoCall }) => {
  return (
    <div className="p-3 border-b flex items-center justify-end max-w-7xl mx-auto w-full absolute top-0">
      <button onClick={handleVideoCall} className="btn btn-success btn-sm text-white">
        <VideoIcon className="size-6" />
      </button>
    </div>
  );
}

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;


const ChatPage = () => {

   const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser, // this will run only when authUser is available
  });

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) return;

      try {
        console.log("Initializing stream chat client...");

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
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) return <ChatLoader />;
  return (
    <Chat client={chatClient} theme="str-chat__theme-dark">
    <Channel channel={channel}>
      <CallButton handleVideoCall={handleVideoCall} />
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
    </Channel>
  </Chat>
  )
}

export default ChatPage