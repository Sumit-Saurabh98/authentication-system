"use server";
import {z} from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const login = async (values: z.infer<typeof LoginSchema>) =>{
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            error: "Invalid email or password",
        };
    }
    
    const {email, password} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error: "invalid credentials!"}
    }

    const passwordsMatch = await bcrypt.compare(password, existingUser.password);

    if(!passwordsMatch){
        return {error: "invalid credentials!"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        return {
            success: "Please check your email to verify your account!",
        }

    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if(error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":
                    return {error:"invalid credentials!"}
                default:
                    return {error:"something went wrong!"}    
            }
        }

        throw error
    }
}