import { validateAllFields } from "../utils/validate.js"
import { missingField } from "../exception/exception.js";
import { InternalServerError, notFoundInDatabase } from "../utils/response.js";
import { Transaction } from "../models/transactions.model.js";
import { Book } from "../models/books.model.js";
import mongoose from "mongoose";
import { BorrowRequest } from "../models/borrowRequestSchema.js";
import { createNotification } from "../utils/notification.controller.js";
import { connectDB } from "../config/database.js";
async function addTransaction(req, res) {
    try {
        const { memberId, bookId } = req.body;
        await connectDB();
        const existing = await Transaction.findOne({
            memberId,
            bookId,
            status: "Issued"
          });
          if (existing) {
              return res.status(200).json({
                message: "Transaction already exists",
                transaction: existing
              });
            }
        const transactionData = {
            memberId,
            bookId,
            issueDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // always set
            status: "Issued" // force correct value
        };

        const { isValid, missingFields } = validateAllFields(transactionData);
        if (!isValid) {
            return res.status(400).json(missingField(missingFields));
        }
        await connectDB();
        const transaction = await Transaction.create(transactionData);
        await connectDB();
        await createNotification({
            userId: memberId,
            role: "Member",
            type: "success",
            title: "Book Issued",
            message: `Book issued successfully. Due on ${transactionData.dueDate.toDateString()}`
        });

        return res.status(201).json({
            message: "Transaction Added Successfully",
            transaction
        });

    } catch (error) {
        return InternalServerError(error, res);
    }
}
async function updateTransaction(req,res) {
    try {
    const { isValid, missingFields } = validateAllFields(req.body);
        if (!isValid) {
            return res.status(400).json(missingField(missingFields));
        }
        await connectDB();
        const transaction = await Transaction.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if (!transaction) return notFoundInDatabase(res, "Transaction");
        res.status(200).json({
            message:"Book Updated Successfully", transaction
        })
    } catch (error) {
    return InternalServerError(error,res);
    }
}

async function getTransactions(req,res) {
    try {
        await connectDB();
        const transactions = await Transaction.find({});
        if (transactions.length === 0) {
            return notFoundInDatabase(res, "Transaction");
        }
        res.send(transactions);

    } catch (error) {
        return InternalServerError(error,res);
    }
}

async function getTransactionById(req,res) {
        try {
            await connectDB();
            const transaction = await Transaction.findById(req.params.id);
            if (!transaction) return notFoundInDatabase(res, "Transaction");
            res.send(transaction);
        } catch (error) {
            return InternalServerError(error,res);
        }
}

async function deleteTransaction(req,res) {
        try {
            await connectDB();
            const transaction = await Transaction.findByIdAndDelete(req.params.id);
            if (!transaction) return notFoundInDatabase(res, "Transaction");
            res.send(transaction);
        } catch (error) {
            return InternalServerError(error,res);
        }
}

async function borrowedForOneMember(req, res) {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({ error: "memberId is required" });
    }
    await connectDB();
    const borrowedBooks = await Transaction.aggregate([
      {
        $match: {
          memberId: new mongoose.Types.ObjectId(memberId),
          status: "Issued"
        }
      },
      {
        $lookup: {
          from: "books",            // ⚠️ collection name (lowercase plural)
          localField: "bookId",
          foreignField: "_id",
          as: "bookDetails"
        }
      },
      {
        $unwind: "$bookDetails"    // convert array → object
      },
      {
        $project: {
          _id: 1,
          memberId: 1,
          bookId: 1,
          issueDate: 1,
          dueDate: 1,
          returnDate: 1,
          status: 1,

          // ✅ Book fields
          title: "$bookDetails.title",
          author: "$bookDetails.author",
          category: "$bookDetails.category",
          price: "$bookDetails.price",
          image: "$bookDetails.image"
        }
      }
    ]);

    res.send(borrowedBooks);

  } catch (error) {
    return InternalServerError(error, res);
  }
}

async function getTransactionsWithNameTitle(req, res) {
  try {
    await connectDB();
    const transactions = await Transaction.aggregate([
      // 🔗 Join Member
      {
        $lookup: {
          from: "members", // collection name in MongoDB
          localField: "memberId",
          foreignField: "_id",
          as: "member"
        }
      },
      // 🔗 Join Book
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book"
        }
      },
      // Convert array → object
      {
        $unwind: "$member"
      },
      {
        $unwind: "$book"
      },
      // 🎯 Final Output Shape
      {
        $project: {
          _id: 1,
          transactionId: "$_id",
          memberName: "$member.name",
          bookTitle: "$book.title",
          issueDate: 1,
          dueDate: 1,
          returnDate: 1,
          status: 1,
          fineAmount: 1
        }
      }
    ]);
    if (transactions.length === 0) {
      res.send([])
      return notFoundInDatabase(res, "Transaction");
    }
    res.send(transactions);
  } catch (error) {
    return InternalServerError(error, res);
  }
}


async function historyByMember(req, res) {
  try {
    const { memberId } = req.params;
    await connectDB();
    const transactions = await Transaction.find({
      memberId,
      status: "Returned"
    }).populate("bookId");

    const result = transactions.map((t, index) => ({
      id: index + 1,
      title: t.bookId?.title,
      borrowDate: t.issueDate,
      returnDate: t.returnDate,
      status: t.status,
      fine: `$${t.fineAmount}`
    }));

    res.status(200).json(result);

  } catch (error) {
    return InternalServerError(error, res);
  }
}

async function borrowedBooksWithDetails(req, res) {
  try {
    const { memberId } = req.params;
    await connectDB();
    const transactions = await Transaction.find({
      memberId,
      status: { $in: ["Issued", "Overdue"] }
    }).populate("bookId");

    const result = transactions.map((t, index) => ({
      id: index + 1,
      title: t.bookId?.title,
      author: t.bookId?.author,
      borrowDate: t.issueDate,
      dueDate: t.dueDate,
      status: t.status,
      fine: `$${t.fineAmount}`
    }));

    res.status(200).json(result);

  } catch (error) {
    return InternalServerError(error, res);
  }
}

async function getDashboardStats(req, res) {
  try {
    const { memberId } = req.params;

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }
    await connectDB();
    // 1️⃣ Borrowed Books Count
    const borrowed = await Transaction.countDocuments({
      memberId,
      status: "Issued"
    });
    await connectDB();
    // 2️⃣ Nearest Due Date (important)
    const nextDue = await Transaction.findOne({
      memberId,
      status: "Issued"
    }).sort({ dueDate: 1 }); // earliest due
    await connectDB();
    // 3️⃣ Total Fine
    const fineData = await Transaction.aggregate([
      {
        $match: { memberId: new mongoose.Types.ObjectId(memberId) }
      },
      {
        $group: {
          _id: null,
          totalFine: { $sum: "$fineAmount" }
        }
      }
    ]);

    const totalFine = fineData[0]?.totalFine || 0;

    // 4️⃣ Final Response
    res.status(200).json({
      borrowed,
      dueDate: nextDue ? nextDue.dueDate : null,
      fine: `₹${totalFine}`
    });

  } catch (error) {
    return InternalServerError(error, res);
  }
}

async function getIssuedCount(req,res) {
    try {
        await connectDB();
        const Issues = await Transaction.countDocuments({
          status: "Issued"
        });
        // res.status(200).json({
        //     message: "success fully sent data",
        //     books
        // })
        res.status(200).json(Issues);
    } catch (error) {
       return InternalServerError(error,res);
    }
}

async function getTransactionHistory(req, res) {
  try {
    await connectDB();
    const transactions = await Transaction.aggregate([
      {
        $match: { status: { $in: ["Returned", "OverDue"] } } // 🔥 only history
      },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "member"
        }
      },
      {
        $lookup: {
          from: "books",
          localField: "bookId",
          foreignField: "_id",
          as: "book"
        }
      },
      { $unwind: "$member" },
      { $unwind: "$book" },

      {
        $project: {
          memberName: "$member.name",
          stock: "$book.title",
          issueDate: 1,
          returnDate: 1,
          status: 1
        }
      }
    ]);

    res.send(transactions);

  } catch (error) {
    return InternalServerError(error, res);
  }
}

async function renewTransaction(req, res) {
  try {
    const { id } = req.params;
    await connectDB();
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return notFoundInDatabase(res, "Transaction");
    }

    if (transaction.status !== "Issued") {
      return res.status(400).json({
        message: "Only issued books can be renewed"
      });
    }

    // ✅ Extend due date by 7 days
    transaction.dueDate = new Date(
      transaction.dueDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    await connectDB();
    await transaction.save();

    res.status(200).json({
      message: "Book renewed successfully",
      dueDate: transaction.dueDate,
      transaction
    });

  } catch (error) {
    return InternalServerError(error, res);
  }
}

async function returnTransaction(req, res) {
  try {
    const { id } = req.params;
    await connectDB();
    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return notFoundInDatabase(res, "Transaction");
    }

    if (transaction.status !== "Issued") {
      return res.status(400).json({
        message: "Book already returned or invalid"
      });
    }

    const now = new Date();

    transaction.returnDate = now;
    transaction.status = "Returned";

    // ✅ Fine calculation (₹10 per day late)
    if (now > transaction.dueDate) {
      const diffTime = now - transaction.dueDate;
      const daysLate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      transaction.fineAmount = daysLate * 10;
    } else {
      transaction.fineAmount = 0;
    }
    await connectDB();
    await transaction.save();
    await connectDB();
    // ✅ Make the book available again after return
    await Book.findByIdAndUpdate(
      transaction.bookId,
      { $set: { available: true } },
      { new: true }
    );

    // ✅ Update the corresponding borrow request for UI state.
    // If the request is still marked "Approved", mark it "Completed" on return.
    await connectDB();
    await BorrowRequest.findOneAndUpdate(
      {
        memberId: transaction.memberId,
        bookId: transaction.bookId,
        status: "Approved",
      },
      { $set: { status: "Completed" } },
      { new: true }
    );

    res.status(200).json({
      message: "Book returned successfully",
      fine: transaction.fineAmount,
      transaction
    });

  } catch (error) {
    return InternalServerError(error, res);
  }
}

export {
    addTransaction,
    updateTransaction,
    getTransactions,
    getTransactionById,
    deleteTransaction,
    borrowedForOneMember,
    historyByMember,
    borrowedBooksWithDetails,
    getDashboardStats,
    getIssuedCount,
    getTransactionsWithNameTitle,
    getTransactionHistory,
    renewTransaction,
    returnTransaction
}