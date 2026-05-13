// postRoutes.js

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


//get all posts from posts table include specific string

router.get('/posts/getAll/:spec', async (req, res) => {
  try {
    // Extract the specific string from the URL parameters
    let { spec } = req.params;

    spec = spec || 'empty';

    // Query to retrieve all comments from the table comments where the column comment contains the specific string
    const queryResult = await query('SELECT * FROM posts WHERE postText LIKE ?', [`%${spec}%`]);

    // Check if there are posts in the result
    if (queryResult.length === 0) {
      return res.status(200).json({ message: 'No posts found for the specified string', posts: [] });
    }

    res.json({ message: 'posts containing the specified string retrieved successfully', posts: queryResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving comments' });
  }
});


  //get all posts from posts table by specific user

  router.get('/posts/getAll/author/:author', async (req, res) => {
    try {
      // Extract the specific string from the URL parameters
      let { author } = req.params;

      author = author || 'empty';
  
      // Query to retrieve all comments from the table comments where the column comment contains the specific string
      const queryResult = await query('SELECT * FROM posts WHERE createBy = ?', [author]);
  
      // Check if there are comments in the result
      if (queryResult.length === 0) {
        return res.status(200).json({ message: 'No posts found for the user', posts: [] });
      }
  
      res.json({ message: 'Posts created by the user retrieved successfully', posts: queryResult });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving comments' });
    }
  });

    //get all comments from comments table include specific string

    router.get('/comments/getAll/:spec', async (req, res) => {
        try {
          // Extract the specific string from the URL parameters
          let { spec } = req.params;

          spec = spec || 'empty';
      
          // Query to retrieve all comments from the table comments where the column comment contains the specific string
          const queryResult = await query('SELECT * FROM comments WHERE comment LIKE ?', [`%${spec}%`]);
      
          // Check if there are comments in the result
          if (queryResult.length === 0) {
            return res.status(200).json({ message: 'No comments found for the specified string', comments: [] });
          }
      
          res.json({ message: 'Comments containing the specified string retrieved successfully', comments: queryResult });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error retrieving comments' });
        }
      });

        //get all comments from comments table by specific user

    router.get('/comments/getAll/author/:author', async (req, res) => {
        try {
          // Extract the specific string from the URL parameters
          let { author } = req.params;

          author = author || 'empty';
      
          // Query to retrieve all comments from the table comments where the column comment contains the specific string
          const queryResult = await query('SELECT * FROM comments WHERE createBy = ?', [author]);
      
          // Check if there are comments in the result
          if (queryResult.length === 0) {
            return res.status(200).json({ message: 'No comments found for the user', comments: [] });
          }
      
          res.json({ message: 'Comments created by the user retrieved successfully', comments: queryResult });
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error retrieving comments' });
        }
      });


// Get user with the most posts/replies
router.get('/most', async (req, res) => {
  try {
    const queryResult = await query(`
      SELECT createBy, 
             SUM(CASE WHEN tableName = 'posts' THEN 1 ELSE 0 END) AS postCount,
             SUM(CASE WHEN tableName = 'comments' THEN 1 ELSE 0 END) AS commentCount
      FROM (
        SELECT createBy, 'posts' AS tableName FROM posts
        UNION ALL
        SELECT createBy, 'comments' AS tableName FROM comments
      ) AS combined
      GROUP BY createBy
      ORDER BY (postCount + commentCount) DESC
      LIMIT 1;
    `);

    if (queryResult.length === 0) {
      return res.status(404).json({ message: 'No users found with posts or comments' });
    }

    res.json({ message: 'User with the most posts and comments retrieved successfully', user: queryResult[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user with the most posts and comments' });
  }
});

// Get user with the least posts.replies
router.get('/least', async (req, res) => {
  try {
    const queryResult = await query(`
      SELECT createBy, 
             SUM(CASE WHEN tableName = 'posts' THEN 1 ELSE 0 END) AS postCount,
             SUM(CASE WHEN tableName = 'comments' THEN 1 ELSE 0 END) AS commentCount
      FROM (
        SELECT createBy, 'posts' AS tableName FROM posts
        UNION ALL
        SELECT createBy, 'comments' AS tableName FROM comments
      ) AS combined
      GROUP BY createBy
      ORDER BY (postCount + commentCount) ASC
      LIMIT 1;
    `);

    if (queryResult.length === 0) {
      return res.status(404).json({ message: 'No users found with posts or comments' });
    }

    res.json({ message: 'User with the least posts and comments retrieved successfully', user: queryResult[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user with the least posts and comments' });
  }
});



// Get user with the highest ranking
router.get('/ranking/highest', async (req, res) => {
  try {
    const queryResult = await query(`
      SELECT author, SUM(up - down) AS ranking
      FROM (
        SELECT author, up, down FROM postthumbs
        UNION ALL
        SELECT author, up, down FROM commentthumbs
      ) AS combined_thumbs
      GROUP BY author
      ORDER BY ranking DESC
      LIMIT 1;
    `);

    if (queryResult.length === 0) {
      return res.status(404).json({ message: 'No users found with ranking' });
    }

    res.json({ message: 'User with the highest ranking retrieved successfully', user: queryResult[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user with the highest ranking' });
  }
});

// Get user with the lowest ranking
router.get('/ranking/lowest', async (req, res) => {
  try {
    const queryResult = await query(`
      SELECT author, SUM(up - down) AS ranking
      FROM (
        SELECT author, up, down FROM postthumbs
        UNION ALL
        SELECT author, up, down FROM commentthumbs
      ) AS combined_thumbs
      GROUP BY author
      ORDER BY ranking ASC
      LIMIT 1;
    `);

    if (queryResult.length === 0) {
      return res.status(404).json({ message: 'No users found with ranking' });
    }

    res.json({ message: 'User with the lowest ranking retrieved successfully', user: queryResult[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving user with the lowest ranking' });
  }
});

module.exports = router;

