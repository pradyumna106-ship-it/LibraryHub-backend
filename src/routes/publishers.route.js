import { Router } from "express";
import { addPublisher, deletePublisher, getPublisherById, getPublishers, updatePublisher } from "../controllers/publishers.controller.js";

const router = Router();

router.route('/add').post(addPublisher);
router.route('/update/:id').put(updatePublisher);
router.route('/fetchAll').get(getPublishers);
router.route('/fetchById/:id').get(getPublisherById);
router.route('/deleteById/:id').delete(deletePublisher);
export default router;