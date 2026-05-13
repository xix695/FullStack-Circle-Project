import { useState, useEffect } from 'react';
import '../App.css';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [login, setLogin] = useState(false);
  let username = Cookies.get('username');
 
  useEffect(() => {
    if (username) {
      setLogin(true);
    }
    else{setLogin(false);}
  }, [username]);

  return (
    <div className="landingpage">
      {login && <h2 style={{ color: 'green' }}>Welcome {username}</h2>}
       
       <br/>

       {!login && (
        <h2>
          Click <Link to="/login"><strong>Log In</strong></Link> to continue
        </h2>
      )}


      {!login && (
        <h2>
          No account? Please{' '}
          <Link to="/register">
            <strong>register</strong>
          </Link>{' '}
          with your favorite name and usask email address
        </h2>
      )}
    

      <h2>This is a Landing Page</h2>

      <p>
         <h2>To</h2> <strong>briefly introduce my channel-Based Tool for Programming Issues</strong>
      </p>
      <p><strong>My Tool allows all users to </strong></p>
      <p> create Channels</p>
      <p>  view all channels</p>
      <p>   select a channel and to post messages (<strong>with or without screenshot</strong>)in that Channel </p>
      <p>   post replies (<strong>with or without screenshot</strong>) to existing message </p>
      <p>   user can reply to replies and see <strong>visualized nested replies</strong> </p>
      <p>   user can give thumbs up/down to specific messages and/or replies  </p>
      <p>   user can search the useful information across the system</p>

      <h3 style={{ color: 'green' }} className="warningx">
  Beyond that, my tool has more existing features. To see more, click <a href="https://usask.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=dedbc857-ebd4-40bf-884a-b0cb016d97ef">the short video</a>.
</h3>


    </div>
  );
};

export default Landing;

