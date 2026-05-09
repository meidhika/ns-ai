import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import SignInForm from "@/components/auth/SignInForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("signInTitle"), 
    description: "Sign in to your NS AI account.",
  };
}

export default function SignInPage() {
  return <SignInForm />;
}
