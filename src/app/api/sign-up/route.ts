import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/SendVerificationEmail";

export async function POST(request: Request) {
  try {
    // Connect to database
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');

    // Parse request body
    console.log('Parsing request body...');
    const { username, email, password } = await request.json();
    console.log('Request parsed successfully');

    // Validate required fields
    if (!username || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "All fields are required",
        },
        {
          status: 400,
        }
      );
    }

    // Check for existing verified user by username
    console.log('Checking existing user by username...');
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

    // Check for existing user by email
    console.log('Checking existing user by email...');
    const existingUserByEmail = await UserModel.findOne({
      email,
    });

    const verifyCode = Math.random().toString(36).substring(2, 15);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exists with this email",
          },
          {
            status: 400,
          }
        );
      } else {
        // Update existing unverified user
        console.log('Updating existing unverified user...');
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();

        // Send verification email
        console.log('Sending verification email...');
        const emailResponse = await sendVerificationEmail(
          email,
          username,
          verifyCode
        );

        if (!emailResponse.success) {
          return Response.json(
            {
              success: false,
              message: emailResponse.message,
            },
            {
              status: 500,
            }
          );
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
    } else {
      // Create new user
      console.log('Creating new user...');
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: []
      });

      await newUser.save();
      console.log('New user saved to database');

      // Send verification email
      console.log('Sending verification email...');
      const emailResponse = await sendVerificationEmail(
        email,
        username,
        verifyCode
      );

      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          {
            status: 500,
          }
        );
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
    console.error("Error in sign-up API:", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      {
        status: 500,
      }
    );
  }
}