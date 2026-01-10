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

// Email template for team registration - Matches pink/yellow Invento 2.0 theme
const getRegistrationEmailTemplate = (memberName, teamName, collegeName, memberRole) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation - Invento 2.0</title>
    <style>
        @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .header-title { font-size: 48px !important; }
            .header-version { font-size: 42px !important; }
            .success-title { font-size: 28px !important; }
            .content-padding { padding: 20px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial Black', 'Arial Bold', Gadget, sans-serif; background: #FF69B4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #FF69B4; padding: 20px;">
        <tr>
            <td align="center">
                <!-- Main Container -->
                <table class="container" width="600" cellpadding="0" cellspacing="0" style="background: #FF69B4; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); border: 5px solid #000000;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px 30px; text-align: left; position: relative;">
                            <!-- THE ULTIMATE SHOWDOWN Badge -->
                            <div style="margin-bottom: 20px;">
                                <span style="display: inline-block; padding: 8px 20px; background: #FFD700; border: 4px solid #000000; border-radius: 25px; color: #000000; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">THE ULTIMATE SHOWDOWN</span>
                            </div>
                            
                            <!-- Invento Logo -->
                            <h1 class="header-title" style="margin: 0; color: #FFFFFF; font-size: 64px; font-weight: 900; letter-spacing: -2px; text-shadow: 4px 4px 0px #000000, -2px -2px 0px #000000;">Invento</h1>
                            <h2 class="header-version" style="margin: 0; color: #FFD700; font-size: 56px; font-weight: 900; letter-spacing: -2px; text-shadow: 3px 3px 0px #000000, -2px -2px 0px #000000;">2.0</h2>
                            
                            <!-- 48 Hours Badge - Top Right -->
                           
                        </td>
                    </tr>
                    
                    <!-- Success Section -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background: rgba(255, 255, 255, 0.15);">
                            <!-- Modern Checkmark -->
                            <svg width="100" height="100" viewBox="0 0 100 100" style="margin-bottom: 20px;">
                                <circle cx="50" cy="50" r="48" fill="#10b981" stroke="#000000" stroke-width="4"/>
                                <path d="M30 50 L45 65 L70 35" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                            </svg>
                            
                            <h2 class="success-title" style="color: #FFFFFF; font-size: 36px; margin: 20px 0 10px 0; font-weight: 900; text-shadow: 3px 3px 0px #000000;">You're In! 🎉</h2>
                            <p style="color: #000000; background: #FFD700; display: inline-block; padding: 8px 24px; border-radius: 20px; font-size: 16px; font-weight: 900; border: 3px solid #000000;">REGISTRATION CONFIRMED</p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td class="content-padding" style="padding: 30px 40px; background: rgba(255, 255, 255, 0.95); border-top: 5px solid #000000;">
                            <p style="color: #000000; font-size: 18px; line-height: 28px; margin: 0 0 20px 0; font-weight: 700;">
                                Hey <span style="color: #FF69B4;">${memberName}</span> 👋
                            </p>
                            
                            <p style="color: #333333; font-size: 16px; line-height: 26px; margin: 0 0 30px 0;">
                                Welcome to <strong style="color: #000000;">INVENTO 2.0</strong>! You've successfully joined as the <strong style="color: #FF69B4;">${memberRole}</strong> of team <strong>"${teamName}"</strong>. Get ready for the ultimate challenge! 🎮
                            </p>
                            
                            <!-- Team Details Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #FFD700; border: 5px solid #000000; border-radius: 15px; margin: 25px 0; box-shadow: 5px 5px 0px #000000;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="margin: 0 0 20px 0; color: #000000; font-size: 20px; font-weight: 900; text-transform: uppercase;">
                                            🏆 Team Details
                                        </h3>
                                        <table width="100%" cellpadding="10" cellspacing="0">
                                            <tr>
                                                <td style="color: #000000; font-size: 14px; font-weight: 700; width: 140px;">Team Name:</td>
                                                <td style="color: #000000; font-size: 14px; font-weight: 900;">${teamName}</td>
                                            </tr>
                                            ${collegeName ? `<tr>
                                                <td style="color: #000000; font-size: 14px; font-weight: 700;">College:</td>
                                                <td style="color: #000000; font-size: 14px; font-weight: 900;">${collegeName}</td>
                                            </tr>` : ''}
                                            <tr>
                                                <td style="color: #000000; font-size: 14px; font-weight: 700;">Your Role:</td>
                                                <td>
                                                    <span style="display: inline-block; padding: 6px 16px; background: #FF69B4; border: 3px solid #000000; border-radius: 8px; color: #FFFFFF; font-size: 13px; font-weight: 900; text-shadow: 1px 1px 0px #000000;">${memberRole}</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Challenge Info Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: rgba(255, 105, 180, 0.2); border: 3px solid #FF69B4; border-radius: 12px; margin: 25px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <p style="margin: 0; color: #000000; font-size: 16px; line-height: 24px; font-weight: 700;">
                                            ☕ <strong>Unlimited coffee, code, and chaos.</strong><br>
                                            </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Important Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background: #FF8C42; border: 4px solid #000000; border-radius: 12px; margin: 25px 0; box-shadow: 4px 4px 0px #000000;">
                                <tr>
                                    <td style="padding: 18px 22px;">
                                        <p style="margin: 0; color: #000000; font-size: 14px; line-height: 22px; font-weight: 700;">
                                            ⚡ <strong>IMPORTANT:</strong> Save this email for event check-in and verification!
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; font-size: 14px; line-height: 22px; margin: 30px 0 0 0; text-align: center; font-weight: 600;">
                                Questions? We're here to help! 💬
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #000000; padding: 30px; text-align: center; border-top: 5px solid #FFD700;">
                            <p style="margin: 0 0 10px 0; color: #FFFFFF; font-size: 16px; font-weight: 900;">
                                Best of luck,<br>
                                <span style="color: #FFD700; font-size: 18px;">Team Invento</span>
                            </p>
                            <div style="margin: 20px 0; height: 2px; background: #FFD700;"></div>
                            <p style="margin: 0; color: #AAAAAA; font-size: 12px; font-weight: 600;">
                                This is an automated confirmation. Please do not reply.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer Note -->
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0; color: #000000; font-size: 12px; font-weight: 900;">
                                © 2026 Invento 2.0. All rights reserved.
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
