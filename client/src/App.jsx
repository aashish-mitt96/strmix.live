// External Modules & Dependencies.
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"
import { Navigate, Route, Routes } from "react-router-dom"


// Internal Modules: Assets, API, Components.
import HomePage from "./pages/HomePage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import { axiosInstance } from "./lib/axios.js"
import SignupPage from "./pages/SignupPage.jsx"
import OnboardPage from "./pages/OnboardPage.jsx"
import AppLoader from "./components/AppLoader.jsx"
import NotificationPage from "./pages/NotificationPage.jsx"

// Fetch the authenticated user's data from the backend.
const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me")
    return res.data
  } catch (error) {
    console.log("Error in getAuthUser:", error)
    return null
  }
}


// Custom hook to use the authenticated user's data in components.
const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  })
  return { isLoading: authUser.isLoading, authUser: authUser.data?.user }
}


// Main Component.
const App = () => {


  // Get authenticated user details.
  const { isLoading, authUser } = useAuthUser()
  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if (isLoading) return <AppLoader/>

  return (
    <div>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (<HomePage />) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)}/>
        <Route path="/signup" element={!isAuthenticated ? (<SignupPage />) : (<Navigate to={isOnboarded ? "/" : "/onboarding"} />)}/>
        <Route path="/login" element={!isAuthenticated ? (<LoginPage />) : (<Navigate to={isOnboarded ? "/" : "/onboarding"} />)}/>
        <Route path="/notifications" element={isAuthenticated && isOnboarded ? (<NotificationPage />) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)}/>
        <Route path="/call/:id" element={isAuthenticated && isOnboarded ? (<CallPage />) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)}/>
        <Route path="/chat/:id" element={isAuthenticated && isOnboarded ? (<ChatPage />) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)}/>
        <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded ? (<OnboardPage />) : (<Navigate to="/" />)) : (<Navigate to="/login" />)}/>
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
