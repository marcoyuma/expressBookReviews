const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");

const router = express.Router();

let users = [];

// Middleware to verify user authentication
const authenticatedUser = (req, res, next) => {
    const token = req.session.authorization?.accessToken;
    if (!token) return res.status(403).json({ message: "User not logged in" });

    jwt.verify(token, "access", (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
};

// Only registered users can login
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (!user) {
        return res.status(401).json({ message: "Invalid login credentials" });
    }

    const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });

    req.session.authorization = { accessToken };

    res.json({ message: "User successfully logged in" });
});

// Add a book review
router.put("/auth/review/:isbn", authenticatedUser, (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;
    res.json({ message: "Review added/updated successfully" });
});

// Delete a book review
router.delete("/auth/review/:isbn", authenticatedUser, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    if (!books[isbn] || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];
    res.json({ message: "Review deleted successfully" });
});

module.exports = router;
module.exports.users = users;
