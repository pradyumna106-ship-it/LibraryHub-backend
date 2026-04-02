import { Router } from "express";
import { upload } from "../middleware/upload.js";
import { addMember, addMyBooks, deleteMember, deleteMyBooks, getMemberByEmail, getMemberById, getMemberCount, getMembers, getMyBooks, loginMember, updateMember } from "../controllers/members.controller.js";
const router = Router();



router.post("/add", upload.single("avatar"), addMember);
router.route('/update/:id').put(updateMember);
router.route('/fetchAll').get(getMembers);
router.route('/fetchById/:id').get(getMemberById);
router.route('/fetchByEmail/:email').get(getMemberByEmail)
router.route('/deleteById/:id').delete(deleteMember);
router.route('/login').post(loginMember);
router.route('/getMyBooks/:id').get(getMyBooks);
router.route('/addMyBooks/:id').put(addMyBooks);
router.route('/deleteMyBooks/:id').put(deleteMyBooks);
router.route('/countAll').get(getMemberCount);
export default router;