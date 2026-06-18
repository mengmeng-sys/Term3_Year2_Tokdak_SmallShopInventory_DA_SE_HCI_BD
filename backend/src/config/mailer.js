const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Templates for email sending
const emailTemplates = {
    forgot_password: (data) => ({
        subject: 'TOKDAK Password Reset Code',
        html: `
        <div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:40px;">
            <div style="max-width:600px; margin:auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                <div style="background:#FF6B00; padding:25px; text-align:center;">
                    <h1 style="color:white; margin:0;">TOKDAK</h1>
                    <p style="color:#FFE7D1; margin-top:8px;">Password Reset Request</p>
                </div>
                <div style="padding:35px;">
                    <h2 style="color:#333;">Reset Your Password</h2>
                    <p style="color:#666; line-height:1.6;">
                        We received a request to reset your password. Use the verification code below:
                    </p>
                    <div style="text-align:center; margin:30px 0;">
                        <span style="
                            display:inline-block;
                            background:#FFF3EB;
                            color:#FF6B00;
                            font-size:32px;
                            font-weight:bold;
                            letter-spacing:8px;
                            padding:18px 30px;
                            border-radius:12px;
                        ">
                            ${data?.otp || '000000'}
                        </span>
                    </div>
                    <p style="color:#666;">
                        This code will expire in <b>10 minutes</b>.
                    </p>
                    <p style="color:#999; font-size:14px;">
                        If you did not request this password reset, you can safely ignore this email.
                    </p>
                </div>
                <div style="background:#fafafa; padding:20px; text-align:center; color:#888; font-size:12px;">
                    © TOKDAK Inventory System
                </div>
            </div>
        </div>
        `
    }),

    registration: (data) => ({
        subject: 'Welcome to TOKDAK!',
        html: `
        <div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:40px;">
            <div style="max-width:600px; margin:auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                <div style="background:#FF6B00; padding:25px; text-align:center;">
                    <h1 style="color:white; margin:0;">TOKDAK</h1>
                    <p style="color:#FFE7D1; margin-top:8px;">Welcome to the Platform</p>
                </div>
                <div style="padding:35px;">
                    <h2 style="color:#333;">Hello ${data?.name || 'User'}! 👋</h2>
                    <p style="color:#666; line-height:1.6;">
                        Your shop account has been created successfully.
                    </p>
                    <div style="
                        background:#FFF8F3;
                        border-left:4px solid #FF6B00;
                        padding:20px;
                        border-radius:8px;
                        margin:25px 0;
                    ">
                        <p><b>Shop Name:</b> ${data?.shop_name || 'N/A'}</p>
                        <p><b>Email:</b> ${data?.email || 'N/A'}</p>
                        <p><b>Temporary Password:</b> ${data?.password || 'N/A'}</p>
                    </div>
                    <div style="
                        background:#FFF3EB;
                        color:#FF6B00;
                        padding:15px;
                        border-radius:10px;
                        font-weight:bold;
                    ">
                        🔒 Please change your password after your first login.
                    </div>
                    <p style="color:#666; margin-top:25px;">
                        Thank you for choosing TOKDAK to manage your inventory and stock operations.
                    </p>
                </div>
                <div style="background:#fafafa; padding:20px; text-align:center; color:#888; font-size:12px;">
                    © TOKDAK Inventory System
                </div>
            </div>
        </div>
        `
    }),

    password_changed: (data) => ({
        subject: 'TOKDAK Password Changed',
        html: `
        <div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:40px;">
            <div style="max-width:600px; margin:auto; background:white; border-radius:16px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                <div style="background:#FF6B00; padding:25px; text-align:center;">
                    <h1 style="color:white; margin:0;">TOKDAK</h1>
                    <p style="color:#FFE7D1; margin-top:8px;">Security Notification</p>
                </div>
                <div style="padding:35px;">
                    <h2 style="color:#333;">Password Updated Successfully</h2>
                    <p style="color:#666; line-height:1.6;">
                        Hi <b>${data?.name || 'User'}</b>,
                    </p>
                    <p style="color:#666; line-height:1.6;">
                        Your password was changed successfully.
                    </p>
                    <div style="
                        background:#EAFBF1;
                        color:#22A06B;
                        padding:18px;
                        border-radius:10px;
                        margin:25px 0;
                        font-weight:bold;
                    ">
                        ✅ Your account security has been updated.
                    </div>
                    <p style="color:#666;">
                        If you did not perform this action, please contact support immediately and reset your password.
                    </p>
                </div>
                <div style="background:#fafafa; padding:20px; text-align:center; color:#888; font-size:12px;">
                    © TOKDAK Inventory System
                </div>
            </div>
        </div>
        `
    })
};

// Send email helper
const sendEmail = async (toEmail, type, data) => {
    const template = emailTemplates[type];
    if (!template) {
        throw new Error(`Unknown email type: ${type}`);
    }

    const { subject, html } = template(data);

    try {
        await transporter.sendMail({
            from: `"TOKDAK" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject,
            html
        });
    } catch (error) {
        console.error(`Failed to send email of type ${type} to ${toEmail}:`, error);
        throw error; // Rethrowing error so calling controller can catch it
    }
};
module.exports = { sendEmail };