const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');

const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (isValid(username)) {
        return res.status(400).json({ message: "Username is already taken" });
    }

    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User registered successfully" });
})

// Get the book list available in the shop
// public_users.get('/', function (req, res) {

//     res.send(JSON.stringify(books, null, 4))
// });
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('https://gokbakar35om-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//     const { isbn } = req.params;
//     if (books[isbn]) {
//         return res.status(200).json(books[isbn])
//     } else {
//         return res.status(404).json({ message: "Book not found" });
//     }

// });
public_users.get('/isbn/:isbn', async function (req, res) {
    const { isbn } = req.params;

    try {
        const response = await axios.get(`https://gokbakar35om-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
        const book = response.data;

        if (book) {
            return res.status(200).json(book);
        } else {
            return res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book details", error: error.message });
    }
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//     const { author } = req.params;
//     const matchingBooks = Object.values(books).filter(book => book.author === author);

//     if (matchingBooks.length > 0) {
//         return res.status(200).json(matchingBooks);
//     } else {
//         return res.status(404).json({ message: "No books found for this author" });
//     }
// });

public_users.get('/author/:author', async function (req, res) {
    const { author } = req.params;

    try {
const response=
await axios.get(`https://gokbakar35om-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${encodeURIComponent(author)}`);
        const books = response.data;

        if (books.length > 0) {
            return res.status(200).json(books);
        } else {
            return res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books by author", error: error.message });
    }
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//     const { title } = req.params;
//     const matchingBooks = Object.values(books).filter(book => book.title === title);

//     if (matchingBooks.length > 0) {
//         return res.status(200).json(matchingBooks);
//     } else {
//         return res.status(404).json({ message: "No books found with this title" });
//     }
// });

public_users.get('/title/:title', async function (req, res) {
    const { title } = req.params;

try {
    const response =
    await axios.get(`https://gokbakar35om-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${encodeURIComponent(title)}`);
    const matchingBooks = response.data;

    if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
       } else {
            return res.status(404).json({ message: "No books found with this title" });
    }
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = parseInt(req.params.isbn, 10);

    if (books[isbn] && books[isbn].reviews) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

module.exports.general = public_users;
