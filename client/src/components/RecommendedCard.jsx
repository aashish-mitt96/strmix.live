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


// Main Component.
const RecommendedCard = ({ user, isRequested, sendRequest }) => (
  <div className="group relative rounded-2xl bg-gradient-to-br from-white/12 to-white/4 backdrop-blur-xl border border-indigo-300/25 p-6 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/20 hover:border-indigo-400/50 overflow-hidden">
    {/* Animated gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* Sparkle effect */}
    <div className="absolute top-4 right-4 text-indigo-300 opacity-60 group-hover:opacity-100 transition-opacity">
      ✨
    </div>

    <div className="relative z-10">
      <div className="flex items-center gap-5 mb-4">
        <div className="relative">
          <img src={user.profilePic}  alt={user.fullName} className="w-16 h-16 duration-300" />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-xl tracking-wide truncate mb-2 group-hover:text-indigo-100 transition-colors">
            {user.fullName}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-indigo-100/90 bg-indigo-500/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              {getLanguageFlag(user.nativeLanguage)}
              <span className="font-medium">Native: {user.nativeLanguage}</span>
            </div>
            <div className="flex items-center text-sm text-purple-100/90 bg-purple-500/10 rounded-lg px-3 py-1.5 backdrop-blur-sm">
              {getLanguageFlag(user.learningLanguage)}
              <span className="font-medium">
                Learning: {user.learningLanguage}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => sendRequest(user._id)}
        className={`w-full font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform shadow-lg text-center ${
          isRequested
            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white cursor-not-allowed opacity-75"
            : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white hover:scale-105 hover:shadow-indigo-500/30"
        }`}
        disabled={isRequested}
      >
        {isRequested ? "✓ Request Sent" : "➕ Add Friend"}
      </button>
    </div>
  </div>
);

export default RecommendedCard