import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"

import { axiosInstance } from "./lib/axios.js"

import HomePage from "./pages/HomePage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import OnboardPage from "./pages/OnboardPage.jsx"
import NotificationPage from "./pages/NotificationPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"

const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me")
    return res.data
  } catch (error) {
    console.log("Error in getAuthUser:", error)
    return null
  }
}

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  })
  return { isLoading: authUser.isLoading, authUser: authUser.data?.user }
}

const App = () => {

  const { isLoading, authUser } = useAuthUser()
  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if (isLoading) return <p>Loading...</p>

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
  );
};

export default App;
