const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadFile = (app) => {
  app.use(express.json());

  const rootDirectory = path.resolve(__dirname, '..'); 
  const destinationPath = path.resolve(rootDirectory, 'public', 'images');

  app.use(express.static('public'));

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Create the destination directory if it doesn't exist
      fs.mkdir(destinationPath, { recursive: true }, (err) => {
        if (err) {
          console.error('Error creating destination directory:', err);
        }
        cb(null, destinationPath);
      });
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    },
  });

  const upload = multer({ storage });

  return { upload };
};

module.exports = uploadFile;
