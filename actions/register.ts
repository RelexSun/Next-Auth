"use server";

import bycrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import * as z from "zod";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/token";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }
  const { email, password, name } = validatedFields.data;
  const hashPassword = await bycrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use" };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  // TODO: Send verification token email

  return { success: "Confirmation email sent!" };
};
