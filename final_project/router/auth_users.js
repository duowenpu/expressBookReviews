const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.filter((user)=>user.username===username).length>0;

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.filter((user)=>user.username===username && user.password===password).length>0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  if(isValid(username)){
    if(authenticatedUser(username, password)){
      const accessToken = jwt.sign({username}, "your_secret_key", {expiresIn: '1h'});
      req.session.accessToken = accessToken;
      return res.status(200).json({message:"Login succeed!", accessToken});
    }else{
      return res.status(401).json({error:"Wrong password"});
    }
  }else{
    return res.status(401).json({error:"User doesn't exist!"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const username=req.session.username;
  const isbn = req.params.isbn;
  const review = req.query.review;
  if(!books[isbn]){
    return res.status(404).json({error:"Book doesn't exist"});
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({message:"Successful reviewed"});
});

regd_users.delete("/auth/review/:isbn", (req, res)=>{
  const username=req.session.username;
  const isbn = req.params.isbn;
  if(!books[isbn]){
    return res.status(404).json({error:"Book doesn't exist"});
  }
  if(!books[isbn].reviews[username]){
    return res.status(404).json({error:"You haven't reviewed the book"})
  }else{
    delete books[isbn].reviews[username];
    return res.status(200).json({message:"You have deleted your review"});
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
