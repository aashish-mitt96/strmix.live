import { VideoIcon, ArrowLeft } from "lucide-react";

const ModernHeader = ({ handleVideoCall, targetUser, onBack }) => {
  return (
    <div className="sticky top-0 z-50  px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between max-w-full mx-auto">
        {/* Left: Back button + User Info */}
        <div className="flex items-center gap-4">
          {/* Back button */}
          <button
            onClick={onBack}
            className="group p-2 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-105 transition duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-white group-hover:text-cyan-300 transition-colors" />
          </button>

          {/* Avatar with online dot */}
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 p-[2px] shadow-lg">
              <div className="w-full h-full rounded-full bg-slate-900 p-[2px]">
                <img
                  src={targetUser?.image || "https://via.placeholder.com/48"}
                  alt={targetUser?.name || "User"}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>
            {/* Online indicator */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-slate-900" />
          </div>

          {/* User name and status */}
          <div className="flex flex-col">
            <h2 className="text-white font-semibold text-base sm:text-lg">
              {targetUser?.name || "User"}
            </h2>
            <span className="text-sm text-cyan-200/80">Active now</span>
          </div>
        </div>

        {/* Right: Video Call Button */}
        <div>
          <button
            onClick={handleVideoCall}
            className="group p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-cyan-500/30"
          >
            <VideoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModernHeader;
