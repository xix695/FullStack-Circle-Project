// administratorRoutes.js
// these routes to deal with tickets and privilege authorization issues.

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


 // update privilege

 router.put('/privilege/update/:username', async (req, res) => {

    const username = req.params.username;
    const privilege = req.body.privilege;
    try {

    // Check if the username already exists in the database
    const existingUser = await query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
      // update user information
      const result = await query(
        'UPDATE users SET privilege = ? WHERE username = ?',
        [privilege, username]
      );
  
      res.status(201).json({ message: 'User privilege was updated successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating the user privilege'});

    }
  });

  // get open tickets

  router.get('/tickets/getAll', async (req, res) => {
    try {
    
      // Query to retrieve all tickets from table tickets
      const queryResult = await query('SELECT * FROM tickets WHERE status = 0');
  
      res.json({ message: 'All open tickets retrieved successfully', tickets: queryResult });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving open tickets' });
    }
  });

   // get close tickets

   router.get('/tickets/getAll2/:username', async (req, res) => {
    try {
    
      // Query to retrieve all tickets from table tickets
      const queryResult = await query('SELECT * FROM tickets WHERE status = 1');
  
      res.json({ message: 'All close tickets retrieved successfully', tickets: queryResult });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving open tickets' });
    }
  });


  // post a ticket

  router.post('/tickets/create', async (req, res) => {
    try {
     
      const {username, contents } = req.body;
  
      // Validate the request body and ensure that required fields are present
  
      if (!username || !contents) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const result = await query(
        'INSERT INTO tickets (username, contents) VALUES (?, ?)',
        [username, contents]
      );
      res.json({ message: 'Ticket created successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating the ticket' });
    }
  });


  // close a ticket

 router.put('/tickets/close/:id', async (req, res) => {

    const id = req.params.id;
    const comment = req.body.comment;
    try {

      // update user information
      const result = await query(
        'UPDATE tickets SET comment = ?, status = ? WHERE id = ?',
        [comment, 1, id]
      );
  
      res.status(201).json({ message: 'Ticket closed successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error closing the ticket.'});

    }
  });









  module.exports = router;
