// xRoutes.js

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


  // add thumbs up/down on the post
  router.post('/thumbs/onpost', async (req, res) => {

    const postid = req.body.postid;
    const username = req.body.username;
    const author = req.body.author;
    const up = req.body.up;
    const down = req.body.down;

    console.log(req.body);

    try {
      // Check if a record already exists with the same postid and username
      const existingRecord = await query(
        'SELECT * FROM postthumbs WHERE postid = ? AND username = ?',
        [postid, username]
      );
  
      if (existingRecord.length > 0) {
        // If a record exists, delete it
        const result = await query('DELETE FROM postthumbs WHERE postid = ? AND username = ?', [postid, username]);
        res.json({ message: 'Thumbs up or down information cancelled successfully', result});
      }
      else{
        const result = await query(
            'INSERT INTO postthumbs (postid, username, author, up, down) VALUES (?, ?, ?, ?, ?)',
            [postid, username, author, up, down]
          );
          res.json({ message: 'Thumbs up or down information created successfully', result });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error thumbs up or down the post.' });
    }
  });
  

  // add thumbs up/down on the comments
  router.post('/thumbs/oncomment', async (req, res) => {

    const commentid = req.body.commentid;
    const username = req.body.username;
    const author = req.body.author;
    const up = req.body.up;
    const down = req.body.down;
    
    console.log(req.body);

    try {
      // Check if a record already exists with the same postid and username
      const existingRecord = await query(
        'SELECT * FROM commentthumbs WHERE commentid = ? AND username = ?',
        [commentid, username]
      );
  
      if (existingRecord.length > 0) {
        // If a record exists, delete it
        const result = await query('DELETE FROM commentthumbs WHERE commentid = ? AND username = ?', [commentid, username]);
        res.json({ message: 'Thumbs up or down information cancelled successfully', result });
      }
      else{
        const result = await query(
            'INSERT INTO commentthumbs (commentid, username, author, up, down) VALUES (?, ?, ?, ?, ?)',
            [commentid, username, author, up, down]
          );
          res.json({ message: 'Thumbs up or down information created successfully', result });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error thumbs up or down the comment.' });
    }
  });


// get thumbs up from post
router.get("/thumbs/onpost/up/:postid", async (req, res) => {
    const postid = req.params.postid;

    try {
        const thumbsUp = await query("SELECT * FROM postthumbs WHERE postid=? AND up=1", [postid]);
        res.json(thumbsUp);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving thumbsup on posts' });
      }
    });


 // get thumbs down from post
router.get("/thumbs/onpost/down/:postid", async (req, res) => {
    const postid = req.params.postid;
    
        try {
            const thumbsUp = await query("SELECT * FROM postthumbs WHERE postid=? AND down=1", [postid]);
            res.json(thumbsUp);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving thumbsup on posts' });
          }
        });   
  
   // get thumbs up from comments 
router.get("/thumbs/oncomments/up/:commentid", async (req, res) => {
    const commentid = req.params.commentid;
        
        try {
            const thumbsUp = await query("SELECT * FROM commentthumbs WHERE commentid=? AND up=1", [commentid]);
            res.json(thumbsUp);
            } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error retrieving thumbsup on comments' });
              }
            });
     //get thumbs down from comments   
router.get("/thumbs/oncomments/down/:commentid", async (req, res) => {
    const commentid = req.params.commentid;
            
        try {
            const ThumbsDown = await query("SELECT * FROM commentthumbs WHERE commentid=? AND down=1", [commentid]);
            res.json(ThumbsDown);
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Error retrieving thumbs down on comments' });
                  }
                });           
    

                

module.exports = router;
