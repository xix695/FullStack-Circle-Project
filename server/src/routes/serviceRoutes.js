const tab = require('../model/dbconnector');
const { promisify } = require('util');
const query = promisify(tab.db.query).bind(tab.db);
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const router = express.Router();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const initDatabase = require("../model/initDatabase");

const uploadFile = require('./uploadFile');
const { upload } = uploadFile(router);



// initialize database
router.get('/init', async (req, res) => {

    await query('DROP TABLE IF EXISTS users, channels, posts, comments, postthumbs, commentthumbs, tickets');
    
      try {
        initDatabase()
        res.send('Database initialization success');
      } catch (error) {
        
        console.error(error);
        res.status(500).send('Error initializing the database'); 
      }
    });


// register system
router.post('/register', upload.single('image'), async (req, res) => {
    const crypto = require('crypto');
    try {

      let image = null;
      if (req.file) {
        image = req.file.filename;
      }


      const { username, password, email } = req.body;
  
      // Validate the request body and ensure that required fields are present
      if (!username || !password || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
         // Check if the username or email already exists in the database
         const existingUser = await query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
  
         if (existingUser.length > 0) {
           return res.status(200).json({ message: 'Username or email already exists. Please choose another one.' });
         }
  
      // Hash the password using SHA-256
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
      // Insert the new user into the database
      const result = await query(
        'INSERT INTO users (username, password, email, profile) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, email, image]
      );
  
      res.status(201).json({ message: 'User was registered successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating a new user' });
    }
  });


  // update profile

  router.put('/profile/update/:username', upload.single('image'), async (req, res) => {
    const crypto = require('crypto');
    const username = req.params.username;
    try {

      let image = null;
      if (req.file) {
        image = req.file.filename;
      }
      const {password} = req.body;
  
      // Validate the request body and ensure that required fields are present
      if (!password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

    // Check if the username already exists in the database
    const existingUser = await query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
  
      // Hash the password using SHA-256
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
      // update user information
      const result = await query(
        'UPDATE users SET password = ?, profile = ? WHERE username = ?',
        [hashedPassword, image, username]
      );
  
      res.status(201).json({ message: 'User was updated successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating the user' });

      console.log('Username:', username);
      console.log('Request Body:', req.body);

    }
  });

 
  // log in system
router.put("/login", async (req, res) => {
    const crypto = require('crypto');
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }
  
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  
    try {
      const result = await query("UPDATE users SET current = ? WHERE username = ? AND password = ?", [username, username, hashedPassword]);
  
      if (result.affectedRows > 0) {
       
        // User login successful, set a cookie
        res.cookie('username', username, { httpOnly: true });
        res.json({ username });
      } else {
        res.status(401).json({ error: "Login failed due to username and password mismatch" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


  // delete user by username
router.delete("/user/delete/:username", (req, res) => {
    const username = req.params.username;
  
    query("DELETE FROM users WHERE username=?", [username], (err, result) => {
      if (err) {
        console.error("Error deleting user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // Check if the user was deleted successfully
      if (result.affectedRows === 0) {
        return res.status(200).json({ message: 'No user found', users: [] });
      }
  
      query("DELETE FROM channels WHERE createby=?", [username], (err, result) => {
        if (err) {
          return handleQueryError(res, err, "Error deleting channel:");
        }
  
        console.log(result);
  
        // Check if the channel was deleted successfully
        if (result.affectedRows === 0) {
          return res.status(200).json({ message: 'No channel found', channels: [] });
        }
  
        query("DELETE FROM posts WHERE createby=?", [username], (err, result) => {
          if (err) {
            return handleQueryError(res, err, "Error deleting post:");
          }
  
          console.log(result);
  
          // Check if the post was deleted successfully
          if (result.affectedRows === 0) {
            return res.status(200).json({ message: 'No post found', posts: [] });
          }
  
          // Delete from comments table
          query("DELETE FROM comments WHERE createBy=?", [username], (err, result) => {
            if (err) {
              return handleQueryError(res, err, "Error deleting comment:");
            }
  
            console.log(result);
  
            // Check if the comment was deleted successfully
            if (result.affectedRows === 0) {
              return res.status(200).json({ message: 'No comment found', comments: [] });
            }
  
            // Send a success response
            res.status(200).json({ message: "user deleted successfully" });
          });
        });
      });
    });
  });
  

  function handleQueryError(res, err, message) {
    console.error(message, err);
    return res.status(500).json({ error: "Internal Server Error" });
  }

  // get users data from table users
router.get("/user/:username", async (req, res) => {
  const username = req.params.username;

  try {
      const user = await query("SELECT * FROM users WHERE username=?", [username]);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving the user\'s infomation'});
    }
  });


  module.exports = router;