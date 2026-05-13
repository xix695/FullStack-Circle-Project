import '../App.css';
import { useState} from 'react';
import Axios from 'axios';
import Cookies from 'js-cookie';

function Createchannel() {

 
  let username = Cookies.get('username');

  const [channel, setChannelname] = useState("");
  const [channelDescrip, setDescription] = useState("");  
  const [result, setResult] = useState("");  
  const [color, setColor] = useState("");  
  const [successMsg, setsuccessMsg] = useState(false)

  const EventHandler = (e) => {
    e.preventDefault();
    
    Axios.post("http://localhost:8080/channel/create", {
        channel: channel,
        channelDescrip: channelDescrip,
        createBy: username
    }).then((response) => {
      if (response.data) {
        setColor("green");
        setResult("New Channel was created successfully.");
        setsuccessMsg(true)
        setChannelname('');
        setDescription('');
        
      } else {
        setResult("An error occurred while posting data.");
        setColor("red");
      }
    }).catch(error => {
     
      console.error(error);
  });
  }

  const refresh = () => window.location.reload(true);



  return (
    <div className="createchannel">
        
        {username && <h2 style={{color:'green'}}>Welcome {username}</h2>}

      {!successMsg && <div className="posts">

        <label>Channel name:</label>
        <input teyp="text" value={channel} onChange={(event) => { setChannelname(event.target.value) }} />
        <label>Description:</label>
        <textarea typ="text" value={channelDescrip} onChange={(event) => { setDescription(event.target.value) }} />

        <button type='submit' className="submit-button" onClick={EventHandler}>Submit</button>
        <button className="reset" onClick={refresh}>Reset</button>
        </div>}

        {successMsg && <h1 style={{ color: color }}>{result}</h1>}

     
      <br />
    </div>
  );
}

export default Createchannel;

