import { BellIcon } from "lucide-react"

const NoNotificationsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-8">
        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center backdrop-blur-xl border border-cyan-300/30 shadow-2xl">
          <BellIcon className="w-16 h-16 text-cyan-300 animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 rounded-full blur-xl" />
      </div>
      <h3 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500  bg-clip-text">
        No notifications yet
      </h3>
      <p className="text-gray-300 text-lg max-w-md leading-relaxed">
        When you receive friend requests or messages, they'll appear here like magic ✨
      </p>
    </div>
  )
}

export default NoNotificationsFound