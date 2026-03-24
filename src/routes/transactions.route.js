import { Router } from "express";
import { activeLoansOnePerson, addTransaction, borrowedBooksWithDetails, borrowedForAll, borrowedForOneMember, deleteTransaction, getTransactionById, getTransactions, updateTransaction } from "../controllers/transactions.controller.js";

const router = Router();


router.route('/add').post(addTransaction);
router.route('/update/:id').put(updateTransaction);
router.route('/fetchAll').get(getTransactions);
router.route('/fetchById/:id').get(getTransactionById);
router.route('/deleteById/:id').delete(deleteTransaction);
router.route('/borrowByMemberId/:memberId').get(borrowedForOneMember);
router.route('/borrowAll').get(borrowedForAll);
router.route('/activeLoansByMemberId/:memberId').get(activeLoansOnePerson);
router.route('/borrowDetailsByMemberId/:memberId').get(borrowedBooksWithDetails);
export default router;