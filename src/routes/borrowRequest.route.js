import { Router } from "express";
import { addBorrowRequest, deleteBorrowRequest, getBorrowRequestById, getBorrowRequests, updateBorrowRequest, updateRequestStatus } from "../controllers/borrowRequest.controller";

const router = Router();
router.route('/add').post(addBorrowRequest);
router.route('/update/:id').put(updateBorrowRequest);
router.route('/fetchAll').get(getBorrowRequests);
router.route('/fetchById/:id').get(getBorrowRequestById);
router.route('/deleteById/:id').delete(deleteBorrowRequest);
router.route('/updateRequestStatus/:id').put(updateRequestStatus);

export default router;