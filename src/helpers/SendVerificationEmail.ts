import resend  from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const verificationLink = `${baseUrl}/verify-email?code=${verifyCode}&email=${encodeURIComponent(email)}`;
        
        // ✅ Simple HTML template
        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Email Verification</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Welcome to Mystery Message, ${userName}!</h2>
            
            <p>Thank you for signing up! Please verify your email address to activate your account.</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" 
                   style="background-color: #1a73e8; color: white; padding: 12px 24px; 
                          text-decoration: none; border-radius: 6px; font-weight: bold;
                          display: inline-block;">
                    Verify Email Address
                </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:
                <br>
                <a href="${verificationLink}">${verificationLink}</a>
            </p>
            
            <p style="color: #666; font-size: 14px;">
                This link expires in 10 minutes. If you didn't create an account, please ignore this email.
            </p>
            
            <p>Best regards,<br><strong>The Mystery Message Team</strong></p>
        </body>
        </html>
        `;
        
        const result = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystery Message | Verification Code',
            html: htmlContent
        });
        
        if (result.error) {
            console.error('❌ Resend API error:', result.error);
            return { success: false, message: "Email service error occurred." };
        }
        
        return { success: true, message: "Verification email sent successfully" };
        
    } catch (emailError) {
        console.error("❌ Error sending verification email:", emailError);
        return { success: false, message: "Failed to send verification email." };
    }
}