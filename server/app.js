require('dotenv').config({path:'./.env'});
const mongoose = require('mongoose');
const express = require('express');
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;

const app = express();

//DB connection
require('./db/conn')
//User Model
const User = require('./models/userschema');

//middleware method inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.json());

app.use(cookieParser());

//We link the router file to make our route easy
app.use(require('./router/auth'));



//Middleware function are functiond that has access to the request object (req),
//the respond object (res), and the next funtion in the application's request-response
//cycle.
//The next function is the function in the Express router which, when invoked,
//executes the middleware succeeding the current middleware
// const middleware = (req,res,next)=>{
//     //here we ll check user is authenticated or not
//     console.log("You are in middleware");
//     //if yes then we ll grant access to the reqested page
//     next();
// }

//

// app.get('/',(req,res)=>{
//     res.send('Hi this is home page.');
// });

// app.get('/about', middleware, (req,res)=>{
//     res.send('Hello this is About me page from server');
// });

// app.get('/contact',(req,res)=>{
//     res.send('Hello this is Contact me page from server');
// });

// app.get('/signup',(req,res)=>{
//     res.send('Hello this is Registration page from server');
// });
// app.get('/signin',(req,res)=>{
//     res.send('Hello this is Login page from server');
// });

app.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}...`);
});