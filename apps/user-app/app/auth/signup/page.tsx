"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Component() {
  const router = useRouter();
  const info = useSession();
  const email = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const out = await signIn("credentials", {
      email: email.current!.value,
      password: password.current!.value,
      redirect: false,
    });
    if (!out?.ok) {
      router.push("/");
    }
  };
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8 grid place-items-center h-screen">
      <div>
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Sign up for your account
          </h1>
          <p className="text-stone-500 dark:text-stone-400">
            Get started with our secure payment application today.
          </p>
          <p
            className="text-stone-500 dark:text-stone-400"
            onClick={() => signOut()}
          >
            {JSON.stringify(info)}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email </Label>
              <Input
                ref={email}
                id="email"
                type="email"
                placeholder="Enter your email ID"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                ref={password}
                id="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign up
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-300 dark:border-stone-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-stone-500 dark:bg-stone-950 dark:text-stone-400">
                Or sign up with
              </span>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              <GithubIcon className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button variant="outline" onClick={() => signIn("google")}>
              <ChromeIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
          <div className="text-center text-sm text-stone-500 dark:text-stone-400">
            Already have an account?{" "}
            <Link
              href="#"
              className="font-medium underline underline-offset-4"
              prefetch={false}
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChromeIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}

function GithubIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
