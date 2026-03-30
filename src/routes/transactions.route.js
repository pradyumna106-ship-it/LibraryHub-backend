import { Router } from "express";
import {  addTransaction, borrowedBooksWithDetails, historyByMember, borrowedForOneMember, deleteTransaction, getTransactionById, getTransactions, updateTransaction, getDashboardStats, getIssuedCount} from "../controllers/transactions.controller.js";


const router = Router();


router.route('/add').post(addTransaction);
router.route('/update/:id').put(updateTransaction);
router.route('/fetchAll').get(getTransactions);
router.route('/fetchById/:id').get(getTransactionById);
router.route('/deleteById/:id').delete(deleteTransaction);
router.route('/borrowByMemberId/:memberId').get(borrowedForOneMember);
router.route('/historyByMemberId/:memberId').get(historyByMember);
router.route('/borrowDetailsByMemberId/:memberId').get(borrowedBooksWithDetails);
router.route('/dashboardStats/:memberId').get(getDashboardStats);
router.route('/countAll').get(getIssuedCount);

export default router;