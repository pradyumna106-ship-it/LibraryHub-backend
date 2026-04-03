import { Router } from "express";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../utils/notification.controller.js";

const router = Router();

router.get("/fetchAll", getNotifications);
router.put("/markAsRead/:id", markNotificationAsRead);
router.put("/markAllAsRead", markAllNotificationsAsRead);

export default router;
