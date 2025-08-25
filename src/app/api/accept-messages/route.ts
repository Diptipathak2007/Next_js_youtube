import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { get } from "http";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      isAcceptingMessage: acceptMessages,
    });
    if (!updatedUser) {
      return Response.json(
        {
          message: "message acceptance status not found",
          success: false,
        },
        { status: 404 }
      );
    } else {
      return Response.json(
        {
          message: "Message acceptance status updated successfully",
          success: true,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("Failed to update user status to accept messages");
    return Response.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !session.user) {
    return Response.json(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return Response.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        message: "User found",
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get user status to accept messages");
    return Response.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
