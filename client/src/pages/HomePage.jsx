import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";

const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
};

const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests");
  return response.data;
};

const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
};

const LANGUAGE_TO_FLAG = {
  english: "gb",
  spanish: "es",
  french: "fr",
  german: "de",
  mandarin: "cn",
  japanese: "jp",
  korean: "kr",
  hindi: "in",
  russian: "ru",
  portuguese: "pt",
  arabic: "sa",
  italian: "it",
  turkish: "tr",
  dutch: "nl",
};

const getLanguageFlag = (language) => {
  if (!language) return null;
  const countryCode = LANGUAGE_TO_FLAG[language.toLowerCase()];
  return countryCode ? (
    <img
      src={`https://flagcdn.com/24x18/${countryCode}.png`}
      alt={`${language} flag`}
      className="h-3 mr-1 inline-block"
    />
  ) : null;
};

const FriendCard = ({ friend }) => (
  <div className="card bg-base-100 shadow hover:shadow-lg transition-shadow rounded-lg">
    <div className="card-body p-4 space-y-3">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <img
            src={friend.profilePic}
            alt={friend.fullName}
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div>
          <h3 className="font-semibold text-lg truncate">{friend.fullName}</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="badge badge-secondary text-xs">
          {getLanguageFlag(friend.nativeLanguage)}
          Native: {friend.nativeLanguage}
        </span>
        <span className="badge badge-outline text-xs">
          {getLanguageFlag(friend.learningLanguage)}
          Learning: {friend.learningLanguage}
        </span>
      </div>
      <Link to={`/chat/${friend._id}`} className="btn btn-outline btn-sm w-full">
        Message
      </Link>
    </div>
  </div>
);

const RecommendedCard = ({ user, isRequested, sendRequest }) => (
  <div className="card bg-base-100 shadow-md hover:shadow-lg transition rounded-lg">
    <div className="card-body p-4 space-y-3">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <img
            src={user.profilePic}
            alt={user.fullName}
            className="w-12 h-12 rounded-full"
          />
        </div>
        <h3 className="font-semibold text-lg truncate">{user.fullName}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="badge badge-primary text-xs">
          {getLanguageFlag(user.nativeLanguage)}
          Native: {user.nativeLanguage}
        </span>
        <span className="badge badge-outline text-xs">
          {getLanguageFlag(user.learningLanguage)}
          Learning: {user.learningLanguage}
        </span>
      </div>
      <button
        onClick={() => sendRequest(user._id)}
        className="btn btn-sm btn-accent w-full"
        disabled={isRequested}
      >
        {isRequested ? "Request Sent" : "Add Friend"}
      </button>
    </div>
  </div>
);

const NoFriendsFound = () => (
  <div className="card bg-base-200 p-6 text-center">
    <h3 className="font-semibold text-lg mb-2">No friends yet</h3>
    <p className="text-base-content opacity-70">
      Connect with language partners below to start practicing together!
    </p>
  </div>
);

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries(["outgoingFriendReqs"]),
  });

  useEffect(() => {
    const ids = new Set();
    if (outgoingFriendReqs?.length > 0) {
      outgoingFriendReqs.forEach((req) => ids.add(req.recipient._id));
      setOutgoingRequestsIds(ids);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* Friends Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Friends</h2>
        {loadingFriends ? (
          <p className="text-base-content">Loading friends...</p>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended Users Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recommended Partners</h2>
        {loadingUsers ? (
          <p className="text-base-content">Loading users...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendedUsers.map((user) => (
              <RecommendedCard
                key={user._id}
                user={user}
                isRequested={outgoingRequestsIds.has(user._id)}
                sendRequest={sendRequestMutation}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
