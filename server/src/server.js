const tab = require('./model/dbconnector');
const { promisify } = require('util');
const query = promisify(tab.db.query).bind(tab.db);
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8080;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import route files
const channelRoutes = require('./routes/channelRoutes');
const postRoutes = require('./routes/postRoutes');
const replyRoutes = require('./routes/replyRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const xRoutes = require('./routes/xRoutes');
const searchRoutes = require('./routes/searchRoutes');
const administratorRoutes = require('./routes/administratorRoutes');

// Use the routes
app.use('/', channelRoutes); 
app.use('/', postRoutes); 
app.use('/', replyRoutes); 
app.use('/', serviceRoutes); 
app.use('/', xRoutes); 
app.use('/', searchRoutes);
app.use('/', administratorRoutes);


// just test purpose.
app.get('/', (res, req)=>{

  req.json({message: "Hello World, Welcome to project353 API."})

})



app.listen(PORT, () => {
  console.log(`The program is running on ${PORT}`);
});
