import { useChannelStateContext } from "stream-chat-react"

const WelcomeMessage = () => {

  const { messages } = useChannelStateContext()
  const isEmpty = messages.length === 0

  return (
    isEmpty && (
      <div className="flex flex-col items-center justify-center h-96 text-center px-8 ">
        <div className="mb-6 p-6 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full backdrop-blur-sm border border-cyan-400/30 shadow-xl">
          <svg className="w-16 h-16 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        </div>
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-3"> Start Your Conversation </h3>
        <p className="text-white/70 text-lg max-w-md leading-relaxed"> Send a message to begin your professional discussion. Your communication is secure and encrypted.</p>
      </div>
    )
  )
}

export default WelcomeMessage