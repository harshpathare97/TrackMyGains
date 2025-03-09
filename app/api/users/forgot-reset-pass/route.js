import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from "../../../../models/User";
import connectToMongoDB from '../../../../lib/mongodb';

export async function POST(req) {
    const { email } = await req.json();
    try {
        await connectToMongoDB();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });// Token expires in 1 hour

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Password Reset Request',
            html: `<html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .email-container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 250px;
                        margin: 0 auto;
                    }
                    h2 {
                        color: #333333;
                        text-align: center;
                    }
                    p {
                        font-size: 16px;
                        color: #555555;
                        line-height: 1.5;
                        text-align: center;
                    }
                    .reset-link-container {
                        text-align: center; /* This will center the p tag */
                    }
                    a {
                        display: inline-block;
                        background-color: #4CAF50;
                        color: #ffffff;
                        padding: 12px 20px;
                        font-size: 16px;
                        text-decoration: none;
                        text-align: center;
                        border-radius: 4px;
                        margin-top: 15px;
                    }
                    a:hover {
                        background-color: #45a049;
                    }
                    .footer {
                        font-size: 12px;
                        text-align: center;
                        color: #999999;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password.</p>
                    <p> Click the link below to reset it.</p>
                    <div class="reset-link-container">
                        <a href="${resetLink}">Reset Password</a>
                    </div>
                    <p class="footer">If you did not request a password reset, please ignore this email.</p>
                </div>
            </body>
        </html>`,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true, message: 'Password reset link sent' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
    }
}

export async function PUT(req) {
    const { token, password } = await req.json();
    try {
      await connectToMongoDB();
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);
  
      await User.findByIdAndUpdate(decoded.id, { password: secPass });
  
      return NextResponse.json({ success: true, message: 'Password successfully updated' });
    } catch (error) {
      console.error('Error failed to update password:', error.message);
      return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 500 });
    }
  }