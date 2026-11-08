
require("dotenv").config();

const {
  sendAccountDeletionEmail,
} = require("./utils/emailService");

async function testEmail() {
  try {
    const testEmailAddress = process.env.SMTP_USER;

    if (!testEmailAddress) {
      throw new Error("SMTP_USER is missing from backend .env");
    }

    await sendAccountDeletionEmail({
      name: "SARVASETU Test Citizen",
      email: testEmailAddress,
      message:
        "This is a TEST email from SARVASETU. No citizen account has been deleted.",
      noticeUrl: "http://localhost:5173/account-deletion-notice/TEST-ONLY",
    });

    console.log("✅ SMTP TEST PASSED");
    console.log("Check the inbox for:", testEmailAddress);
    console.log("No user account was deleted.");
  } catch (error) {
    console.error("❌ SMTP TEST FAILED");
    console.error(error.message);
  }
}

testEmail();
