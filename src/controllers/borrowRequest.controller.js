
import { missingField } from "../exception/exception.js";
import { validateAllFields } from "../utils/validate.js";
import { InternalServerError, notFoundInDatabase } from "../utils/response.js";
import { BorrowRequest } from "../models/borrowRequestSchema.js";

async function addBorrowRequest(req,res) {
    try {
        const { isValid, missingFields } = validateAllFields(req.body);
        if (!isValid) {
            return res.status(400).json(missingField(missingFields));
        }
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
            const requests = await BorrowRequest.find({});
            if (!requests) return notFoundInDatabase(res, "BorrowRequest"); 
            res.send(requests);
        } catch (error) {
            return InternalServerError(error,res)
    }
}

async function getBorrowRequestById(req,res) {
    try {
            const request = await BorrowRequest.findById(req.params.id);
            if (!request) return notFoundInDatabase(res, "BorrowRequest");
            res.send(request);
        } catch (error) {
            return InternalServerError(error,res)
    }
}

async function deleteBorrowRequest(req,res) {
    try {
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
    if (status === 'Approved') {
      transaction = await Transaction.create({
        memberId: request.memberId,
        bookId: request.bookId,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        status: "Issued",
        requestId: request._id  // Link back to request
      });

      // ✅ Update book stock
      await Book.findByIdAndUpdate(request.bookId, { 
        $inc: { stock: -1 }  // Reduce available stock
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
    updateRequestStatus
}