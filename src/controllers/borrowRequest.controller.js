
import { missingField } from "../exception/exception.js";
import { validateAllFields } from "../utils/validate.js";
import { InternalServerError, notFoundInDatabase } from "../utils/response.js";
import { BorrowRequest } from "../models/borrowRequestSchema.js";
import { Book } from "../models/books.model.js";
import { Transaction } from "../models/transactions.model.js";
import { createNotification } from "../utils/notification.controller.js";
import { connectDB } from "../config/database.js";
async function addBorrowRequest(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
        if (!isValid) {
            return res.status(400).json(missingField(missingFields));
        }   
            await connectDB();
            const request = await BorrowRequest.create(req.body)
            res.status(201).json({
                message:"Member Added Successfully", request
            })
        } catch (error) {
            // 🔥 HANDLE DUPLICATE EMAIL
                if (error.code === 11000) {
                    return res.status(400).json({
                        message: "Duplicate request"
                    });
                }
            return InternalServerError(error,res);
        }
}

async function updateBorrowRequest(req,res) {
    try {
            const { isValid, missingFields } = validateAllFields(req.body);
            if (!isValid) {
                return res.status(400).json(missingField(missingFields));
            }
            await connectDB();
            const request = await BorrowRequest.findByIdAndUpdate(req.params.id,req.body,{new: true})
            if (!request) return notFoundInDatabase(res, "BorrowRequest");
            res.status(200).json({
                message:"Member Updated Successfully", request
            })
        } catch (error) {
            return InternalServerError(error,res);
        }
}

async function getBorrowRequests(req, res) {
    try {
            await connectDB();
            const requests = await BorrowRequest.find({});
            if (!requests) return notFoundInDatabase(res, "BorrowRequest"); 
            res.send(requests);
        } catch (error) {
            return InternalServerError(error,res)
    }
}

async function getBorrowRequestById(req,res) {
    try {
            await connectDB();
            const request = await BorrowRequest.findById(req.params.id);
            if (!request) return notFoundInDatabase(res, "BorrowRequest");
            res.send(request);
        } catch (error) {
            return InternalServerError(error,res)
    }
}

async function getBorrowRequestByMemberId(req,res) {
    try {
            const { memberId } = req.params;
            await connectDB();
            const requests = await BorrowRequest.find({ memberId });
            if (!requests || requests.length === 0) {
                return notFoundInDatabase(res, "BorrowRequest");
            }
            res.send(requests);
        } catch (error) {
            return InternalServerError(error,res)
    }
}

async function deleteBorrowRequest(req,res) {
    try {
            await connectDB();
            const request = await BorrowRequest.findByIdAndDelete(req.params.id);
            if (!request) return notFoundInDatabase(res, "BorrowRequest");
            res.status(200).json({
                message: "Deleted Successfully",
                request
            })
        } catch (error) {
            return InternalServerError(error,res)
        }
}

async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;  // ✅ Pass status in body: { "status": "Approved" }

    // ✅ Validate status enum
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }
    await connectDB();
    // ✅ Find & update request
    const request = await BorrowRequest.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()  // ✅ Track updates
      },
      { new: true, runValidators: true }
    );

    if (!request) {
      return notFoundInDatabase(res, "BorrowRequest");
    }

    // 🔥 Auto-create Transaction for Approved requests
    let transaction = null;
    await connectDB();
    if (status === 'Approved') {
      const book = await Book.findById(request.bookId);

      transaction = await Transaction.create({
        memberId: request.memberId,
        bookId: request.bookId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: "Issued",
        // BorrowRequest status is tracked in BorrowRequest collection.
      });
      await connectDB();
      // ✅ Update book stock
      await Book.findByIdAndUpdate(
        request.bookId,
        { $set: { available: false } },
        { new: true }
      );

      await createNotification({
        userId: request.memberId,
        role: "Member",
        type: "success",
        title: "Book Issued",
        message: `Your request was approved. "${book?.title || "Book"}" has been issued to you.`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
      request,
      transaction  // Only for Approved
    });

  } catch (error) {
    console.error('Update request status error:', error);
    return InternalServerError(error, res);
  }
}
export {
    addBorrowRequest,
    updateBorrowRequest,
    getBorrowRequests,
    getBorrowRequestById,
    deleteBorrowRequest,
    updateRequestStatus,
    getBorrowRequestByMemberId
}