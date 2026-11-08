
const crypto = require("crypto");
const AccountDeletionNotice = require("../models/AccountDeletionNotice");

const getAccountDeletionNotice = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token || !/^[a-f0-9]{64}$/i.test(token)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notice link.",
      });
    }

    const noticeTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const notice = await AccountDeletionNotice.findOne({
      noticeTokenHash,
      expiresAt: { $gt: new Date() },
    }).select("+noticeTokenHash");

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "This notice link is invalid or has expired.",
      });
    }

    if (!notice.viewedAt) {
      notice.viewedAt = new Date();
      await notice.save();
    }

    return res.json({
      success: true,
      notice: {
        name: notice.name,
        email: notice.email,
        message: notice.message,
        createdAt: notice.createdAt,
        expiresAt: notice.expiresAt,
      },
    });
  } catch (error) {
    console.error("ACCOUNT DELETION NOTICE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve the account notice.",
    });
  }
};

module.exports = { getAccountDeletionNotice };
