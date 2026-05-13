import {useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import  './css/PostDetails.css';
import { useState, useEffect} from 'react';
import Axios from 'axios';
import  ThumbsupCountC from "../controller/ThumbsupCountC"
import  ThumbsdownCountC from "../controller/ThumbsdownCountC"


export default function PostDetails() {
  const location = useLocation();
  const state = location.state;
  let username = Cookies.get('username');
  const screenshot = state.value.screenshot;
  const createBy = state.value.createBy;
  const  postText = state.value.postText

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [file, setFile] = useState();  
  const [replyto,setReplyto] = useState("");
  const [commento,setCommento] = useState(false);
  const [marginleft, setMarginleft] = useState(0);
  const [profile, setUserProfile] = useState("")
  const [privilege, setprivilege] = useState(0)

  const [currentReply, setCurrentReply] = useState(0);
 
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
  
    }
  };


  const EventHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', file);
    formData.append('screenshot', file ? file.name : null);
    formData.append('channel', state.value.channel);
    formData.append('channelid', state.value.channelid)
    formData.append('comment', comment);
    formData.append('replyto',replyto);
    formData.append('marginleft',marginleft);
    formData.append('parentid', state.value.id);
    formData.append('createBy', username);  
  
    try {
      const response = await Axios.post("http://localhost:8080/comments/create", formData);
  
      if (response.data) {
        console.log(response.data);
        setComment('');
        setReplyto("");
        setCommento(false)
        if(file){ setFile("");refreshPage();}
    
      } else {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(`http://localhost:8080/${state.value.id}/getAllcomments`);
        if (response.status === 200) {
          setComments(response.data.comments);
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
          setUserProfile(response.data[0].profile)
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
    

  },); 


  const deleteComment = async (id) => {
    try {
      const response = await Promise([
        Axios.delete(`http://localhost:8080/comment/delete/id/${id}`),
      ]);
  
      // Check if the response status is successful for each request
      if (response.status === 200) {
        console.log("Comment deleted successfully in table comments");
        setComments("");
        setFile("");
      } else {
        console.error(`Error deleting comment in table comments. Status: ${response.status}`);
        console.log(response.data); 
      }
  
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }

    refreshPage();
  };


  const refreshPage = () => window.location.reload(true);


  return (
    <div className="App">

      <div className='singlePost'>
        <h1 style={{ color: 'green' }}>Hi, {username}</h1>
        <h2>Welcome to {state.value.createBy}'s post</h2>

        {profile&&<img
            src={`http://localhost:8080/images/${profile}`}
            alt=""
            style={{
              width: '130px', 
              height: '130px', 
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />}

      </div>

      <div className='postDetails'>
        <p>{postText}</p>
        <p>{createBy}</p>
        {screenshot && (
          <img
            src={`http://localhost:8080/images/${state.value.screenshot}`}
            alt=""
            style={{ width: "400px", height: "300px" }}
          />
        )}
      </div>

      <br/>

      {(commento)&& (
  <div className="post-Comment">
    <label>Comment the Post: </label>
    <textarea
      type="text"
      value={comment}
      onChange={(event) => setComment(event.target.value)}
    />
    <button type="submit" className="submit-add-comment" onClick={EventHandler}>
      add comment
    </button>
    <button className="reset-comment" onClick={refreshPage}>
      Reset
    </button>
    <input type='file' onChange={handleFile} />
  </div>
)}

<br/>
{!commento && <button onClick={()=>{setCommento(true); setReplyto("");setMarginleft(0)}}>Add a new comment to the Post</button>}


<div className="comment-Msg">

<br />
</div>
<br />
      <div className="App">
        <div className="list_comments">
          {comments && comments.length > 0 ? (
            comments.map((value, index) => (
             
              // achieve to visualize nested reply by setting each reply item margin-left
              <div style={{ marginLeft: value.marginleft}} className="commentss" key={index}>
                
                <p><strong>Comments No. {value.id} Created by: {value.createBy}</strong></p>
                {value.replyto && <p style={{ color: 'green' }}>Reply to {value.replyto}</p>}
                
                <br/>
                
                <p>{value.comment}</p>

                <div className='thumbs-container'>
                <ThumbsupCountC commentState={{commentid:value.id, username:username,author:value.createBy}}/>
                <ThumbsdownCountC commentState={{commentid:value.id, username:username,author:value.createBy}}/>
                </div>
                {value.screenshot && (
          <img
            src={`http://localhost:8080/images/${value.screenshot}`}
            alt=""
            style={{ width: "400px", height: "300px" }}
          />
        )}


           { (username==="admin"||(privilege>=1&&value.createBy===username)) && (<button className='deleteComment' onClick={()=>{deleteComment(value.id)}}>Delete</button>)}
          
           {/* // achieve to visualize nested reply by setting each reply item margin-left */}
           <button onClick={()=>{setReplyto(value.id + ", Author is " + value.createBy); setMarginleft(value.marginleft+35); setCurrentReply(value.id)}}>Reply</button>
      

           {/* reply only show in the relevant comment box*/}

          <div className='justtry'>

           {(replyto) && (currentReply===value.id) && (
              <div className="post-Comment">
              <label>Reply to comment No. {replyto}:</label>
              <textarea
              type="text"
               value={comment}
               onChange={(event) => setComment(event.target.value)}
              />
             <button type="submit" className="submit-add-comment" onClick={EventHandler}>
                 add comment
               </button>
              <button className="reset-comment" onClick={refreshPage}>
                     Reset
              </button>
               <input type='file' onChange={handleFile} />
               </div>
                  )}

            </div>      


            {/*  reply only show in the relevant comment box */}

              </div>


            ))

          ) : (
            <p>No comments available.</p>

           

          )}


        </div>

        <br />

      </div>
    </div>
  );
}
