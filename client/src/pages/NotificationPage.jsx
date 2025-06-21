import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellIcon, UserCheck, UserPlus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from '../lib/axios.js';
import logo from "../assets/logo.png";

const getFriendRequests = async () => {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
};

const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
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
      className="h-4 w-5 mr-2 inline-block rounded-sm shadow-sm"
    />
  ) : null;
};

const NoNotificationsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-8">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-cyan-300/30 shadow-2xl">
          <BellIcon className="w-16 h-16 text-cyan-300 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 rounded-full blur-xl" />
      </div>
      <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
        No notifications yet
      </h3>
      <p className="text-gray-300 text-lg max-w-md leading-relaxed">
        When you receive friend requests or messages, they'll appear here like magic ✨
      </p>
    </div>
  );
};

const IncomingRequestCard = ({ req, onAccept, isPending }) => (
  <div className="group relative rounded-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-cyan-300/30 p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/20 hover:border-cyan-400/50 overflow-hidden">
    {/* Animated gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Pulsing notification indicator */}
    <div className="absolute top-4 right-4 w-3 h-3 bg-cyan-400 rounded-full shadow-lg animate-pulse" />

    <div className="relative z-10">
      <div className="flex items-center gap-5 mb-4">
        <div className="relative">
          <img
            src={req.sender.profilePic}
            alt={req.sender.fullName}
            className="w-16 h-16 rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-xl tracking-wide truncate mb-2 group-hover:text-cyan-100 transition-colors">
            {req.sender.fullName}
          </h3>
          <div className="space-y-1">
            {req.sender.nativeLanguage && (
              <div className="flex items-center text-sm text-cyan-100/90 bg-cyan-500/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                {getLanguageFlag(req.sender.nativeLanguage)}
                <span className="font-medium">Native: {req.sender.nativeLanguage}</span>
              </div>
            )}
            {req.sender.learningLanguage && (
              <div className="flex items-center text-sm text-blue-100/90 bg-blue-500/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                {getLanguageFlag(req.sender.learningLanguage)}
                <span className="font-medium">Learning: {req.sender.learningLanguage}</span>
              </div>
            )}
          </div>
          <p className="text-cyan-200/80 text-sm mt-2 font-medium">
            💌 wants to connect with you
          </p>
        </div>
      </div>

      <button
        onClick={() => onAccept(req._id)}
        disabled={isPending}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 text-center group/btn disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        <span className="group-hover/btn:scale-110 inline-block transition-transform duration-200">
          {isPending ? "⏳ Accepting..." : "✓ Accept Request"}
        </span>
      </button>
    </div>
  </div>
);

const AcceptedRequestCard = ({ req }) => (
  <div className="group relative rounded-2xl bg-gradient-to-br from-white/12 to-white/4 backdrop-blur-xl border border-green-300/25 p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-green-500/20 hover:border-green-400/50 overflow-hidden">
    {/* Animated gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    
    {/* Success indicator */}
    <div className="absolute top-4 right-4 text-green-300 opacity-60 group-hover:opacity-100 transition-opacity">
      ✅
    </div>

    <div className="relative z-10">
      <div className="flex items-center gap-5">
        <div className="relative">
          <img
            src={req.recipient.profilePic}
            alt={req.recipient.fullName}
            className="w-16 h-16 rounded-2xl object-cover shadow-lg transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-xl tracking-wide truncate mb-2 group-hover:text-green-100 transition-colors">
            {req.recipient.fullName}
          </h3>
          <div className="space-y-1">
            {req.recipient.nativeLanguage && (
              <div className="flex items-center text-sm text-green-100/90 bg-green-500/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                {getLanguageFlag(req.recipient.nativeLanguage)}
                <span className="font-medium">Native: {req.recipient.nativeLanguage}</span>
              </div>
            )}
            {req.recipient.learningLanguage && (
              <div className="flex items-center text-sm text-emerald-100/90 bg-emerald-500/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
                {getLanguageFlag(req.recipient.learningLanguage)}
                <span className="font-medium">Learning: {req.recipient.learningLanguage}</span>
              </div>
            )}
          </div>
          <p className="text-green-200 text-sm mt-2 font-medium">
            🎉 You're now friends!
          </p>
        </div>
      </div>
    </div>
  </div>
);

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotificationPage;