"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import SignIn from "./sign-in";
import SignUp from "./sign-up";

const AuthPage = () => {
  return (
    <Tabs defaultValue="account">
      <TabsList className="w-full">
        <TabsTrigger value="sign-in" className="w-full">
          Sign-in
        </TabsTrigger>
        <TabsTrigger value="sign-up" className="w-full">
          Sign-up
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sign-in">
        <SignIn />
      </TabsContent>
      <TabsContent value="sign-up">
        <SignUp />
      </TabsContent>
    </Tabs>
  );
};

export default AuthPage;
