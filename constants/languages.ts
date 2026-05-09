export type LocaleCode = "en" | "id" | "ar"; 

export interface Language {
  code: LocaleCode;
  name: string;
  icon: string;
}

export const LANGUAGES: readonly Language[] = [
  {
    code: "en",
    name: "English",
    icon: "/icons/united-kingdom.png",
  },
  {
    code: "id",
    name: "Indonesia",
    icon: "/icons/indonesia.png",
  },
  {
    code: "ar",
    name: "العربية",
    icon: "/icons/arab.png",
  },
];
