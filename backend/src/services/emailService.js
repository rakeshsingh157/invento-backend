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

// Email template for team registration
const getRegistrationEmailTemplate = (memberName, teamName, collegeName, memberRole) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Confirmation - Invento</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: bold;">INVENTO</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Innovation & Technology Festival</p>
                        </td>
                    </tr>
                    
                    <!-- Success Icon -->
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <div style="width: 80px; height: 80px; margin: 0 auto; background-color: #4CAF50; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 50px; line-height: 80px;">✓</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <h2 style="color: #333333; font-size: 24px; margin: 0 0 20px 0; text-align: center;">Registration Successful!</h2>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                                Dear <strong>${memberName}</strong>,
                            </p>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                                Congratulations! You have been successfully registered for <strong>Invento</strong> as the <strong>${memberRole}</strong> of team <strong>"${teamName}"</strong>.
                            </p>
                            
                            <!-- Team Details Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="margin: 0 0 15px 0; color: #333333; font-size: 18px;">Team Details</h3>
                                        <p style="margin: 8px 0; color: #666666; font-size: 14px;">
                                            <strong>Team Name:</strong> ${teamName}
                                        </p>
                                        ${collegeName ? `<p style="margin: 8px 0; color: #666666; font-size: 14px;">
                                            <strong>College:</strong> ${collegeName}
                                        </p>` : ''}
                                        <p style="margin: 8px 0; color: #666666; font-size: 14px;">
                                            <strong>Your Role:</strong> ${memberRole}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 20px 0;">
                                Get ready to showcase your innovation and creativity! Further details about the event schedule, rules, and guidelines will be shared with you soon.
                            </p>
                            
                            <!-- Important Notice -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px; margin: 20px 0;">
                                <tr>
                                    <td style="padding: 15px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 20px;">
                                            <strong>📌 Important:</strong> Please keep this email for your records. You may be required to present this confirmation during the event.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 24px; margin: 20px 0 0 0;">
                                If you have any questions or concerns, feel free to reach out to us.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px 0; color: #666666; font-size: 14px;">
                                Best regards,<br>
                                <strong>Team Invento</strong>
                            </p>
                            <p style="margin: 15px 0 0 0; color: #999999; font-size: 12px;">
                                This is an automated email. Please do not reply to this message.
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Footer Note -->
                <table width="600" cellpadding="0" cellspacing="0">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">
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
