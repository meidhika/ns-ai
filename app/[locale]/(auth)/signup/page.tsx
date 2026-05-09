import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import SignUpForm from "@/components/auth/SignUpForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("signUpTitle"),
    description: "Create a new NS AI account.",
  };
}

export default function SignUpPage() {
  return <SignUpForm />;
}
