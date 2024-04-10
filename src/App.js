import LeftSidebar from "./components/left-sidebar";
import TopBar from "./components/topbar";
import SocialMediaPost from "./components/Social-wall-post";
import SideWidgets from "./components/SideWidgets";
import { BrowserRouter as Router, Route, Routes, } from "react-router-dom";
import Groups from "./pages/Groups";
import Donations from "./pages/Donations";
import Sponsorships from "./pages/Sponsorships";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Settings from "./pages/Settings";
import ProfilePage from "./pages/ProfilePage";
import Members from "./pages/Members";
import Profile from "./pages/Profile";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { useState, useEffect } from "react";
import React from "react";
import Dashboard from "./pages/Dashboard";
import { useCookies } from "react-cookie";
import { JoinGroup } from "./components/Groups/JoinGroup";
import IndividualGroup from "./components/Groups/IndividualGroup";
import { GiConsoleController } from "react-icons/gi";
import { useSelector } from "react-redux";

function App() {
  const [cookies, removeCookie] = useCookies(["token"]);
  const [loading, setLoading] = useState(true);
  const profile = useSelector((state)=> state.profile);
  

  useEffect(() => {
    const token = cookies.token;
    if (token && token!==undefined) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    setLoading(false);
  }, [cookies.token]);

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogin = () => {
    console.log('handling login')
    setIsLoggedIn(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    if (cookies.token) {
      console.log("Cookie exists, removing...");
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      console.log("Cookie removed");
    }
    setIsLoggedIn(false);
    console.log("handle logout");
  };

  
  

  return (
    <div className="App">
      <ToastContainer />
      <div>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="/register" element={<RegisterPage handleLogin={handleLogin}/>} />
            {console.log('logged in',isLoggedIn)}
            {!isLoggedIn ? (
              <Route path="*" element={<LoginPage handleLogin={handleLogin} />} />
            ) : (
              <>
                <Route path="/*" element={<Dashboard handleLogout={handleLogout} />} />
                <Route path="/groups/:_id/invite/*" element={
                  <div>
                    <TopBar handleLogout={handleLogout}/>
                    <div style={{ width: "100%", display: "flex", flexDirection: "row" }}>
                      <LeftSidebar />
                      <JoinGroup/>
                    </div>
                  </div>
                } />
              </>
            )}
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
