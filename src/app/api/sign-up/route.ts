import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/SendVerificationEmail";
import { email, success } from "zod";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    const existingUserByEmail = await UserModel.findOne({
      email,
     
    })
    const verifyCode= Math.random().toString(36).substring(2, 15)
    if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return Response.json(
                {
                    success: false,
                    message: "User exits already with this email",
                },
                {
                    status: 400,
                }
            );
        }
        else{
            //update the existing user with new password and verify code
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // Set expiry to 1 hour from now
            await existingUserByEmail.save();
            //send verification email
            const emaiResponse=await sendVerificationEmail(
                email,
                username,
                verifyCode
            )
            if(!emaiResponse.success){
                return Response.json({
                    success: false,
                    message: emaiResponse.message,
                }, {
                    status: 500,
                })
            }
            return Response.json(
                {
                    success: true,
                    message: "User updated successfully. Please verify your email.",
                },
                {
                    status: 200,
                }
            );
        }
    }else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1); // Set expiry to 1 hour from now
        const newUser=new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessages: true,
            messages:[]

        })
        await newUser.save();
        //send verification email
        const emaiResponse=await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if(!emaiResponse.success){
            return Response.json({
                success: false,
                message: emaiResponse.message,
            }, {
                status: 500,
            })
        }
        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email.",
            },
            {
                status: 201,
            }
        );
    }

  } catch (error) {
    console.error("Error registering User");
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
