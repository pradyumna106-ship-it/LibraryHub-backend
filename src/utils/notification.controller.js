import { Notification } from "../models/notification.model.js";
import { InternalServerError } from "./response.js";

export const createNotification = async (data) => {
    try {
        return await Notification.create(data);
    } catch (error) {
        // Notification failures should not block core flows.
        console.error("Notification create failed:", error.message);
        return null;
    }
};

export const getNotifications = async (req, res) => {
    try {
        const { role, userId } = req.query;

        if (!role) {
            return res.status(400).json({
                message: "role is required"
            });
        }

        const query = { role };

        // Admin: show global admin notifications + personal ones
        if (role === "Admin") {
            if (userId) {
                query.$or = [{ userId: null }, { userId }];
            } else {
                query.userId = null;
            }
        }

        // Member: show only member-specific notifications
        if (role === "Member") {
            if (!userId) {
                return res.status(400).json({
                    message: "userId is required for Member role"
                });
            }
            query.userId = userId;
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        return res.status(200).json(notifications);
    } catch (error) {
        return InternalServerError(error, res);
    }
};

export const markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(
            id,
            { $set: { read: true } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        return res.status(200).json(notification);
    } catch (error) {
        return InternalServerError(error, res);
    }
};

export const markAllNotificationsAsRead = async (req, res) => {
    try {
        const { role, userId } = req.body;
        if (!role) {
            return res.status(400).json({ message: "role is required" });
        }

        const query = { role };
        if (role === "Admin") {
            query.$or = userId ? [{ userId: null }, { userId }] : [{ userId: null }];
        } else {
            if (!userId) {
                return res.status(400).json({ message: "userId is required for Member role" });
            }
            query.userId = userId;
        }

        await Notification.updateMany(query, { $set: { read: true } });
        return res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        return InternalServerError(error, res);
    }
};
