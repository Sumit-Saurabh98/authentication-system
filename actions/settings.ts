"use server";

import { getUserByEmail, getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { currentUser } from "@/lib/use-user";
import { SettingsSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs"

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if(!user){
        return {
            error: "User not found!"
        }
    }

    const dbUser = await getUserById(user.id as string);

    if(!dbUser){
        return {
            error: "User not found!"
        }
    }

    if(user.isOAuth){
        values.email = undefined
        values.password = undefined
        values.newPassword = undefined
        values.isTwoFactorEnabled = undefined
    }

    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email);

        if(existingUser && existingUser.id !== user.id){
            return {
                error: "Email already in use!"
            }
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return {
            success: "Please check your email to verify your email!"
        }
    }

    if(values.password && values.newPassword && dbUser.password){
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);

        if(!passwordsMatch){
            return {
                error: "Invalid password!"
            }
        }

        values.password = await bcrypt.hash(values.newPassword, 10);

        values.newPassword = undefined
        
    }

    await db.user.update({
        where: {
            id: user.id
        },
        data: {
            ...values,
        }
    })

    return {
        success: "Settings updated!"
    }
}