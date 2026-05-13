// replyRoutes.js

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

const uploadFile = require('./uploadFile');
const { upload } = uploadFile(router);


// add a new comment on a specific post
router.post('/comments/create', upload.single('image'), async (req, res) => {
    try {
      let image = null;
      if (req.file) {
        image = req.file.filename;
      }
      const { comment, channel, channelid, parentid, createBy, replyto, marginleft } = req.body;
  
      // Validate the request body and ensure that required fields are present
  
      if (!comment || !channel || !parentid || !createBy || !channelid) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const result = await query(
        'INSERT INTO comments (comment, channel, channelid, parentid, createby, screenshot, replyto, marginleft) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [comment, channel, channelid, parentid, createBy, image, replyto, marginleft]
      );
      res.json({ message: 'Post created successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating the post' });
    }
  });


  //get all comment over one specific post

router.get('/:parentid/getAllcomments', async (req, res) => {
    try {
      // Extract the channel name from the URL parameters
      const { parentid } = req.params;
     
  
      // Query to retrieve all topics from the database for the specified channel
      const queryResult = await query('SELECT * FROM comments WHERE parentid = ?', [parentid]);
  
      // Check if there are topics in the result
      if (queryResult.length === 0) {
        return res.status(200).json({ message: 'No posts found for the specified channel', posts: [] });
      }
  
      res.json({ message: 'All posts for the specified channel retrieved successfully', comments: queryResult });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving topics' });
    }
  });

  // delete comment by channel name
router.delete("/comment/delete/name/:channel_name", (req, res) => {
    const channel_name = req.params.channel_name;
  
    query("DELETE FROM comments WHERE channel=?", [channel_name], (err, result) => {
      if (err) {
        console.error("Error deleting comment:", err);
        
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // Check if the comment was deleted successfully
      if (result.affectedRows === 0) {
        // post with the given id not found
        return res.status(404).json({ error: "Comment not found" });
      }
  
      // Send a success response
      res.status(200).json({ message: "Comments deleted successfully" });
    });
  });


  // delete comment by parent id
router.delete("/comment/delete/:parentid", (req, res) => {
    const parentid = req.params.parentid;
  
    query("DELETE FROM comments WHERE parentid=?", [parentid], (err, result) => {
      if (err) {
        console.error("Error deleting comment:", err);
        
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // Check if the comment was deleted successfully
      if (result.affectedRows === 0) {
        // Comment with the given id not found
        return res.status(404).json({ error: "Comment not found" });
      }
  
      // Send a success response
      res.status(200).json({ message: "Comment deleted successfully" });
    });
  });

  // delete comment by id
router.delete("/comment/delete/id/:id", (req, res) => {
    const id = req.params.id;
  
    query("DELETE FROM comments WHERE id=?", [id], (err, result) => {
      if (err) {
        console.error("Error deleting comment:", err);
        
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // Check if the comment was deleted successfully
      if (result.affectedRows === 0) {
        // post with the given id not found
        return res.status(200).json({ message: 'No comments found for the specified channel', comments: [] });
      }
  
      // Send a success response
      res.status(200).json({ message: "Comments deleted successfully" });
    });
  });

  module.exports = router;