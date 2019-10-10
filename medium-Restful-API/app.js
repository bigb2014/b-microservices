import express from 'express';
import db from './db/db';
import bodyParser from 'body-parser';
import { AlexaForBusiness } from 'aws-sdk';
// Set up the express app
const app = express();

// parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

// get all todos
app.get('/api/v1/todos', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'todos retrieved successfully',
    todos: db
  })
});


// Just, as usual, this endpoint takes two parameters, the route and the callback function. 
// the different thing here is that the route in this endpoint has a :id,
//  there are times we want to pass parameters to our endpoints because we 
//  will need them in our application, to pass those parameters we use :param.

// every time we make a request to this endpoint we pass along the id of the todo we want to get, 
// the callback function will then query the database for the todo with that application.

// What is going on in the endpoint above is that we pass the id of the todo we want to get
//  as a parameter to route, to get the value of id passed to the route we use req.params.id, 
//  req.params is an object that contains all the parameters passed to the routes, 
//  we convert the id to an int and then we loop through our dummy database db to 
//  find the todo whose id will be equal to the one we got from the URL, 
//  the matching todo is then returned as the single todo.

app.get('/api/v1/todos/:id', (req,res) => {
  const id = parseInt(req.params.id, 10);

  db.map((todo) =>{
    if (todo.id == id) {
      return res.status(200).send({
        success: 'true',
        message: 'todo retrieved successfully',
        todo,
      });//end  return
    }//end if
  })//end db.map
  return res.status(404).send({
    success: 'false',
    message: 'todo does not exist'
  });
});

// //update
// just as usual we get the id of the todo we want to update from the URL, 
// we loop through our dummy db to find the todo with that id, if we don’t find the todo then we return a message
//  to the user saying todo not found. If we find the todo then we get new input supplied by the user, 
//  the new input is parsed by body parser to the req.body, we get the updated entries from req.body 
//  and create an updated todo object with it. We then use db.splice to remove the old todo that match our
//   iteration when we looped through the dummy db and replace it with the updatedTodo that we created.
app.put('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let todoFound;
  let itemIndex;
  db.map((todo, index) => {
    if (todo.id === id) {
      todoFound = todo;
      itemIndex = index;
    }
  });

  if (!todoFound) {
    return res.status(404).send({
      success: 'false',
      message: 'todo not found',
    });
  }

  if (!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required',
    });
  } else if (!req.body.description) {
    return res.status(400).send({
      success: 'false',
      message: 'description is required',
    });
  }

  const updatedTodo = {
    id: todoFound.id,
    title: req.body.title || todoFound.title,
    description: req.body.description || todoFound.description,
  };

  db.splice(itemIndex, 1, updatedTodo);

  return res.status(201).send({
    success: 'true',
    message: 'todo added successfully',
    updatedTodo,
  });
});

//delete todo
// basically we are passing the id of the todo we want to delete as a parameter to the route /api/v1/todos/:id. 
// we fetch that id with req.params.id, So for us to delete an item with this id we have to first search for it in the database, 
// we did that by mapping through the db array and check the id of the current todo in 
// the iteration against the id we got from route till we find a match, we then use array method splice() 
// to remove that item from the database. you can learn more about array.splice and how it works here. 
// In the case where we do not find anything we return a message to the user stating ‘todo not found’.
app.delete('/api/v1/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  db.map((todo, index) =>{
    if (todo.id === id) {
      db.splice(index, 1);
      return res.status(200).send({
        success: 'true',
        message: 'Todo delete successfully',
      });
    }
  });
  return res.status(404).send({
    success: 'false',
    message: 'todo not found',
  });
});// end of endpoint delete


// postman setup; select post > body > x-www-form-urlencode > add title:value amd description:value under keys
// or postman > post > raw > select json, pass raw json below
// {
//   "title": "breakfast",
//   "description": "get breakfast"
//   }
app.post('/api/v1/todos', (req, res) => {
  if(!req.body.title) {
    return res.status(400).send({
      success: 'false',
      message: 'title is required'
    });
  } else if(!req.body.description) {
    return res.status(400).send({
      success: 'false',
      message: 'description is required'
    });
  }
  // push information to the dummy db
 const todo = {
   id: db.length + 1,
   title: req.body.title,
   description: req.body.description
 }
 db.push(todo);
 return res.status(201).send({
   success: 'true',
   message: 'todo added successfully',
   todo
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

// app.listen creates a web server for us, it takes two parameters, 
// the first parameter is the port we want our application to listen on t, whatever port we provide, 
// in our case, 5000 will be the port our server will be running on in our system.

// the second parameter is optional, it is a callback function of what should happen when the server gets created, 
// in our case we are logging a message to the console. when the sever gets created then we can access our endpoint ’/api/v1/todos’ from there. 
// the server will run on a port 5000 on a localhost on our machine. 
// so we’ll have our localhost:port/api route.
// The endpoint we created will be accessed like this localhost:5000/api/v1/todos.