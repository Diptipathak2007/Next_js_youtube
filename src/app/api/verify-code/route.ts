import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        {
          status: 404,
        }
      );
    }
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          message: "User verified successfully",
          success: true,
        },
        {
          status: 200,
        }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          message: "Verification code has expired,please signup again to get a new code",
          success: false,
        },
        {
          status: 400,
        }
      );
    }else{
        return Response.json(
            {
            message: "Invalid verification code",
            success: false,
            },
            {
            status: 400,
            }
        );
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return Response.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}
