import { Router } from "express";
import { addAdmin, deleteAdmin, getAdminByEmail, getAdminById, getAdmins, loginAdmin, updateAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.route('/add').post(addAdmin);
router.route('/update/:id').put(updateAdmin);
router.route('/fetchAll').get(getAdmins);
router.route('/fetchById/:id').get(getAdminById);
router.route('/fetchByEmail/:email').get(getAdminByEmail)
router.route('/deleteById/:id').delete(deleteAdmin);
router.route('/login').post(loginAdmin);
export default router;