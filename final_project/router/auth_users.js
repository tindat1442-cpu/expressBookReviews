const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let validUsers = users.filter((user)=> user.username == username)
    return validUsers.length>0
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let authenticatedUser = users.filter((user)=>{
        if(user.username == username){
            if(user.password == password){
                return true
            }
        }
        return false

    })
    return authenticatedUser.length>0;
    
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(!isValid(username)){
    return res.status(400).json({message: "Invalid username"});
  }
  if(authenticatedUser(username,password)){
    let accessToken  = jwt.sign({data: username},'access',{expiresIn: 60 * 60});
    req.session.authorization = {accessToken,username};
    return res.status(200).json({message: "login completed"});
  }
  else
    return res.status(400).json({message: "Incorrect password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;
  const review = req.query.review;
  books[isbn]["reviews"][username] = review;
  return res.status(200).json({message: "add review completed"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    delete books[isbn]["reviews"][username];
    return res.status(200).json({message: "delete completed"});
})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
