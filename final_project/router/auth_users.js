const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username": "omer", "password": "omer1234" }];

const isValid = (username) => { //returns boolean
    let userExists = users.find(user => user.username === username);
    if (userExists) {
        return true
    } else {
        return false
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    let validUser = users.find(user => user.username === username && user.password === password);
    if (validUser) {
        return true
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" })
    }
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }
    const accessToken = jwt.sign({ username: username }, 'fingerprint_customer', { expiresIn: '1h' });
    req.session.authorization = { accessToken };

    return res.status(200).json({ message: "Login successful", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username;

    console.log("username", username)

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }


    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }


    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }


    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const username = req.user.username;


    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }


    if (books[isbn].reviews && books[isbn].reviews[username]) {

        delete books[isbn].reviews[username];

        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: "Review not found" });
    }

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
