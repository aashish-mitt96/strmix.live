import { Link } from 'react-router-dom'


// Maps supported languages used for flag rendering.
const LANGUAGE_TO_FLAG = {
  english: "gb", spanish: "es", french: "fr", german: "de", mandarin: "cn",
  japanese: "jp", korean: "kr", hindi: "in", russian: "ru", portuguese: "pt",
  arabic: "sa", italian: "it", turkish: "tr", dutch: "nl"
}


// Gets a small flag icon corresponding to the given language.
const getLanguageFlag = (language) => {
  if (!language) return null
  const countryCode = LANGUAGE_TO_FLAG[language.toLowerCase()]
  return countryCode ? (
    <img src={`https://flagcdn.com/24x18/${countryCode}.png`} alt={`${language} flag`} className="h-4 w-5 mr-2 inline-block rounded-sm shadow-sm" />
  ) : null
}


// Capitalizes the first letter of the given string.
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()


// Main Component.
const FriendCard = ({ friend }) => (
  <div className="group relative rounded-2xl bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-cyan-300/30 p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-cyan-500/20 hover:border-cyan-400/50 overflow-hidden">

    {/* Animated gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Status indicator */}
    <div className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full shadow-lg animate-pulse" />

    <div className="relative z-10">
      <div className="flex items-center gap-5 mb-4">
        <div className="relative">
          <img src={friend.profilePic} alt={friend.fullName} className="w-16 h-16 duration-300" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-xl tracking-wide truncate mb-2 group-hover:text-cyan-100 transition-colors">
            {friend.fullName}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-cyan-100/90 bg-cyan-500/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              {getLanguageFlag(friend.nativeLanguage)}
              <span className="font-medium">
                Native: {capitalize(friend.nativeLanguage)}
              </span>
            </div>
            <div className="flex items-center text-sm text-blue-100/90 bg-blue-500/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              {getLanguageFlag(friend.learningLanguage)}
              <span className="font-medium">
                Learning: {capitalize(friend.learningLanguage)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Link
        to={`/chat/${friend._id}`}
        className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/30 text-center group/btn"
      >
        <span className="group-hover/btn:scale-110 inline-block transition-transform duration-200">
          💬 Start Video Chat
        </span>
      </Link>
    </div>
  </div>
)

export default FriendCard
