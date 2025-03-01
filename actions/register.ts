"use server";
import {z} from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
export const register = async (values: z.infer<typeof RegisterSchema>) =>{
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid email or password",
        };
    }

    const {email, password, name} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return {
            error: "User already exists",
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
            error: "Something went wrong",
        };
    }

    //TODO: send verification email

    const verificationToken = await generateVerificationToken(email);
    
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return {
        success: "Check your email to verify your account",
    };
}