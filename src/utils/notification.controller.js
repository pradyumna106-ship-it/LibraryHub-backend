import { Notification } from "../models/notification.model.js";
import { InternalServerError } from "./response.js";

export async function createNotification({ userId, role, type, title, message }) {
  try {
    await Notification.create({
      userId,
      role,
      type,
      title,
      message
    });
  } catch (error) {
    console.error("Notification Error:", error);
  }
}

