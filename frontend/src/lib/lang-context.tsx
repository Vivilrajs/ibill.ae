import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DIR, withLocale, type Locale } from "./i18n";

interface LangValue {
  lang: Locale;
  dir: "ltr" | "rtl";
  localePath: (to: string) => string;
}

const LangContext = createContext<LangValue>({
  lang: "en",
  dir: "ltr",
  localePath: (to) => to,
});

export function LangProvider({
  lang,
  children,
}: {
  lang: Locale;
  children: ReactNode;
}) {
  const value = useMemo<LangValue>(
    () => ({
      lang,
      dir: DIR[lang],
      localePath: (to: string) => withLocale(to, lang),
    }),
    [lang],
  );
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangValue {
  return useContext(LangContext);
}
