"use server";
import {z} from "zod";
import { RegisterSchema } from "@/schemas";

export const register = async (values: z.infer<typeof RegisterSchema>) =>{
    const validatedFields = RegisterSchema.safeParse(values);
    if (!validatedFields.success) {
        return {
            success: false,
            message: "Invalid email or password",
        };
    }
    return {
        success: true,
        message: "Login successful",
    };
}