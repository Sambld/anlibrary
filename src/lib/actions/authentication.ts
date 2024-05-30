"use server";

import z from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { signInFormSchema, signUpFormSchema } from "../form-schema";
import { createHash } from "crypto";
import { lucia } from "../auth/lucia";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateRequest } from "../auth/lucia";
export const signIn = async (formdata: z.infer<typeof signInFormSchema>) => {
  const parsed = signInFormSchema.safeParse(formdata);
  if (!parsed.success) {
    return {
      message: "Invalid form data",
      error: parsed.error.issues.map((issue) => issue.message),
    };
  }
  const { username, password } = parsed.data;
  const passwordHash = createHash("sha256").update(password).digest("hex");
  let results = await db
    .select()
    .from(users)
    .where(and(eq(users.username, username), eq(users.password, passwordHash)))
    .execute();
  if (results.length === 0) {
    return {
      message: "Invalid username or password",
    };
  }
  const user = results[0];
  const session = await lucia.createSession(user.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  redirect("/");
};

export const signUp = async (formdata: z.infer<typeof signUpFormSchema>) => {
  const parsed = signUpFormSchema.safeParse(formdata);
  if (!parsed.success) {
    return {
      message: "Invalid form data",
      error: parsed.error.issues.map((issue) => issue.message),
    };
  }
  const { username, password, confirmPassword } = parsed.data;

  if (password !== confirmPassword) {
    return {
      message: "Passwords do not match",
    };
  }

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.username, username));
  if (existingUser.length > 0) {
    return {
      message: "User already exists",
    };
  }

  const passwordHash = createHash("sha256").update(password).digest("hex");
  const user = db
    .insert(users)
    .values({
      username,
      password: passwordHash,
    })
    .returning({ id: users.id });

  const session = await lucia.createSession(user.get().id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  redirect("/");
};

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect("/");
}
