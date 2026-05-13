**video Link**

https://usask.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=814954ec-01bd-4712-ac44-b449004111cc


**submitted files and folder structure:**

- root
  - /client/
    - Dockerfile
    - package.json
    - /src/
      - /controller/
      - /pages/
        - /css/
          - PostDetails.css
          - PostMessageOnChannel.css
          - Search.css
          - Signup.css
        - Admin.js
        - Channellist.js
        - Createchannel.js
        - Init.js
        - Landing.js
        - Login.js
        - PostMessageOnChannel.js
        - Profile.js
        - Register.js
        - ReplyPost.js
        - SearchOption.js
      - /useContext/
        - Username.js
      - App.css
      - App.js
      - index.js
      - reportWebVitals.js
  - /server/
    - Dockerfile
    - package.json
    - /src/ 
      - /model/
        - createDatabaseTables.js
        - dbconnector.js
        - initDatabase.js
      - /routes/
        - administratorRoutes.js
        - channelRoutes.js
        - postRoutes.js
        - replyRoutes.js
        - searchRoutes.js
        - serviceRoutes.js
        - uploadFile.js
        - xRoutes.js
      - server.js
  - compose.yaml
  - Test-Report.pdf
  - Design-Report.pdf
  - readMe.md
   
  
**instruction of running the program**
   

Step 1: docker compose up -d

step 2: docker exec -it db2 bash

step 3: mysql -uroot -padmin

step 4: open another terminal

step 5: docker attach n2

step 6: npm init (input server.js as main file name)

step 7: npm install express nodemon cors body-parser mysql multer

step 8: cd src

step 9: npx nodemon server.js

step 10: open another terminal

step 11: docker attach r2

step 12: npx create-react-app my-react-app

step 13: cd my-react-app

# 14~17 are React patches

step 14: npm install axios react-router-dom@6 js-cookie formik yup

step 15: npm install --save-dev @babel/plugin-proposal-class-properties

step 16: npm install --save-dev @babel/plugin-proposal-decorators

step 17: npm install --save-dev @babel/plugin-proposal-private-property-in-object

step 18: copy src folder src located in ./client/ to ./client/my-react-app to replace existing src folder in ./client/my-react-app

step 19: stay in the folder ./my-react-app

step 20: npm start

# dependencies list used for the system
# Except a few dependencies, all other dependencies were frequently used in assignment 1 ~ 4. I give some notes to the a few dependencies which I didn't used for our assignments.

Back-end:

1. express
npm install express

2. cors
npm install cors

3. mysql
npm install mysql

4. nodemon
npm install nodemon

5. body-parser
npm install body-parser

6. npm install multer
   
   Multer is a middleware for handling multipart/form-data, primarily used for uploading files. It is commonly used when you need to handle file uploads in your application. For this project, I used it to handle screenshot pictures to achieve each post, message to be sent with or without screenshot picture file.


Front-end:

1. axios
npm install axios

2. router
npm install react-router-dom@6

3. js-cookie
npm install js-cookie

js-cookie is a simple, lightweight JavaScript library for handling cookies. It provides an easy way to create, read, and delete cookies in the browser, which can be useful for managing user sessions and storing small amounts of data. For this project, just keep the logged user in each web page of my system.

4. Formik
npm install Formik

Formik is a form library for React that helps with the management of form state, form
validation, and form submission. It simplifies the process of building and handling forms in React applications. For this project, I use it to work with yup to achieve sign up Form email, password input validate. 

5. yup
npm install yup

Yup is a JavaScript schema builder for value parsing and validation. It is often used in conjunction with Formik for form validation. Yup allows you to define a schema for your form data and validate it easily. For this project, I use it for sign up Form email, password input validate.













  





  
