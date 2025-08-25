import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {success, z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { use } from "react";

const usernameQuerySchema = z.object({
    username: usernameValidation,
})
export async function GET(request:Request){
    
    await dbConnect();
    
    try {
       const{searchParams}=new URL(request.url); 
       const queryParams={
        username:searchParams.get("username")
       }
       //validate with zod
       const result=usernameQuerySchema.safeParse(queryParams);
       console.log(result);//todo: remove
       if(!result.success){
        const usernameError=result.error.format().username?._errors||[];
        return Response.json(
            {
            message:usernameError?.length>0? usernameError.join(", "):"Invalid username",
            success: false
        }, 
            {status: 400}
        );
       }
        const {username}=result.data;
        const existingVerifiedUser=await UserModel.findOne({username,isVerified:true})
        if(existingVerifiedUser){
            return Response.json(
                {
                message: "Username is already taken",
                success: false
            }, 
                {status: 400}
            );
        }
        return Response.json(
            {
            message: "Username is available",
            success: true
        }, 
            {status: 200}
        );

         
    } catch (error) {
        console.error("Error checking username uniqueness:", error);
        return Response.json(
            {
            message: "Internal Server Error",
            success: false
        }, 
            {status: 500}
        );
    }
}