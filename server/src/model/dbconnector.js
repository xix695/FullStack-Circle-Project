const mysql = require('mysql');

//Database Connection
const db = mysql.createConnection({
    host: "mysql1",
    user: "root",
    password: "admin",
  });

  

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Server!');
  }); 

  module.exports = {
    db,
  }