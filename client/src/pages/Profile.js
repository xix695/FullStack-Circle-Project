import { useState, useEffect } from 'react';
import Axios from 'axios';
import {useFormik} from 'formik';
import  '../App';
import * as Yup from 'yup'
import './css/Signup.css'
import Cookies from 'js-cookie';


const signupValidationSchema = Yup.object().shape({
  password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
  passwordRepeat: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Repeat Password is required'),
});

const Profile = () => {
  const [regStatus, setRegStatus] = useState(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState();
  const [color, setColor] = useState("");
  const [result, setResult] = useState("");
  const [value, setValue] = useState({});
  let username = Cookies.get('username');

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      userName: value.username,
      password: '',
      passwordRepeat: '',
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values) => {
        handleUpdateProfile(values);
    },
  });


  useEffect(() => {
   
    const user = async (username) => {
      try {
        const response = await Axios.get(`http://localhost:8080/user/${username}`);
        
        if (response.status === 200) {
          setValue(response.data[0])
        } else {
          console.error(`Error getting user information. Status: ${response.status}`);
          console.log(response.data); 
        }
      }catch (error) {
        console.error("Error get user information", error.message);
      }
    };

    user(username);

  },); 
   
  const handleUpdateProfile = async ({ password, passwordRepeat }) => {
    
    if (password === passwordRepeat) {
      try {
        const formData = new FormData();
        if (file) {
          formData.append('image', file);
          formData.append('profile', file.name);
        }
        formData.append('password', password);
  
        const response = await Axios.put(`http://localhost:8080/profile/update/${username}`, formData);

        if (response.data) {
          setRegStatus(true);  
          setMessage(response.data.message);
          refreshPage();
        } else {
          setResult("An error occurred while posting data. Post Content can't be empty");
          setColor("red");
        }
      } catch (error) {
        console.error('Update error:', error);
      }
    } else {
      setRegStatus(false);
    }
  };
  
  
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log(selectedFile)
    }
  };

  const refreshPage = () => window.location.reload(true);

  
  return (
    <div className='regContain'>
        {value&&<h2 style={{color: 'green', width: '100%'}}>Welcome {value.username}</h2>}

        {value.profile&&<img
            src={`http://localhost:8080/images/${value.profile}`}
            alt=""
            style={{
              width: '130px', 
              height: '130px', 
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />}

      <form onSubmit={handleSubmit}>
        <span>username: {value.username}</span>
     
        {touched.userName && errors.userName && <small>{errors.userName}</small>}
      
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
        />

        {touched.password && errors.password && <small>{errors.password}</small>}
       

        <input
          type="password"
          name="passwordRepeat"
          value={values.passwordRepeat}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Repeat Password"
        />
       
        {touched.passwordRepeat && errors.passwordRepeat && (
          <small>{errors.passwordRepeat}</small>
        )}
       
        <span>email: {value.email}</span>
      
        <button type="submit">Update</button>
      </form>

    <br />

    {/* {regStatus && <p style={{color: 'red', width: '100%', fontSize: '20px'}}>Passwords and Username do not match.</p>} */}
    {!result && <p style={{color: color, width: '100%', fontSize: '20px'}}>{result}</p>}

<br/>

<input type='file' onChange={handleFile} />

      {regStatus && <p style={{color: 'black', width: '100%', fontSize: '20px'}}>{message}</p>}

    </div>
  );
};

export default Profile;

