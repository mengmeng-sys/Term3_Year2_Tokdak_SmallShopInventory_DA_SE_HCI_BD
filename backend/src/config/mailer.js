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

// there are tamplates for email sending
const emailTemplates = {
    forgot_password: (data) => ({
        subject: 'TOKDAK Password Reset Code',
        html: `
            <h2>Password Reset Request</h2>
            <p>Your OTP code is:</p>
            <h1 style="color:#FF6B00;">${data.otp}</h1>
            <p>This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        `
    }),

    registration: (data) => ({
        subject: 'Welcome to TOKDAK!',
        html: `
            <h2>Welcome to TOKDAK, ${data.name}!</h2>
            <p>Your shop account <b>${data.shop_name}</b> has been created successfully.</p>
            <p>Here are your login details:</p>
            <p><b>Email:</b> ${data.email}</p>
            <p><b>Temporary Password:</b> ${data.password}</p>
            <p style="color:#FF6B00;"><b>Please change your password after logging in for the first time.</b></p>
        `
    }),

    password_changed: (data) => ({
        subject: 'TOKDAK Password Changed',
        html: `
            <h2>Password Changed Successfully</h2>
            <p>Hi ${data.name}, your password was just changed.</p>
            <p>If you did not make this change, please contact support immediately.</p>
        `
    })
};
//sent email
const sendEmail = async (toEmail, type, data) => {
    const template = emailTemplates[type];
    if (!template) {
        throw new Error(`Unknown email type: ${type}`);
    }

    const { subject, html } = template(data);

    await transporter.sendMail({
        from: `"TOKDAK" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject,
        html
    });
};

module.exports = { sendEmail };