import SignIn from "@/components/auth/sign-in";
import Link from "next/link";
import React from "react";

const LoginPage = () => {
  return (
    <div className="p-10">
      <p className="text-3xl">Login</p>

      <div className="mt-5 sm:w-[500px] w-full ">
        <SignIn />
      </div>

      <p className="mt-5 ">
        Don&apos;t have an account?{" "}
        <Link className="underline" href="/sign-up">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
