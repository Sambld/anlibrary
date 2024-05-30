import SignUp from "@/components/auth/sign-up";
import { validateRequest } from "@/lib/auth/lucia";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const SignUpPage = async () => {
  const { user } = await validateRequest();
  if (user) {
    redirect("/");
  }
  return (
    <div className="p-10 ">
      <h1 className="text-3xl font-bold">Sign Up</h1>
      <div className="w-[600px]">
        <SignUp />
        <p className="mt-5">
          Already have an account?{" "}
          <Link className="underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
