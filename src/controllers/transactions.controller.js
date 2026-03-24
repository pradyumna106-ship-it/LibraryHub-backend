import { validateAllFields } from "../utils/validate.js"
import { InternalServerError, notFoundInDatabase } from "../utils/response.js";
import { Transaction } from "../models/transactions.model.js";

async function addTransaction(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
        if (!isValid) {
                return res.status(400).json(missingField(missingFields));
        }
        const transaction = await Transaction.create(req.body)
        res.status(201).json({
            message:"Member Added Successfully", transaction
        })
    } catch (error) {
        InternalServerError(error)
    }
}

async function updateTransaction(req,res) {
    try {
    const { isValid, missingFields } = validateAllFields(req.body);
        if (!isValid) {
            return res.status(400).json(missingField(missingFields));
        }
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
            const transactions = await Transaction.find({});
            if (!transactions) return notFoundInDatabase(res, "Transaction");
            res.send(books);
        } catch (error) {
           return InternalServerError(error,res);
        }
}

async function getTransactionById(req,res) {
        try {
            const transaction = await Transaction.findById(req.params.id);
            if (!transaction) return notFoundInDatabase(res, "Transaction");
            res.send(transaction);
        } catch (error) {
            return InternalServerError(error,res);
        }
}

async function deleteTransaction(req,res) {
        try {
            const transaction = await Transaction.findByIdAndDelete(req.params.id);
            if (!transaction) return notFoundInDatabase(res, "Transaction");
            res.send(transaction);
        } catch (error) {
            return InternalServerError(error,res);
        }
}

async function borrowedForOneMember(req, res) {
  try {
    const { memberId } = req.params; // or req.body / req.query, depending on your API design
    if (!memberId) {
      return res.status(400).json({ error: "memberId is required" });
    }
    const borrowedCount = await Transaction.countDocuments({
      memberId,
      status: "Issued",
    });
    // You don’t need to check `transaction` here unless you also fetch a specific transaction
    // If you’re only counting, just send the count:
    res.status(200).json({ borrowedCount });
  } catch (error) {
    return InternalServerError(error, res);
  }
}


async function borrowedForAll(req,res) {
    try {
        const totalBorrowed = await Transaction.countDocuments({
        status: "Issued"
        });
        res.status(200).json({ totalBorrowed });
    } catch (error) {
        return InternalServerError(error,res);
    }
}

async function activeLoansOnePerson(req,res) {
    try {
        const { memberId } = req.params; // or req.body / req.query, depending on your API design
        if (!memberId) {
            return res.status(400).json({ error: "memberId is required" });
        }
        const activeLoans = await Transaction.countDocuments({
        memberId: memberId,
        status: { $in: ["Issued", "Overdue"] }
        });
        res.status(200).json({ activeLoans });
    } catch (error) {
        return InternalServerError(error)
    }
}

async function borrowedBooksWithDetails(req,res) {
    try {
        const { memberId } = req.params; // or req.body / req.query, depending on your API design
    if (!memberId) {
      return res.status(400).json({ error: "memberId is required" });
    }
        const books = await Transaction.find({
            memberId: memberId,
            status: "Issued"
            })
            .populate("bookId");
        res.status(200).json({books});
    } catch (error) {
        return InternalServerError(error);
    }
}
export {
    addTransaction,
    updateTransaction,
    getTransactions,
    getTransactionById,
    deleteTransaction,
    borrowedForOneMember,
    borrowedForAll,
    activeLoansOnePerson,
    borrowedBooksWithDetails
}