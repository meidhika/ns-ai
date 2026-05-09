import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20 flex flex-col relative">
      <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none z-0" />

      <header className="fixed top-0 left-0 w-full p-4 md:p-6 flex items-center justify-end gap-3 z-50">
        <LanguageSwitcher />
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-24 z-10 relative">
        {children}
      </main>
    </div>
  );
}
