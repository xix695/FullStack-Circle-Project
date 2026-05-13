import { useState } from 'react';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {useFormik} from 'formik';
import  '../App';
import * as Yup from 'yup'
import './css/Signup.css'



const signupValidationSchema = Yup.object().shape({
  userName: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
  passwordRepeat: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Repeat Password is required'),
});


const Reg = () => {
  const [regStatus, setRegStatus] = useState(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState();
  const [color, setColor] = useState("");
  const [result, setResult] = useState("");

  const {
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      passwordRepeat: '',
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values) => {
      handleRegistration(values);
    },
  });

  const handleRegistration = async ({ userName, email, password, passwordRepeat }) => {
    if (password === passwordRepeat) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('profile', file ? file.name : null);
        formData.append('username', userName);
        formData.append('password', password);
        formData.append('email', email);
  
        const response = await Axios.post("http://localhost:8080/register", formData);
  
        if (response.data) {
          setRegStatus(true);
          setMessage(response.data.message);
        } else {
          setResult("An error occurred while posting data. Post Content can't be empty");
          setColor("red");
        }
      } catch (error) {
        console.error('Registration error:', error);
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

  return (
    <div className='regContain'>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="userName"
          value={values.userName}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Username"
        />
     
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
       

        <input
          type="email"
          name='email'
          value={values.email}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder="Email"
        />
      
        {touched.email && errors.email && <small>{errors.email}</small>}
       

        <button type="submit">Register</button>
      </form>

    <br />

    {/* {!regStatus && <p style={{color: 'red', width: '100%', fontSize: '20px'}}>Passwords and Username do not match.</p>} */}
    {!result && <p style={{color: color, width: '100%', fontSize: '20px'}}>{result}</p>}

<br/>

<input type='file' onChange={handleFile} />

<div className='navbar'>

<Link to="/login">Log in</Link>

<Link to="/">Landing Page</Link>

</div>

      {regStatus && <p style={{color: 'black', width: '100%', fontSize: '20px'}}>{message}</p>}

    </div>
  );
};

export default Reg;

