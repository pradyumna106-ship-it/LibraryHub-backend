import { Router } from "express";
import { addBook, deleteBook, getBookById, getBooks, getMyBooks, updateBook } from "../controllers/books.controller.js";
const router = Router();

router.route('/add').post(addBook);
router.route('/update/:id').put(updateBook);
router.route('/fetchAll').get(getBooks);
router.route('/fetchById/:id').get(getBookById);
router.route('/getMyBooks').get(getMyBooks);
router.route('/deleteById/:id').delete(deleteBook);
export default router;