"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Image from "next/image";
import { MailCheck, RefreshCcw } from "lucide-react";

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
import { Eye, EyeOff } from "lucide-react";

export default function SignUpForm() {
  const t = useTranslations("Auth");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State UX & Validasi
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // State untuk Fitur Aktivasi Email
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 1. Efek untuk menghitung mundur (1 menit 30 detik = 90 detik)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // 2. Format waktu menjadi MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 3. Efek Polling: Cek apakah user sudah klik link di email
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSuccess) {
      // Cek setiap 3 detik
      interval = setInterval(async () => {
        try {
          // Anda harus membuat endpoint ini nanti (Langkah 3)
          const res = await fetch(`/api/auth/check-status?email=${email}`);
          if (res.ok) {
            const data = await res.json();
            if (data.isVerified) {
              clearInterval(interval);
              router.push("/signin?verified=true"); // Pindah otomatis!
            }
          }
        } catch (e) {
          console.error("Gagal mengecek status", e);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isSuccess, email, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan");
      }

      // Berhasil Register! Ganti UI dan mulai timer 90 detik
      setIsSuccess(true);
      setCountdown(90);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Terjadi kesalahan tak terduga");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setIsLoading(true);
    try {
      // Panggil API untuk resend (Anda buat nanti)
      await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      // Reset timer kembali ke 90 detik
      setCountdown(90);
    } catch (error) {
      console.error("Gagal resend email", error);
    } finally {
      setIsLoading(false);
    }
  };

  // === UI JIKA BERHASIL REGISTER (Menunggu Aktivasi) ===
  if (isSuccess) {
    return (
      <Card className="w-full sm:w-[450px] shadow-2xl shadow-primary/5 border-border/60 bg-background/80 backdrop-blur-xl text-center py-8">
        <CardContent className="space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-2 animate-pulse">
            <MailCheck size={40} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Cek Email Anda
            </h2>
            <p className="text-muted-foreground text-sm px-4">
              Kami telah mengirimkan tautan aktivasi ke <br />
              <strong className="text-foreground">{email}</strong>. <br />
              Klik tautan tersebut untuk mengaktifkan akun Anda.
            </p>
          </div>

          <div className="pt-4 w-full">
            <Button
              variant={countdown > 0 ? "secondary" : "default"}
              disabled={countdown > 0 || isLoading}
              onClick={handleResendEmail}
              className="w-full rounded-xl h-12 font-semibold transition-all gap-2"
            >
              {countdown > 0 ? (
                `Kirim ulang tersedia dalam ${formatTime(countdown)}`
              ) : (
                <>
                  <RefreshCcw size={18} />
                  Kirim Ulang Email Aktivasi
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground animate-pulse">
            Menunggu Anda mengklik tautan aktivasi...
          </p>
        </CardContent>
      </Card>
    );
  }

  // === UI FORM SIGN UP BIASA ===
  return (
    <Card className="w-full sm:w-[450px] shadow-2xl shadow-primary/5 border-border/60 bg-background/80 backdrop-blur-xl">
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
          {t("signUpTitle")}
        </CardTitle>
        <CardDescription className="text-muted-foreground text-base">
          {t("signUpDesc")}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-8 pb-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-destructive/15 border border-destructive/30 rounded-xl text-sm font-medium text-destructive text-center">
              {error}
            </div>
          )}

          <div className="space-y-2.5">
            <Label htmlFor="name" className="font-semibold text-foreground/80">
              {t("nameLabel")}
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              disabled={isLoading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-12 bg-muted/50 border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="email" className="font-semibold text-foreground/80">
              {t("emailLabel")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl h-12 bg-muted/50 border-border focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2.5">
            <Label
              htmlFor="password"
              className="font-semibold text-foreground/80"
            >
              {t("passwordLabel")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl h-12 bg-muted/50 border-border focus-visible:ring-primary pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl h-12 text-base font-semibold mt-2 transition-transform active:scale-[0.98]"
          >
            {isLoading ? "Memproses..." : t("signUpButton")}
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
          onClick={() => signIn("google", { callbackUrl: "/" })}
          disabled={isLoading}
          className="w-full rounded-xl h-12 font-semibold hover:bg-muted/50 border-border transition-colors flex items-center justify-center gap-3"
        >
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
          {t("alreadyHaveAccount")}{" "}
          <Link
            href="/signin"
            className="text-primary font-bold hover:text-primary/80 hover:underline transition-colors"
          >
            {t("signInLink")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
