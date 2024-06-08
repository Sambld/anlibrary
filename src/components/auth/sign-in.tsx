"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormField,
  FormDescription,
  FormMessage,
  FormRootError,
} from "../ui/form";
import { signInFormSchema } from "@/lib/form-schema";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn, signUp } from "@/lib/actions/authentication";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SignIn = () => {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (data: z.infer<typeof signInFormSchema>) => {
    startTransition(async () => {
      const response = await signIn(data);
      if (response?.message) {
        form.setError("root", { message: response.message });
      }
    });
  };
  return (
    <div className="mt-3">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <>
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormRootError />
          <Button loading={isPending} disabled={isPending} type="submit">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SignIn;
