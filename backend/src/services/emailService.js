const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Email template for team registration - Matches frontend dark theme
const getRegistrationEmailTemplate = (memberName, teamName, collegeName, memberRole) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation - Invento</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #09090b;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #09090b; padding: 40px 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(to bottom, #1e1b4b 0%, #09090b 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(139, 92, 246, 0.2); box-shadow: 0 20px 60px rgba(109, 40, 217, 0.3);">
                    
                    <!-- Header with Grid Background -->
                    <tr>
                        <td style="position: relative; background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 50%, rgba(236, 72, 153, 0.1) 100%); padding: 50px 30px; text-align: center; border-bottom: 1px solid rgba(139, 92, 246, 0.2);">
                            <!-- Logo with Gamepad Icon -->
                            <div style="margin-bottom: 20px;">
                                <div style="display: inline-block; width: 60px; height: 60px; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); border-radius: 12px; padding: 12px; box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);">
                                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="6" y1="12" x2="10" y2="12"></line>
                                        <line x1="8" y1="10" x2="8" y2="14"></line>
                                        <line x1="15" y1="13" x2="15.01" y2="13"></line>
                                        <line x1="18" y1="11" x2="18.01" y2="11"></line>
                                        <rect x="2" y="6" width="20" height="12" rx="2"></rect>
                                    </svg>
                                </div>
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 900; letter-spacing: -0.02em;">INVENTO</h1>
                            <div style="margin: 12px auto 0; display: inline-block; padding: 8px 16px; background: rgba(139, 92, 246, 0.2); border: 1px solid rgba(139, 92, 246, 0.3); border-radius: 20px;">
                                <p style="margin: 0; background: linear-gradient(to right, #a78bfa, #c084fc, #e879f9); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 14px; font-weight: 600;">THE ULTIMATE GAME SHOWCASE</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Success Badge with Animation Effect -->
                    <tr>
                        <td style="padding: 40px 30px 20px; text-align: center;">
                            <div style="position: relative; display: inline-block;">
                                <div style="width: 100px; height: 100px; margin: 0 auto; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 0 0 20px rgba(16, 185, 129, 0.1), 0 0 0 40px rgba(16, 185, 129, 0.05);">
                                    <span style="color: white; font-size: 60px; line-height: 100px; font-weight: bold;">✓</span>
                                </div>
                            </div>
                            <h2 style="color: #ffffff; font-size: 32px; margin: 24px 0 8px 0; font-weight: 800;">You're In! 🎉</h2>
                            <p style="color: #a78bfa; font-size: 16px; margin: 0; font-weight: 500;">Registration Confirmed</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px 30px 40px;">
                            <p style="color: #e5e7eb; font-size: 16px; line-height: 26px; margin: 0 0 24px 0;">
                                Hey <strong style="color: #ffffff; background: linear-gradient(to right, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${memberName}</strong> 👋
                            </p>
                            
                            <p style="color: #d1d5db; font-size: 16px; line-height: 26px; margin: 0 0 28px 0;">
                                Welcome to <strong style="color: #ffffff;">INVENTO 2026</strong>! You've successfully joined as the <strong style="color: #a78bfa;">${memberRole}</strong> of <strong style="color: #ffffff;">"${teamName}"</strong>. Get ready to showcase your game and compete with the best! 🎮
                            </p>
                            
                            <!-- Team Details Card with Glass Effect -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(139, 92, 246, 0.05); border: 1px solid rgba(139, 92, 246, 0.2); border-radius: 12px; margin: 24px 0; backdrop-filter: blur(10px);">
                                <tr>
                                    <td style="padding: 28px;">
                                        <h3 style="margin: 0 0 20px 0; color: #ffffff; font-size: 18px; font-weight: 700; display: flex; align-items: center;">
                                            <span style="display: inline-block; width: 32px; height: 32px; background: linear-gradient(135deg, #8b5cf6, #ec4899); border-radius: 8px; margin-right: 12px; text-align: center; line-height: 32px;">🏆</span>
                                            Team Details
                                        </h3>
                                        <table width="100%" cellpadding="8" cellspacing="0">
                                            <tr>
                                                <td style="color: #9ca3af; font-size: 14px; padding: 8px 0; width: 120px;">Team Name</td>
                                                <td style="color: #ffffff; font-size: 14px; font-weight: 600; padding: 8px 0;">${teamName}</td>
                                            </tr>
                                            ${collegeName ? `<tr>
                                                <td style="color: #9ca3af; font-size: 14px; padding: 8px 0;">College</td>
                                                <td style="color: #ffffff; font-size: 14px; font-weight: 600; padding: 8px 0;">${collegeName}</td>
                                            </tr>` : ''}
                                            <tr>
                                                <td style="color: #9ca3af; font-size: 14px; padding: 8px 0;">Your Role</td>
                                                <td style="padding: 8px 0;">
                                                    <span style="display: inline-block; padding: 4px 12px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 6px; color: #ffffff; font-size: 13px; font-weight: 600;">${memberRole}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- What's Next Section -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1)); border-radius: 12px; border: 1px solid rgba(59, 130, 246, 0.2); margin: 24px 0;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <h4 style="margin: 0 0 12px 0; color: #60a5fa; font-size: 16px; font-weight: 700;">🚀 What's Next?</h4>
                                        <p style="margin: 0; color: #d1d5db; font-size: 14px; line-height: 22px;">
                                            Event details, schedule, and guidelines will be shared soon. Start preparing your game and stay tuned for updates!
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Important Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(251, 191, 36, 0.1); border-left: 4px solid #fbbf24; border-radius: 8px; margin: 24px 0;">
                                <tr>
                                    <td style="padding: 16px 20px;">
                                        <p style="margin: 0; color: #fde68a; font-size: 14px; line-height: 22px;">
                                            <strong style="color: #fbbf24;">⚡ Pro Tip:</strong> Save this email! You might need it for event check-in and verification.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #9ca3af; font-size: 14px; line-height: 22px; margin: 28px 0 0 0; text-align: center;">
                                Questions? Reach out to us anytime. We're here to help! 💬
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: rgba(139, 92, 246, 0.05); padding: 32px; text-align: center; border-top: 1px solid rgba(139, 92, 246, 0.2);">
                            <p style="margin: 0 0 8px 0; color: #d1d5db; font-size: 14px;">
                                Best of luck,<br>
                                <strong style="background: linear-gradient(to right, #8b5cf6, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-size: 16px;">Team Invento</strong>
                            </p>
                            <div style="margin: 20px 0; height: 1px; background: linear-gradient(to right, transparent, rgba(139, 92, 246, 0.3), transparent);"></div>
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                This is an automated confirmation. Please do not reply.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer Note -->
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 24px 20px; text-align: center;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                © 2026 Invento. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
};

// Send registration email to a team member
const sendRegistrationEmail = async (memberEmail, memberName, teamName, collegeName, memberRole) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: memberEmail,
      subject: `Registration Confirmed - Welcome to Invento! 🎉`,
      html: getRegistrationEmailTemplate(memberName, teamName, collegeName, memberRole)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${memberEmail}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending email to ${memberEmail}:`, error);
    return { success: false, error: error.message };
  }
};

// Send emails to all team members
const sendTeamRegistrationEmails = async (team) => {
  try {
    const emailPromises = [];
    const results = [];

    // Send to leader
    emailPromises.push(
      sendRegistrationEmail(
        team.leader.email,
        team.leader.name,
        team.team_name,
        team.college_name,
        'Team Leader'
      ).then(result => {
        results.push({ email: team.leader.email, role: 'Leader', ...result });
      })
    );

    // Send to other members
    ['member2', 'member3', 'member4', 'member5'].forEach((memberKey, index) => {
      if (team[memberKey] && team[memberKey].email) {
        emailPromises.push(
          sendRegistrationEmail(
            team[memberKey].email,
            team[memberKey].name,
            team.team_name,
            team.college_name,
            `Team Member ${index + 2}`
          ).then(result => {
            results.push({ email: team[memberKey].email, role: `Member ${index + 2}`, ...result });
          })
        );
      }
    });

    await Promise.all(emailPromises);
    
    return {
      success: true,
      results,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    };
  } catch (error) {
    console.error('Error sending team emails:', error);
    throw error;
  }
};

module.exports = {
  sendTeamRegistrationEmails,
  sendRegistrationEmail
};
