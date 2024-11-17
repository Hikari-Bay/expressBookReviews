const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    //Write your code here
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Check if username is valid using isValid function (if available)
    if (isValid && !isValid(username)) {
        return res.status(400).json({ message: "Invalid username" });
    }

    // Add the new user to the users array
    const newUser = { username, password }; // In production, hash the password
    users.push(newUser);

    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json({ message: "Success", books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;

    // Check if the book exists in the collection
    const book = books[isbn];

    if (book) {
        return res.status(200).json({ message: "Book details retrieved successfully", book });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params;

    // Filter books by author
    const booksByAuthor = Object.values(books).filter(
        (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (booksByAuthor.length > 0) {
        return res.status(200).json({ message: "Books retrieved successfully", books: booksByAuthor });
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params;

    // Filter books by title
    const booksByTitle = Object.values(books).filter(
        (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (booksByTitle.length > 0) {
        return res.status(200).json({ message: "Books retrieved successfully", books: booksByTitle });
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;

    // Get book by ISBN
    const book = books[isbn];

    if (book) {
        return res.status(200).json({ message: "Reviews retrieved successfully", reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
