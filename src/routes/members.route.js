import { Router } from "express";
import { addMember, addMyBooks, deleteMember, getMemberByEmail, getMemberById, getMemberCount, getMembers, getMyBooks, loginMember, updateMember } from "../controllers/members.controller.js";
const router = Router();

router.route('/add').post(addMember);
router.route('/update/:id').put(updateMember);
router.route('/fetchAll').get(getMembers);
router.route('/fetchById/:id').get(getMemberById);
router.route('/fetchByEmail/:email').get(getMemberByEmail)
router.route('/deleteById/:id').delete(deleteMember);
router.route('/login').post(loginMember);
router.route('/getMyBooks/:id').get(getMyBooks);
router.route('/addMyBooks/:id').put(addMyBooks);

router.route('/countAll').get(getMemberCount);
export default router;