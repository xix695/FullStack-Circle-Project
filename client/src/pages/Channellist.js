import '../App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import {Link} from "react-router-dom";
import Cookies from 'js-cookie';

const Channellist = () => {
  const [channellist, setChannellist] = useState([]);

  let username = Cookies.get('username');
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get("http://localhost:8080/channels");
        if (response.status === 200) {
          setChannellist(response.data);
        } else {
          console.log(`Load data error. Status: ${response.status}`);
          console.log(response);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }); 

  
  const deleteChannel = async (id, channel_name) => {
    try {
      
      const [response1, response2, response3] = await Promise.all([
        Axios.delete(`http://localhost:8080/channel/delete/${id}`),
        Axios.delete(`http://localhost:8080/post/delete/name/${channel_name}`),
        Axios.delete(`http://localhost:8080/comment/delete/name/${channel_name}`),
      ]);
  
      // Check if the response status is successful for each request
      if (response1.status === 200) {
        console.log("Channel deleted successfully in table channels");
      } else {
        console.error(`Error deleting channel in table channels. Status: ${response1.status}`);
        console.log(response1.data); 
      }
  
      if (response2.status === 200) {
        console.log("Channel deleted successfully in table posts");
      } else {
        console.error(`Error deleting channel in table posts. Status: ${response2.status}`);
        console.log(response2.data);
        
      }
  
      if (response3.status === 200) {
        console.log("Channel deleted successfully in table comments");
      } else {
        console.error(`Error deleting channel in table comments. Status: ${response3.status}`);
        console.log(response3.data);
        
      }
    } catch (error) {
      console.error("Error deleting channel:", error.message);
    }
  };


  const deleteUser = async (author) => {
    try {
      const response = await Axios.delete(`http://localhost:8080/user/delete/${author}`);
      
      if (response.status === 200) {
        console.log("The user (and all posts and comments posted by the user) were deleted successfully.");
      } else {
        console.error(`Error deleting the user. Status: ${response.status}`);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };
  
  
  return (
    <div className='channellist'>
        <h1>All Channels</h1>
      <h2 style={{ color: 'green' }}>Welcome {username}</h2>
      <div className='list_container'>
        {channellist && channellist.length > 0 ? (
          channellist.map((value, index) => (
            <div className='posts' key={index}>
              <Link className='mainInfo' to={`/Channelist/talk/channel/${value.channel}`} state={{value:value}}>
                <h3>channel: {value.channel}</h3>
                <h3>channelDescrip: {value.channelDescrip}</h3>
                <h3>createdBy: {value.createBy} {value.created_at}</h3>
              </Link>
             {(username==="admin")&&(<button className='deleteChannel' onClick={()=>{deleteChannel(value.id, value.channel)}}>Delete</button>)} 
             {(username==="admin" && value.createBy!=="admin")&&<button className='deleteUser' onClick={()=>{deleteUser(value.createBy)}}>Delete the User</button>} 
            </div>
            
          ))
        ) : (
          <p>No channels available.</p>
        )}
        </div>
      
    </div>
  );
};

export default Channellist;


