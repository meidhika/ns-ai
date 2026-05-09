"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignInForm() {
  const t = useTranslations("Auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login dengan:", email, password);
  };

  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <Card className="w-full sm:w-xl shadow-2xl shadow-primary/5 border-border/60 bg-background/80 backdrop-blur-xl">
      <CardHeader className="space-y-3 text-center pb-6 pt-8">
        <div className="flex justify-center mb-2">
          <Image
            src="/icons/ns-ai-logo.png"
            alt="NS AI Logo"
            width={56}
            height={56}
            className="rounded-2xl shadow-md shadow-primary/20"
          />
        </div>
        <CardTitle className="text-3xl font-bold tracking-tight">
          {t("signInTitle")}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          {t("signInDesc")}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="email" className="font-semibold text-foreground/80">
              {t("emailLabel")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl h-12 bg-muted/50 border-border focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="font-semibold text-foreground/80"
              >
                {t("passwordLabel")}
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
              >
                {t("forgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl h-12 bg-muted/50 border-border focus-visible:ring-primary"
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-xl h-12 text-base font-semibold mt-2 transition-transform active:scale-[0.98]"
          >
            {t("signInButton")}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-3 text-muted-foreground font-semibold tracking-wider">
              {t("orContinueWith")}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={loginWithGoogle}
          className="w-full rounded-xl h-12 font-semibold hover:bg-muted/50 border-border transition-colors flex items-center justify-center gap-3"
        >
          {/* Ikon Google SVG Resmi */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-5 h-5"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google
        </Button>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-border/60 py-6 bg-muted/10 rounded-b-xl">
        <p className="text-sm text-muted-foreground font-medium">
          {t("noAccount")}{" "}
          <Link
            href="/signup"
            className="text-primary font-bold hover:text-primary/80 hover:underline transition-colors"
          >
            {t("signUpLink")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
