import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
import Landing from './pages/Landing';
import Init from './pages/Init';
import Channellist from './pages/Channellist';
import Createchannel from './pages/Createchannel';
import PostMessageOnChannel from './pages/PostMessageOnChannel';
import ReplyPost from './pages/ReplyPost';
import { UsernameProvider } from './useContext/Username';
import LogIn from './pages/LogIn';
import Register from './pages/Register'
import SearchOption from './pages/SearchOption';
import Profile from './pages/Profile';
import Admin from './pages/Admin';


function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  // Check the cookie when the component mounts
  useEffect(() => {
    const cookieValue = getCookie('username'); 
    setLoggedIn(cookieValue !== null);
  }, []);

  // Function to get the value of a cookie by its name
  const getCookie = (cookieName) => {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }

    return null;
  };

  const handleLogout = () => {
    
    // Clear the cookie
    Cookies.remove('username');
    // Update the login state
    setLoggedIn(false);
  };

  return (
    <UsernameProvider>
      <div className="App">
        <Router>
          {isLoggedIn && (

            <div className="navbar">

              <Link to="/" id="root">
             
                Landing Page

              </Link>

              <Link to="/home" id="home">
              
                Init Database
              </Link>

              <Link to="/Channellist" id="channel">
            
                Channels

              </Link>

              <Link to="/createchannel" id="createc">

                New Channel

              </Link>

              <Link to="/search" id="search">

                 Search

               </Link>


               <Link to="/profile" id="profile">Profile</Link>

               <Link to="/admin" id="admin">Admin</Link>


              <Link to="/">

              {isLoggedIn && 
              <button id="logout" onClick={handleLogout}>Logout</button>
              }
              
              </Link>

            </div>
          )}

          <Routes>
            {!isLoggedIn && <Route path="/" element={<Landing />} />}
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Init />} />
            <Route path="/Channellist" element={<Channellist />} />
            <Route path="/createchannel" element={<Createchannel />} />
            <Route path="/" element={<Landing />} />
            <Route
              path="/Channelist/talk/channel/:name"
              element={<PostMessageOnChannel />}
            />
            <Route path="/:channelname/posts/:id/comment" element={<ReplyPost />} />
            <Route path="/search" element={<SearchOption />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
        
      </div>
    </UsernameProvider>
  );
}

export default App;
