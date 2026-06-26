import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

// Initialize Firebase Admin SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

/**
 * Configure Nodemailer SMTP transport for sending automated admin notification emails.
 * These credentials should ideally be set in environment variables (e.g. process.env.SMTP_PASSWORD).
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL || "thekingmanns.1@gmail.com",
    pass: process.env.SMTP_PASSWORD || "" // Gmail App Password (generate at myaccount.google.com/apppasswords)
  }
});

/**
 * Cloud Function triggered automatically on creation of a document in the 'waitlist' collection.
 * Triggers an automated notification email sent directly to the BBTY Administrator.
 */
export const onWaitlistSignup = onDocumentCreated("waitlist/{signupId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log("No snapshot data available for the document creation event.");
    return;
  }

  const signupData = snapshot.data();
  const adminEmail = "thekingmanns.1@gmail.com";

  console.log(`[ALERT] Processing waitlist signup notification for: ${signupData.name}`);

  // Construct structured and highly stylized email template
  const mailOptions = {
    from: `"BBTY Waitlist Alerts" <no-reply@bbty.com>`,
    to: adminEmail,
    subject: `🚀 New BBTY Waitlist Registration: ${signupData.name}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #fafafa; color: #1e293b;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;">
          <span style="font-size: 24px;">🌸</span>
          <h2 style="color: #db2777; margin: 6px 0 0 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Beauty Brought To You</h2>
          <p style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 4px 0 0 0; letter-spacing: 1px;">New Registration Alert</p>
        </div>
        
        <p style="font-size: 14px; line-height: 1.6; color: #334155; margin-top: 24px;">
          Hello Admin,
          <br/><br/>
          A new user has successfully registered on the BBTY priority waitlist! Here are the details of the submission:
        </p>
        
        <div style="background-color: #ffffff; border: 1px solid #f1f5f9; border-radius: 12px; padding: 18px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="padding: 10px 0; font-weight: 700; border-bottom: 1px solid #f8fafc; color: #475569; width: 140px; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Full Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f8fafc; color: #0f172a; font-weight: 500;">${signupData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 700; border-bottom: 1px solid #f8fafc; color: #475569; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Email Address</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f8fafc; color: #db2777; font-weight: 600;">${signupData.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 700; border-bottom: 1px solid #f8fafc; color: #475569; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Contact Phone</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f8fafc; color: #0f172a;">${signupData.phone || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 700; border-bottom: 1px solid #f8fafc; color: #475569; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">User Category</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f8fafc; color: #0f172a; text-transform: capitalize; font-weight: 500;">${signupData.category ? signupData.category.replace(/_/g, ' ') : 'Client / Family'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 700; border-bottom: 1px solid #f8fafc; color: #475569; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px;">Service Interests</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f8fafc; color: #0f172a;">${signupData.services && signupData.services.length > 0 ? signupData.services.join(", ") : 'None selected'}</td>
            </tr>
            ${signupData.notes ? `
            <tr>
              <td style="padding: 10px 0; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 11px; letter-spacing: 0.5px; vertical-align: top;">Notes & Accoms</td>
              <td style="padding: 10px 0; color: #475569; font-style: italic;">"${signupData.notes}"</td>
            </tr>
            ` : ''}
          </table>
        </div>
        
        <p style="font-size: 12px; color: #64748b; margin-top: 10px;">
          Registered on: ${new Date(signupData.submittedAt || Date.now()).toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
        </p>
        
        <div style="margin-top: 28px; text-align: center; border-t: 1px solid #e2e8f0; padding-top: 20px;">
          <a href="https://ais-pre-dwky4vzv5q3snqvoqo75lr-263043791171.us-east5.run.app" style="background-color: #db2777; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(219, 39, 119, 0.2);">
            View Admin Console
          </a>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[ALERT-SUCCESS] Automated admin notification email sent successfully for registrant ${signupData.name}`);
  } catch (err) {
    console.error(`[ALERT-ERROR] Failed to send automated admin notification email:`, err);
  }
});
