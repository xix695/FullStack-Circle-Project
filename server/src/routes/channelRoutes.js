// channelRoutes.js

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




  // create a channel
  router.post('/channel/create', async (req, res) => {
    var channel = req.body.channel;
    var channelDescrip = req.body.channelDescrip;
    var createBy = req.body.createBy;

    console.log(req.body)

    try {
      const result = await query("INSERT INTO channels (channel, channelDescrip, createBy) VALUES (?,?,?)", [channel, channelDescrip, createBy]);
  
      res.json({ message: 'Channel created successfully', result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating the channel' });
    }
  }
  );


   // get all channel list
router.get('/channels', async (req, res) => {
    try {
      const channels = await query("SELECT * FROM channels");
      res.json(channels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving channels' });
    }
  });

  // get one channel by id
router.get('/channel/:id', async (req, res) => {
    const channelId = req.params.id;
  
    try {
      const channel = await query("SELECT * FROM channels WHERE id = ?", [channelId]);
  
      if (channel.length === 0) {
        res.status(404).json({ error: 'Channel not found' });
      } else {
        res.json(channel[0]); // Assuming the query returns a single channel
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error retrieving channel by ID' });
    }
  });

  // delete channel by channel id
router.delete("/channel/delete/:id", (req, res) => {
    const id = req.params.id;
  
    query("DELETE FROM channels WHERE id=?", [id], (err, result) => {
      if (err) {
        console.error("Error deleting channel:", err);
        
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // Check if the channel was deleted successfully
      if (result.affectedRows === 0) {
        // Channel with the given id not found
        return res.status(404).json({ error: "Channel not found" });
      }
  
      // Send a success response
      res.status(200).json({ message: "Channel deleted successfully" });
    });
  });






module.exports = router;
