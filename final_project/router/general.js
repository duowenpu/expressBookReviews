const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  const {username, password} = req.body;
  if(!username || !password){
    return res.status(401).json({message:"Need Username and Password"});
  }
  else if (users.filter(user=>user.username === username).length>0){
    return res.status(401).json({message:"Already registered"});
  }
  else {
    users.push({username, password});
  }
  return res.status(200).json("Succeed");
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books, null, 4));
});

public_users.get('/asyncget',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  let myPromise = new Promise((resolve, reject) => {
  setTimeout(()=>{
      resolve(JSON.stringify(books, null, 4));
    },1000)
  });
  myPromise.then((result)=>{
    res.send(result);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  if (isbn in books){
    res.send(books[isbn]);
  }
  else{
    res.send("Book not found");
  }
  // return res.status(300).json({message: "Yet to be implemented"});
 });

public_users.get('/asyncisbn/:isbn',function (req, res) {
  let myPromise = new Promise((resolve, reject) => {
    let isbn = req.params.isbn;
    setTimeout(()=>{
      if(isbn in books){
        resolve(books[isbn]);
      }else{
        reject(new Error("Book is not found"));
      }
    }, 1000);
  })
  myPromise.then((result)=>{
    res.send(result);
  }).catch((error)=>{
    return res.status(404).json({error:error.message});
  })
});
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  Object.keys(books).forEach((key)=>{
    if(books[key]["author"] === author){
      res.send(books[key]);
    }
  })
});

public_users.get('/asyncauthor/:author',function (req, res) {
  let author = req.params.author;
  let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
    Object.keys(books).forEach((key)=>{
      if(books[key]['author']===author){
        resolve(books[key])
      }
    })
    }, 1000);
  });
  myPromise.then((result)=>{
    res.send(result)
  });
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  let title = req.params.title;
  Object.keys(books).forEach((key)=>{
    if(books[key]["title"] === title){
      res.send(books[key]);
    }
  })
});


public_users.get('/asynctitle/:title',function (req, res) {
  let title = req.params.title;
  myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      Object.keys(books).forEach((key)=>{
        if(books[key]["title"] === title){
          resolve(books[key]);
        }
      reject(new Error("Book is not found"));
      })
    }, 1000);
  })
  myPromise.then((result)=>{
    res.send(result);
  }).catch((message)=>{
    return res.status(404).json({error:message.message});
  }
  )
})
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  // return res.status(300).json({message: "Yet to be implemented"});
  let isbn = req.params.isbn;
  if(isbn in books){
    res.send(books[isbn]['reviews']);
  }
});

module.exports.general = public_users;
