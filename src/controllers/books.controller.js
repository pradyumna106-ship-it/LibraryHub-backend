import { Book } from "../models/books.model.js";
import { validateAllFields } from "../utils/validate.js"
import { InternalServerError, notFoundInDatabase } from "../utils/response.js";
import { missingField } from "../exception/exception.js";
import { createNotification } from "../utils/notification.controller.js";
import { Publisher } from "../models/publishers.model.js";
async function addBook(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
                if (!isValid) {
                    return res.status(400).json(missingField(missingFields));
                }

        const book = await Book.create(req.body);
        const publisher = await Publisher.findById(book.publisherId);

        await createNotification({
            role: "Admin",
            type: "info",
            title: "New Book Added",
            message: `New book "${book.title}" by ${book.author} from publisher ${publisher?.name || "Unknown"} was added to library.`,
        });

        await createNotification({
            role: "Member",
            type: "info",
            title: "New Book Arrived",
            message: `A new book "${book.title}" by ${book.author} (${publisher?.name || "Unknown"}) is now available in library.`,
        });

        res.status(201).json({
            message:"Book Added Successfully", book
        })
    } catch (error) {
        return InternalServerError(error,res);
    }
}

async function updateBook(req,res) {
    try {
       const { isValid, missingFields } = validateAllFields(req.body);
        if (!isValid) {
            return res.status(400).json(missingField(missingFields));
        }
        const book = await Book.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if (!book) return notFoundInDatabase(res, "Book");
        res.status(200).json({
            message:"Book Updated Successfully", book
        })
    } catch (error) {
        return InternalServerError(error,res);
    }
}

async function getBooks(req,res) {
    try {
        // Populate publisher so frontend can search by publisher name too.
        const books = await Book.find({}).populate("publisherId");
        if (!books) return notFoundInDatabase(res, "Book");
         res.send(books);
        // res.status(200).json({
        //     message: "success fully sent data",
        //     books
        // })
    } catch (error) {
       return InternalServerError(error,res);
    }
}

async function getBookCount(req,res) {
    try {
        const books = await Book.countDocuments({});
        if (!books) return notFoundInDatabase(res, "Book");
         res.send(books);
        // res.status(200).json({
        //     message: "success fully sent data",
        //     books
        // })
    } catch (error) {
       return InternalServerError(error,res);
    }
}
async function getBookById(req,res) {
    try {
        const book = await Book.findById(req.params.id).populate("publisherId");
        if (!book) return notFoundInDatabase(res, "Book");
        res.send(book);
    } catch (error) {
        return InternalServerError(error,res);
    }
}

async function deleteBook(req, res) {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return notFoundInDatabase(res, "Book");
        res.send(book);
    } catch (error) {
        return InternalServerError(error,res);
    }
}



export {
    addBook,
    updateBook,
    getBooks,
    getBookById,
    deleteBook,
    getBookCount
}