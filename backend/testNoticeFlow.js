
require("dotenv").config();

const crypto = require("crypto");
const mongoose = require("mongoose");

const AccountDeletionNotice = require("./models/AccountDeletionNotice");
const {
  sendAccountDeletionEmail,
} = require("./utils/emailService");

async function testNoticeFlow() {
  let createdNoticeId = null;

  try {
    // Use the same local database as config/db.js.
    await mongoose.connect("mongodb://127.0.0.1:27017/sarvasetu");
    console.log("✅ Connected to SARVASETU MongoDB");

    const email = process.env.SMTP_USER;
    const frontendUrl = process.env.FRONTEND_URL;

    if (!email) {
      throw new Error("SMTP_USER is missing from backend .env");
    }

    if (!frontendUrl) {
      throw new Error("FRONTEND_URL is missing from backend .env");
    }

    // Generate a secure, random token. Store only its hash.
    const token = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1);

    const name = "SARVASETU Test Citizen";

    const message =
      "This is a TEST account-deletion notice. " +
      "No citizen account has been deleted.";

    const notice = await AccountDeletionNotice.create({
      userId: new mongoose.Types.ObjectId(),
      name,
      email,
      message,
      noticeTokenHash: tokenHash,
      expiresAt,
    });

    createdNoticeId = notice._id;

    const noticeUrl =
      `${frontendUrl.replace(/\/+$/, "")}` +
      `/account-deletion-notice/${token}`;

    // Send the email with the real test notice link.
    await sendAccountDeletionEmail({
      name,
      email,
      message,
      noticeUrl,
    });

    console.log("✅ TEST NOTICE CREATED AND EMAIL SENT");
    console.log("Notice ID:", notice._id.toString());
    console.log("Recipient:", email);
    console.log("Check your inbox and spam folder.");
    console.log("No citizen account was deleted.");
  } catch (error) {
    console.error("❌ NOTICE TEST FAILED:", error.message);

    // Remove the test record if the test did not complete.
    if (createdNoticeId) {
      try {
        await AccountDeletionNotice.findByIdAndDelete(
          createdNoticeId
        );
        console.log("ℹ️ Temporary test notice removed.");
      } catch (cleanupError) {
        console.error(
          "⚠️ Could not remove test notice:",
          cleanupError.message
        );
      }
    }
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log("MongoDB connection closed.");
    }
  }
}

testNoticeFlow();
