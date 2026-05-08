import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import ChatLayout from "@/components/chat/ChatLayout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function Home() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <ChatLayout />
    </main>
  );
}
