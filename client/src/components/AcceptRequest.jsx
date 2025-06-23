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
)

export default AcceptedRequestCard