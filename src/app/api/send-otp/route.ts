import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Configure the Brevo SMTP transporter using the provided credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER || 'b5fb03001@smtp-brevo.com',
        pass: process.env.SMTP_PASSWORD || '',
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: '"Aerosky Support" <b5fb03001@smtp-brevo.com>', // sender address
      to: email, // list of receivers
      subject: 'Your Aerosky Registration OTP', // Subject line
      text: `Your OTP for Aerosky Registration is: ${otp}. Please enter this code to continue.`, // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #002e5f; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Aerosky Registration</h1>
          </div>
          <div style="padding: 30px; background-color: #f9f9f9;">
            <p style="font-size: 16px; color: #333;">Hello,</p>
            <p style="font-size: 16px; color: #333;">Thank you for registering with Aerosky. Your One-Time Password (OTP) to complete the first step of your registration is:</p>
            <div style="margin: 30px 0; text-align: center;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #002e5f; background-color: #fff; padding: 10px 20px; border: 1px dashed #ccc; border-radius: 4px;">${otp}</span>
            </div>
            <p style="font-size: 14px; color: #666;">This OTP is valid for the current session. Please do not share this code with anyone.</p>
          </div>
          <div style="background-color: #eeeeee; padding: 15px; text-align: center; font-size: 12px; color: #888;">
            &copy; ${new Date().getFullYear()} Aerosky. All rights reserved.
          </div>
        </div>
      `, // html body
    });

    console.log('Message sent: %s', info.messageId);

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error('Error sending OTP email:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP email', details: error.message },
      { status: 500 }
    );
  }
}
