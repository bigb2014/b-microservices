import express from 'express';
import db from './db/db';
// Set up the express app
const app = express();
// get all todos
app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db
  })
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

// https://medium.com/@purposenigeria/build-a-restful-api-with-node-js-and-express-js-d7e59c7a3dfb
// We imported express which we installed at the beginning of the course, 
// app.get makes a get request to the server with the route/endpoint provided as the first parameter, 
// the endpoint is meant to return all the todos in the database. 

// The second parameter is a function that runs every time we hit that endpoint. 
// the function takes two parameters which are req and res. 
// The req object contains information about our request and the response object
// contains information about the response and methods we can use to send information back to the client.

// res.status(200) is used to send back the status of the request, 
// 200 means ok and it indicates a successful request. 
// Status codes are ways for client like web app or mobile app to check wether things went wrong or not.
// if we get a 404(which means Not Found)we don’t need to check the payload because we 
// know that nothing is coming that we are really interested in. 
// If 200 comes back we can check the payload because we know we are expecting something.

// res.send() is used to send back a response to the client, 
// the resource passed into the send as a parameter is what gets sent back to the client. 
// in this case, we send back an object which contains some information, 
// the todos property of the object contains the data we imported at the top of app.js from our dummy database.