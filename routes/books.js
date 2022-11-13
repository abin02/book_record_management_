const express = require("express");

const { books } = require("../data/books.json");
const { users } = require("../data/users.json");
const { getAllBooks, getSingleBookById, getAllIssuedBooks } = require("../controller/book-controller");

const router = express.Router();

/*
    Route: /books
    Method: GET
    Description: Get all books
    Access: Public
    Parameters: none
*/

router.get("/", getAllBooks)

/*
    Route: /books/:id
    Method: GET
    Description: Get book by id
    Access: Public
    Parameters: id
*/

router.get("/:id", getSingleBookById)

/*
    Route: /books/issued/by-user
    Method: GET
    Description: Get all issued books 
    Access: Public
    Parameters: none
*/

router.get("/issued/by-user", getAllIssuedBooks)

/*
    Route: /books
    Method: POST
    Description: Create new book
    Access: Public
    Parameters: none
    Data: author, name, genre, price, publisher, id
*/

router.post("/", (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({
            success: false,
            message: "No data provided"
        })
    }

    const book = books.find((each) => each.id === data.id)
    if (book) {
        return res.status(404).json({
            success: false,
            message: "Book already exist with this id, Please use unique id"
        })
    }

    books.push({ ...data });
    return res.status(201).json({
        success: true,
        data: books,
    })
})

/*
    Route: /books/:id
    Method: PUT
    Description: Update book by id
    Access: Public
    Parameters: id
    Data: author, name, genre, price, publisher, id
*/

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const book = books.find((each) => each.id === id)
    if (!book) {
        return res.status(400).json({
            success: false,
            message: "Book not found wiht this id",
        })
    }
    books.forEach((each, i) => {
        if (each.id === id) {
            books[i] = {
                ...each,
                ...data,
            };
        }
    });
    return res.status(200).json({
        success: true,
        data: books,
    })
})

/*
    Route: /books/issued/withFine
    Method: GET
    Description: Get all issed books with fine
    Access: Public
    Parameters: none
*/
router.get("/issued/withFine", (req, res) => {
    const usersWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) return each;
    })

    const getDateInDays = (data = "") => {
        let date;
        if (data === "") {
            date = new Date();
        }
        else {
            date = new Date(data);
        }

        let days = Math.floor(date / (1000 * 24 * 60 * 60));
        return days;
    };

    const subscriptionType = (date, user) => {
        if (user.subscriptionType === "Basic") {
            date = date + 90;
        } else if (user.subscriptionType === "Standard") {
            date = date + 180;
        } else if (user.subscriptionType === "Premium") {
            date = date + 365;
        }
        return date;
    };



    const issuedBooksWithFine = [];

    usersWithIssuedBooks.forEach((each) => {
        let returnDate = getDateInDays(each.returnDate);
        let currentDate = getDateInDays();
        let subscriptionDate = getDateInDays(each.subscriptionDate);
        let subscriptionExpiration = subscriptionType(subscriptionDate, each);
        let fine = returnDate < currentDate
            ? subscriptionExpiration > currentDate
                ? 100
                : 200
            : 0;

        if (fine > 0) {
            const book = books.find((book) => book.id === each.issuedBook)
            book.issuedBy = each.name;
            book.issuedDate = each.issuedDate;
            book.returnDate = each.returnDate;
            book.fine = fine;
            issuedBooksWithFine.push(book);
        }
    });

    if (issuedBooksWithFine.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No issued book found"
        })
    }

    return res.status(200).json({
        success: true,
        data: issuedBooksWithFine,
    })
})


module.exports = router;