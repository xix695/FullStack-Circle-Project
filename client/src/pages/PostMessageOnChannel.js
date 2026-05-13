import './css/PostMessageOnChannel.css';
import {useState, useEffect} from 'react';
import Axios from 'axios';
import {useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import {Link} from "react-router-dom";
import  ThumbsupCount from "../controller/ThumbsupCount"
import  ThumbsdownCount from "../controller/ThumbsdownCount"


const PostMessageOnChannel = ()=> {

  let username = Cookies.get('username');
  if(!username) username = "amazing user";

  const [file, setFile] = useState();
  

  const location = useLocation();
  const state = location.state;

  const channelname = state.value.channel;

  const [data, setData] = useState("");  
  const [result, setResult] = useState("");  
  const [color, setColor] = useState("");  
  const [posts, setPosts] = useState([]);
  const [privilege, setprivilege] = useState(0)



  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log(selectedFile)
    }
  };

const EventHandler = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('screenshot', file ? file.name : null);
    formData.append('channel', state.value.channel);
    formData.append('channelid', state.value.id);
    formData.append('postText', data);
    formData.append('createBy', username);

    const response = await Axios.post("http://localhost:8080/posts/create", formData);
    
    if (response.data) {
      setColor("green");
      setResult("Data was posted successfully.");
      setData('');
    } else {
      setResult("An error occurred while posting data. Post Content can't be empty");
      setColor("red");
    }
  } catch (error) {
    console.error("Error posting data:", error);
    setResult("Post Content can't be empty");
    setColor("red");
  }
};

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await Axios.get(`http://localhost:8080/${channelname}/posts/getAll`);
      if (response.status === 200) {
        setPosts(response.data.posts);
      } else {
        console.log(`Load data error. Status: ${response.status}`);
        console.log(response);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const user = async (username) => {
    try {
      const response = await Axios.get(`http://localhost:8080/user/${username}`);
      
      if (response.status === 200) {
        setprivilege(response.data[0].privilege)
      } else {
        console.error(`Error getting user information. Status: ${response.status}`);
        console.log(response.data); 
      }
    }catch (error) {
      console.error("Error get user information", error.message);
    }
  };


  fetchData();
  user(username);
}); 


const deletePost = async (id) => {
  try {
    // Make requests in parallel using Promise.all
    const [response1, response2] = await Promise.all([
      Axios.delete(`http://localhost:8080/post/delete/${id}`),
      Axios.delete(`http://localhost:8080/comment/delete/${id}`),
    ]);

    // Check if the response status is successful for each request
    if (response1.status === 200) {
      console.log("Post deleted successfully in table channels");
    } else {
      console.error(`Error deleting post in table posts. Status: ${response1.status}`);
      console.log(response1.data); 
    }

    if (response2.status === 200) {
      console.log("Comments deleted successfully in table posts");
    } else {
      console.error(`Error deleting comments in table commentss. Status: ${response2.status}`);
      console.log(response2.data);
    }

  } catch (error) {
    console.error("Error deleting channel:", error.message);
  }
  refresh();
};

  const refresh = () => window.location.reload(true);

  return (
    <div className="App-Msg">
        
        {username && <h2 style={{color:'green'}}>Welcome {username}</h2>}

      <div className="post-Msg">

        <h2 className='label-message'>Message on channel {state.value.channel}:</h2>
        <textarea typ="text" value={data} onChange={(event) => { setData(event.target.value) }} />

        <button type='submit' className="submit-button-Msg" onClick={EventHandler}>Submit</button>
        <button className="reset-Msg" onClick={refresh}>Reset</button>

        <input type='file' onChange={handleFile} />
      <br />
    

        <h3 style={{ color: color }}>{result}</h3>

      </div>
      <br />

  
      <div className='display-posts-container'>
      <h2 className='h2-display-posts'>All Posts on {state.value.channel}</h2>
    
      <div className='posts_container'>
        {posts && posts.length > 0 ? (
          posts.map((value, index) => (
            <div className='posts-list' key={index}>
              
                <p>post: {value.postText}</p>
                <p>createdBy: {value.createBy} {value.created_at}</p>
                {value.screenshot && <h4 style={{color:'#45a049'}}>This post contains a attachment. Click to show details</h4>}
      
              <div className='thumbs-container'>
        
                    <ThumbsupCount postState={{postid:value.id, username:username,author:value.createBy}}/>
                    <ThumbsdownCount postState={{postid:value.id, username:username,author:value.createBy}}/>

                  <Link className='mainInfo-postList' to={`/${value.channel}/posts/${value.id}/comment`} state={{value:value}}>
                           <button>Reply</button>
                           
                 </Link>

                 {(username==="admin"||(privilege>=2&&username===value.createBy))&&(<button className='deletePost' onClick={()=>{deletePost(value.id)}}>Delete</button>)}

                </div>

            </div>
          ))
        ) : (
          <p>No postss available.</p>
        )}
        
      </div>
    </div>

    </div>
  );
}

export default PostMessageOnChannel;



