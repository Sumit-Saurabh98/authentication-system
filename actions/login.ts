"use server";
import { z } from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  if (!validatedFields.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "invalid credentials!" };
  }

  const passwordsMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordsMatch) {
    return { error: "invalid credentials!" };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: "Please check your email to verify your account!",
    };
  }

  // send 2FA if enabled

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // TODO: verify the code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if(!twoFactorToken){
        return {
          error: "Invalid code!",
        };
      }

      if(twoFactorToken.token !== code){
        return {
          error: "Invalid code!",
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) > new Date();

      if(hasExpired){
        return {
          error: "Token has expired!",
        };
      }

      await db.twoFactorToken.delete({
          where:{
            id: twoFactorToken.id
          }
      })

      const existingConfirmationToken = await getTwoFactorConfirmationByUserId(existingUser.id);

      if(existingConfirmationToken){
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmationToken.id
          }
        })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })

    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      return {
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "invalid credentials!" };
        default:
          return { error: "something went wrong!" };
      }
    }

    throw error;
  }
};
