
const mongoose = require("mongoose");
const Notification = require("../models/Notification");
const Scheme = require("../models/Scheme");
const User = require("../models/User");

// ======================================================
// MAP SCHEME CATEGORY TO VALID NOTIFICATION TYPE
// ======================================================
const mapNotificationType = (category = "") => {
  const value = String(category).trim().toLowerCase();

  if (value.includes("scholarship") || value.includes("education")) {
    return "Scholarship";
  }

  if (value.includes("internship")) {
    return "Internship";
  }

  if (value.includes("skill") || value.includes("training")) {
    return "Skill";
  }

  if (
    value.includes("banking") ||
    value.includes("financial") ||
    value.includes("insurance") ||
    value.includes("loan")
  ) {
    return "Loan";
  }

  if (value.includes("pension")) {
    return "Pension";
  }

  if (
    value.includes("health") ||
    value.includes("medical")
  ) {
    return "Healthcare";
  }

  if (
    value.includes("agriculture") ||
    value.includes("farmer") ||
    value.includes("farming")
  ) {
    return "Agriculture";
  }

  if (value.includes("women")) {
    return "Women";
  }

  if (
    value.includes("job") ||
    value.includes("employment") ||
    value.includes("career")
  ) {
    return "Jobs";
  }

  return "Scheme";
};

// ======================================================
// ADD NOTIFICATION
// ======================================================
const addNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      link,
      isActive,
      user,
      priority,
      actionType,
      scheme,
      expiresAt,
      isRead,
    } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required",
      });
    }

    const notification = await Notification.create({
      title: title.trim(),
      message: message.trim(),
      type: type || "Other",
      link: link || "",
      user: user || null,
      priority: priority || "Normal",
      actionType: actionType || "General",
      scheme: scheme || null,
      expiresAt: expiresAt || null,
      isRead: typeof isRead === "boolean" ? isRead : false,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });

    return res.status(201).json({
      success: true,
      notification,
    });
  } catch (error) {
    console.error("ADD NOTIFICATION ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to add notification",
    });
  }
};

// ======================================================
// GET ACTIVE NOTIFICATIONS + UNREAD COUNT
// ======================================================
const getNotifications = async (req, res) => {
  try {
    const now = new Date();

    const notifications = await Notification.find({
      isActive: true,
      $or: [
        { user: null },
        { user: req.user._id },
      ],
      $and: [
        {
          $or: [
            { expiresAt: null },
            { expiresAt: { $gt: now } },
          ],
        },
      ],
    }).lean();

    const priorityOrder = {
      Urgent: 4,
      High: 3,
      Normal: 2,
      Low: 1,
    };

    notifications.sort((a, b) => {
      const priorityDifference =
        (priorityOrder[b.priority] || 0) -
        (priorityOrder[a.priority] || 0);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const unreadCount = notifications.filter(
      (notification) => !notification.isRead
    ).length;

    return res.status(200).json({
      success: true,
      notifications,
      totalCount: notifications.length,
      unreadCount,
    });
  } catch (error) {
    console.error("GET NOTIFICATIONS ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get notifications",
    });
  }
};

// ======================================================
// MARK NOTIFICATION AS READ
// ======================================================
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOne({
      _id: id,
      isActive: true,
      $or: [
        { user: req.user._id },
        { user: null },
      ],
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (!notification.isRead) {
      notification.isRead = true;
      await notification.save();
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error(
      "MARK NOTIFICATION AS READ ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// ======================================================
// GENERATE PROACTIVE NOTIFICATIONS
// ======================================================
const generateProactiveNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const schemes = await Scheme.find({
      isActive: { $ne: false },
    });

    const createdNotifications = [];
    const now = new Date();

    const userAge = Number(user.age || 0);
    const userGender = String(user.gender || "").trim().toLowerCase();
    const userOccupation = String(user.occupation || "").trim().toLowerCase();
    const userState = String(user.state || "").trim().toLowerCase();
    const userIncome = Number(user.income || 0);

    const hasLand =
      user.hasLandOwnership === true ||
      user.landOwnership === true;

    for (const scheme of schemes) {
      const schemeOccupation = String(scheme.occupation || "")
        .trim()
        .toLowerCase();

      const schemeGender = String(scheme.gender || "")
        .trim()
        .toLowerCase();

      const schemeState = String(scheme.state || "")
        .trim()
        .toLowerCase();

      const minimumAge = Number(scheme.minimumAge || 0);
      const maximumAge = Number(scheme.maximumAge || 100);
      const maximumIncome = Number(scheme.maximumIncome || 99999999);

      let isEligible = true;

      // Occupation
      if (
        schemeOccupation &&
        schemeOccupation !== "all" &&
        schemeOccupation !== userOccupation
      ) {
        isEligible = false;
      }

      // Gender
      if (
        schemeGender &&
        schemeGender !== "all" &&
        schemeGender !== userGender
      ) {
        isEligible = false;
      }

      // Age
      if (userAge < minimumAge || userAge > maximumAge) {
        isEligible = false;
      }

      // Income
      if (userIncome > maximumIncome) {
        isEligible = false;
      }

      // State
      if (
        schemeState &&
        schemeState !== "all" &&
        userState &&
        schemeState !== userState
      ) {
        isEligible = false;
      }

      // Land ownership
      if (
        scheme.requiresLandOwnership === true &&
        !hasLand
      ) {
        isEligible = false;
      }

      if (!isEligible) {
        continue;
      }

      // Map category to a valid Notification model enum value.
      const notificationType = mapNotificationType(scheme.category);

      // --------------------------------------------------
      // 1. DEADLINE NOTIFICATION
      // --------------------------------------------------
      if (scheme.deadline) {
        const deadline = new Date(scheme.deadline);

        if (!Number.isNaN(deadline.getTime())) {
          const differenceInMs =
            deadline.getTime() - now.getTime();

          const daysRemaining = Math.ceil(
            differenceInMs / (1000 * 60 * 60 * 24)
          );

          if (daysRemaining >= 0 && daysRemaining <= 30) {
            const existing = await Notification.findOne({
              user: userId,
              scheme: scheme._id,
              actionType: "Deadline",
              isActive: true,
            });

            const notificationData = {
              title: "Scheme Deadline Approaching",
              message: `${scheme.schemeName} deadline is in ${daysRemaining} day(s).`,
              type: notificationType,
              user: userId,
              priority: daysRemaining <= 7 ? "Urgent" : "High",
              actionType: "Deadline",
              scheme: scheme._id,
              link: `/schemes/${scheme._id}`,
              expiresAt: deadline,
              isActive: true,
            };

            if (existing) {
              existing.title = notificationData.title;
              existing.message = notificationData.message;
              existing.type = notificationData.type;
              existing.priority = notificationData.priority;
              existing.expiresAt = deadline;

              await existing.save();
            } else {
              const notification = await Notification.create({
                ...notificationData,
                isRead: false,
              });

              createdNotifications.push(notification);
            }
          } else {
            await Notification.updateMany(
              {
                user: userId,
                scheme: scheme._id,
                actionType: "Deadline",
                isActive: true,
              },
              { $set: { isActive: false } }
            );
          }
        }
      } else {
        await Notification.updateMany(
          {
            user: userId,
            scheme: scheme._id,
            actionType: "Deadline",
            isActive: true,
          },
          { $set: { isActive: false } }
        );
      }

      // --------------------------------------------------
      // 2. RECENTLY UPDATED SCHEME
      // --------------------------------------------------
      if (scheme.updatedAt) {
        const updatedAt = new Date(scheme.updatedAt);

        const differenceInDays = Math.floor(
          (now.getTime() - updatedAt.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        if (differenceInDays >= 0 && differenceInDays <= 7) {
          const existing = await Notification.findOne({
            user: userId,
            scheme: scheme._id,
            actionType: "SchemeUpdated",
            isActive: true,
          });

          if (!existing) {
            const notification = await Notification.create({
              title: "Scheme Information Updated",
              message: `${scheme.schemeName} has been recently updated.`,
              type: notificationType,
              user: userId,
              priority: "Normal",
              actionType: "SchemeUpdated",
              scheme: scheme._id,
              link: `/schemes/${scheme._id}`,
              isRead: false,
              isActive: true,
            });

            createdNotifications.push(notification);
          }
        }
      }

      // --------------------------------------------------
      // 3. GOVERNMENT SERVICE
      // --------------------------------------------------
      if (scheme.serviceUrl) {
        const existing = await Notification.findOne({
          user: userId,
          scheme: scheme._id,
          actionType: "GovernmentService",
          isActive: true,
        });

        if (!existing) {
          const notification = await Notification.create({
            title: "Government Service Available",
            message: `${scheme.serviceName || "A government service"} is available for ${scheme.schemeName}.`,
            type: notificationType,
            user: userId,
            priority: "Normal",
            actionType: "GovernmentService",
            scheme: scheme._id,
            link: `/schemes/${scheme._id}`,
            isRead: false,
            isActive: true,
          });

          createdNotifications.push(notification);
        }
      }
    }

    return res.status(200).json({
      success: true,
      count: createdNotifications.length,
      notifications: createdNotifications,
    });
  } catch (error) {
    console.error(
      "GENERATE PROACTIVE NOTIFICATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to generate proactive notifications",
    });
  }
};

// ======================================================
// DELETE NOTIFICATION
// ======================================================
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await Notification.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NOTIFICATION ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================
module.exports = {
  addNotification,
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  generateProactiveNotifications,
};
