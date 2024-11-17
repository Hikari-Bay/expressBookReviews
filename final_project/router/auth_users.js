const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
 // Check if the username is non-empty and is alphanumeric
    const usernameRegex = /^[a-zA-Z0-9]+$/; // Allows letters and numbers only
    return typeof username === "string" && username.length > 3 && usernameRegex.test(username)

}

const authenticatedUser = (username,password)=>{ //returns boolean
   // Check if the username and password match an existing record
    const user = users.find(user => user.username === username && user.password === password);
    return !!user; // Returns true if a matching user is found, otherwise false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
