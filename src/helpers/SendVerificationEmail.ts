import resend  from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { cp } from "fs";

export async function sendVerificationEmail(
    email: string,
    userName: string,
    verifyCode: string
):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystry message |Verification Code',
            react: VerificationEmail({userName,verificationLink:verifyCode})
        });
       return{success:true,message:"verification email sent successfully"} 
    } catch (emailError) {
       console.error("Error sending verification email:", emailError);
       return{success:false, message:"Failed to send verification email."};
        
    }
}
