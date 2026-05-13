import { useState } from 'react';
import '../App.css';
import Axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import  '../App';

const LogIn = () => {
  const [password, setPassword] = useState('password');
  const [userName, setUserName] = useState('');
  const [loginMsg, setLoginMsg] = useState('');

  const handlerClick = () => {
    Axios.put('http://localhost:8080/login', {
      username: userName,
      password: password,
    })
      .then((res) => {
        if (res.statusText === 'OK') {
      
          const { username } = res.data;

          Cookies.set('username', username);

          document.cookie = `username=${username}; path=/`;

          window.location.href = '/';

        } else {
          console.log(`Load data error...status ${res.status}`);
          console.log(res);
          setLoginMsg("");
          
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoginMsg("Login failed due to username and password mismatch");
      });
  };

  return (
    <div>
      <div className='loginContain'>
        <h2>Log in</h2>
        <p>
          <label>UserName: </label>
          <input
            className='inputName'
            onChange={(event) => {
              setUserName(event.target.value);
            }}
          ></input>
        </p>
        <p>
          <label>Password:</label>
          <input
            type='password'
            className='inputpass'
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          ></input>
        </p>
        <button className='login' onClick={handlerClick}>
          Log in
        </button>

      
        <div className='navbar'>

          <Link to="/register">Register</Link>

          <Link to="/">Landing Page</Link>

</div>

     {loginMsg && <p>{loginMsg}</p>}
  

      </div>
    </div>
  );
};

export default LogIn;
