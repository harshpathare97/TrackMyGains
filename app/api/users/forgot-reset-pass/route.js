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
            html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
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