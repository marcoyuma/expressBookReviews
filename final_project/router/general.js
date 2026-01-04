const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
const { users } = require("./auth_users.js");

const router = express.Router();

// Get all books available in the shop
router.get("/", async (req, res) => {
    try {
        const response = await axios.get(
            "http://localhost:8000/internal/books"
        );
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Internal endpoint for fetching books data
router.get("/internal/books", (req, res) => {
    res.json(books);
});

// Get book details based on ISBN
router.get("/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        books[isbn] ? resolve(books[isbn]) : reject("Book not found");
    })
        .then((book) => res.json(book))
        .catch((err) => res.status(404).json({ message: err }));
});

// Get book details based on author
router.get("/author/:author", (req, res) => {
    const author = req.params.author.toLowerCase();

    new Promise((resolve) => {
        const result = Object.values(books).filter(
            (book) => book.author.toLowerCase() === author
        );
        resolve(result);
    }).then((data) => res.json(data));
});

// Get all books based on title
router.get("/title/:title", (req, res) => {
    const title = req.params.title.toLowerCase();

    new Promise((resolve) => {
        const result = Object.values(books).filter(
            (book) => book.title.toLowerCase() === title
        );
        resolve(result);
    }).then((data) => res.json(data));
});

// Get book review by ISBN
router.get("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    res.json(books[isbn].reviews);
});

// Register a new user
router.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (users.find((u) => u.username === username)) {
        return res.status(409).json({ message: "User already exists" });
    }

    users.push({ username, password });
    res.json({ message: "User registered successfully" });
});

module.exports = router;
