const tab = require("./dbconnector");
const { promisify } = require('util');
const query = promisify(tab.db.query).bind(tab.db);



// Define SQL queries to create tables
const createTables = [

  `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(500) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    current VARCHAR(255) DEFAULT NULL,
    profile VARCHAR(255) DEFAULT NULL,
    privilege TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channel VARCHAR(255) NOT NULL UNIQUE,
    channelDescrip VARCHAR(255) NOT NULL,
    createBy VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `,
  
  `
  CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postText TEXT NOT NULL,
    screenshot VARCHAR(255),
    createBy VARCHAR(255) NOT NULL,
    channel VARCHAR(255) NOT NULL,
    channelid INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    comment TEXT NOT NULL,
    screenshot VARCHAR(255),
    createBy VARCHAR(255) NOT NULL,
    channel VARCHAR(255) NOT NULL,
    channelid INT NOT NULL,
    parentid INT DEFAULT 0,
    replyto VARCHAR(255) DEFAULT NULL,
    marginleft INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS postthumbs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postid INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    up TINYINT DEFAULT 0,
    down TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_comment_username (postid, username)
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS commentthumbs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commentid INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    up TINYINT DEFAULT 0,
    down TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_comment_username (commentid, username)
  );
  `,

  `
  CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    contents VARCHAR(500) NOT NULL,
    comment VARCHAR(500) DEFAULT NULL,
    status TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  `
  ,

];


async function createDatabaseTables() {
    try {
      for (const item of createTables) {
        await query(item);
      }
      console.log('Database tables created successfully');
    } catch (error) {
      console.error('Error creating database tables:', error);
    } 
  }

  module.exports = createDatabaseTables;



