const status = {};
const initdb = require("./dbconnector");
const createDatabaseTables = require("./createDatabaseTables");

const initDatabase = () => {
  // Create the 'project353db' database if it doesn't exist
  initdb.db.query('CREATE DATABASE IF NOT EXISTS project353db', (error, result) => {
    if (error) {
      console.error(error);
      return;
    }

    // Check if the database was created or already existed
    if (result.warningStatus === 0) {
      console.log('Database already existed!');
      status.database = 'Database already existed!';
    } else {
      console.log('Database created');
      status.database = 'A database has just been created!';
    }

    // Use the 'project353db' database
    initdb.db.query('USE project353db', (error, results) => {
      if (error) {
        console.error(error);
        return;
      }

      // Call the function to create database tables after successfully setting up the database
      createDatabaseTables();

      console.log('Using database: project353db');
      status.currentDatabase = 'Using database: project353db';
    });
  });
};

initDatabase();

module.exports = initDatabase;
