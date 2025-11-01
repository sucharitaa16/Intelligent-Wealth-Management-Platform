// utils/sendEmail.js
import nodemailer from 'nodemailer';

// ✅ CORRECT: createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // For local development
  }
});

// Verify transporter connection on startup
console.log('📧 Initializing email service...');
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Email transporter connection failed:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
    console.log('📨 Using email:', process.env.EMAIL_USER);
  }
});

// Send OTP Email function
export const sendOtpEmail = async (email, otp) => {
  console.log('\n📧 === SENDING OTP EMAIL ===');
  console.log('👤 To:', email);
  console.log('🔑 OTP:', otp);
  console.log('📤 From:', process.env.EMAIL_USER);

  const mailOptions = {
    from: `"FinSmart Pro" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'FinSmart Pro - OTP Verification',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>FinSmart Pro OTP Verification</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #f9fafb;
                  padding: 20px;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background: white;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
              }
              .header {
                  background: linear-gradient(135deg, #2563eb, #1e40af);
                  color: white;
                  padding: 30px 20px;
                  text-align: center;
              }
              .header h1 {
                  font-size: 28px;
                  font-weight: bold;
                  margin-bottom: 8px;
              }
              .header p {
                  opacity: 0.9;
                  font-size: 14px;
              }
              .content {
                  padding: 30px;
              }
              .otp-section {
                  background: #f8fafc;
                  border: 2px dashed #d1d5db;
                  border-radius: 10px;
                  padding: 25px;
                  text-align: center;
                  margin: 25px 0;
              }
              .otp-label {
                  font-size: 16px;
                  color: #6b7280;
                  margin-bottom: 15px;
              }
              .otp-code {
                  font-size: 42px;
                  font-weight: bold;
                  letter-spacing: 12px;
                  color: #2563eb;
                  margin: 15px 0;
                  font-family: 'Courier New', monospace;
              }
              .warning-box {
                  background: #fef2f2;
                  border: 1px solid #fecaca;
                  border-radius: 8px;
                  padding: 20px;
                  margin: 20px 0;
              }
              .warning-title {
                  color: #dc2626;
                  font-weight: bold;
                  margin-bottom: 10px;
                  font-size: 16px;
              }
              .warning-text {
                  color: #b91c1c;
                  font-size: 14px;
                  line-height: 1.5;
              }
              .info-text {
                  color: #6b7280;
                  font-size: 14px;
                  line-height: 1.6;
                  margin: 15px 0;
              }
              .footer {
                  background: #f9fafb;
                  padding: 20px;
                  text-align: center;
                  border-top: 1px solid #e5e7eb;
              }
              .footer-text {
                  color: #9ca3af;
                  font-size: 12px;
                  line-height: 1.4;
              }
              .highlight {
                  background: #fffbeb;
                  border-left: 4px solid #f59e0b;
                  padding: 12px 15px;
                  margin: 15px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <!-- Header -->
              <div class="header">
                  <h1>FinSmart Pro</h1>
                  <p>Enterprise Financial Management Platform</p>
              </div>
              
              <!-- Content -->
              <div class="content">
                  <h2 style="color: #1f2937; margin-bottom: 15px;">Password Reset Verification</h2>
                  
                  <p class="info-text">You requested to reset your password for your FinSmart Pro account. Use the verification code below to complete the process:</p>
                  
                  <!-- OTP Section -->
                  <div class="otp-section">
                      <div class="otp-label">Your Verification Code</div>
                      <div class="otp-code">${otp}</div>
                      <div style="color: #6b7280; font-size: 13px;">Valid for 10 minutes</div>
                  </div>
                  
                  <!-- Security Warning -->
                  <div class="warning-box">
                      <div class="warning-title">🔒 Security Notice</div>
                      <div class="warning-text">
                          <strong>FinSmart Pro OTP: ${otp}</strong><br>
                          This code will expire in 10 minutes. Do not share it with anyone for your security.
                      </div>
                  </div>
                  
                  <!-- Additional Info -->
                  <div class="highlight">
                      <strong>Important:</strong> If you didn't request this password reset, please ignore this email. Your account security is not compromised.
                  </div>
                  
                  <p class="info-text">For security reasons, this OTP will expire in 10 minutes. If you need a new code, you can request another one from the password reset page.</p>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                  <div class="footer-text">
                      <p>© 2025 FinSmart Pro. All rights reserved.</p>
                      <p>This is an automated message. Please do not reply to this email.</p>
                      <p>Enterprise-grade financial intelligence platform</p>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `,
    // Text version for email clients that don't support HTML
    text: `
FinSmart Pro - OTP Verification

You requested to reset your password for your FinSmart Pro account.

Your OTP verification code is: ${otp}

FinSmart Pro OTP: ${otp}
This code will expire in 10 minutes. Do not share it with anyone for your security.

If you didn't request this password reset, please ignore this email.

© 2025 FinSmart Pro. All rights reserved.
This is an automated message. Please do not reply.
    `
  };

  try {
    console.log('🔄 Sending email...');
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ EMAIL SENT SUCCESSFULLY!');
    console.log('📨 Message ID:', info.messageId);
    console.log('👤 Recipient:', email);
    console.log('📋 Response:', info.response);
    
    return true;
  } catch (error) {
    console.error('❌ EMAIL SENDING FAILED!');
    console.error('🔧 Error Code:', error.code);
    console.error('📝 Error Message:', error.message);
    console.error('💬 Response:', error.response);
    
    // Specific error handling
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed - check email credentials');
    } else if (error.code === 'EENVELOPE') {
      console.error('📧 Envelope error - check recipient email');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection error - check internet connection');
    }
    
    return false;
  }
};

// Test function to verify email setup
export const testEmailService = async () => {
  console.log('\n🧪 === TESTING EMAIL SERVICE ===');
  
  const testEmail = process.env.EMAIL_USER; // Send test to yourself
  const testOtp = '123456';
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Missing email credentials in .env file');
    return false;
  }
  
  console.log('📧 Test email:', testEmail);
  console.log('🔑 Test OTP:', testOtp);
  
  const result = await sendOtpEmail(testEmail, testOtp);
  
  if (result) {
    console.log('🎉 EMAIL SERVICE TEST: PASSED');
  } else {
    console.log('💥 EMAIL SERVICE TEST: FAILED');
  }
  
  return result;
};

// Export transporter for other uses if needed
export default transporter;