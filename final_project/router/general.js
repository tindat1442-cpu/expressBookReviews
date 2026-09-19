const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(!username || !password){
    return res.status(400).json({message:"Blank password or username"})
  }
  let usersExisted = users.filter((user)=>{
    return user.username == username;
  })
  if(usersExisted.length>0){
    return res.status(400).json({message:"user already existed"})
  } 
  users.push({username,password})
  return res.status(200).json({message: "register completed"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
 let get_books = new Promise((resolve,reject)=>{
      resolve(books)
 })
    get_books.then((books)=>{
        res.send(JSON.stringify(books))
    }).catch((error)=>{
        res.status(400).json({message:"Error"});
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let get_books_by_isbn = new Promise((resolve,reject)=>{
    if(books[isbn]) {
      resolve(books[isbn])
    } else {reject("book not found")}
 })
    get_books_by_isbn.then((books)=>{
        res.send(JSON.stringify(books))
    }).catch((error)=>{
        res.status(400).json({message:"Error or book not found"});
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookKeys = Object.keys(books);
  let result = {}
  
  let get_books_by_author = new Promise((resolve,reject)=>{
    for(let key of bookKeys){
        if(books[key]["author"]==author){
            result[key] = books[key]
        }
      }
    if(Object.keys(result).length>0){
      resolve(result)
    } else {reject("no books found for this author")}
 })
    get_books_by_author.then((books)=>{
        res.send(JSON.stringify(books))
    }).catch((error)=>{
        res.status(400).json({message:"Error"});
    })
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let bookKeys = Object.keys(books);
  let result = {}
  
  let get_books_by_title = new Promise((resolve,reject)=>{
    for(let key of bookKeys){
        if(books[key]["title"]==title){
            result[key] = books[key]
        }
      }
    if(Object.keys(result).length>0){
      resolve(result)
    } else {reject("no books found for this author")}
 })
    get_books_by_title.then((books)=>{
        res.send(JSON.stringify(books))
    }).catch((error)=>{
        res.status(400).json({message:"Error"});
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn ;
  res.send(JSON.stringify(books[isbn]["reviews"]))
  
});

module.exports.general = public_users;
 
