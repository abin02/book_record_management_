//importing models
const bookdto = require("../dtos/book-dto");
const bookModel = require("../models/book-model");
const { UserModel, BookModel } = require("../models");

exports.getAllBooks = async (req, res) => {
    const books = await BookModel.find();

    if (books.length === 0)
        return res.status(404).json({
            success: false,
            message: "No book found",
        });

    return res.status(200).json({
        success: true,
        data: books,
    });
};

exports.getSingleBookById = async (req, res) => {
    const { id } = req.params;
    const book = await BookModel.findById(id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book id not found"
        });
    }
    return res.status(200).json({
        success: true,
        data: book,
    })
};

exports.getAllIssuedBooks = async (req, res) => {
    const users = await UserModel.find({
        issuedBook: { $exists: true },
    }).populate("issuedBook");

    const issuedBooks = users.map((each) => new bookdto.IssuedBook(each));

    if (issuedBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No issued book found"
        })
    }

    return res.status(200).json({
        success: true,
        data: issuedBooks,
    })
};

exports.addNewBook = async (req, res) => {
    const { data } = req.body;
    if (!data) {
        return res.status(400).json({
            success: false,
            message: "No data provided"
        })
    }

    await bookModel.create(data);
    const allBooks = await BookModel.find();

    return res.status(201).json({
        success: true,
        data: allBooks,
    })
};

exports.updateBookById = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const updatedBooks = await BookModel.findOneAndUpdate({
        _id: id
    }, data, {
        new: true
    });

    return res.status(200).json({
        success: true,
        data: updatedBooks,
    })
};

exports.getSingleBookByName = async (req, res) => {
    const { name } = req.params;
    const book = await BookModel.findOne({ name: name });
    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book id not found"
        });
    }
    return res.status(200).json({
        success: true,
        data: book,
    })
};

exports.getAllIssuedBooksWithFine = async (req, res) => {
    const usersWithIssuedBooks = await UserModel.find({ issuedBook: { $exists: true } }).populate("issuedBook").lean();

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

    console.log(usersWithIssuedBooks);

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
            issuedBooksWithFine.push(new bookdto.IssuedBookWithFine(each, fine));
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
};