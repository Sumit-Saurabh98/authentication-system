"use server";
import {z} from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
export const register = async (values: z.infer<typeof RegisterSchema>) =>{
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid email or password",
        };
    }

    const {email, password, name} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return {
            success: false,
            message: "User already exists",
        };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        }
    });

    if(!user){
        return {
            success: false,
            message: "Something went wrong",
        };
    }

    //TODO: send verification email

    return {
        success: true,
        message: "Account created successfully",
    };
}