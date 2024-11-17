const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "User1", password: "password123" },];

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

// Example route to add users
const addUser = (username, password) => {
    // Validate username and check if it already exists
    if (!isValid(username)) {
        return { success: false, message: "Invalid username" };
    }

    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return { success: false, message: "Username already exists" };
    }

    // Add user to the users array
    users.push({ username, password });
    return { success: true, message: "User added successfully" };
};

//only registered users can login
regd_users.post("/login", (req,res) => {
 const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    // Generate a session for the user
    req.session.username = username; // Save username in session
    return res.status(200).json({ message: "Login successful" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
 const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.username; // Get username from session

  // Check if user is logged in
  if (!username) {
    return res.status(401).json({ message: "You need to be logged in to add a review" });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review
  const book = books[isbn];
  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
