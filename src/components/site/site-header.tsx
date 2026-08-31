"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/site";
import { Logo } from "@/components/site/logo";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const OVER_HERO_ROUTES = ["/"];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const overHero = OVER_HERO_ROUTES.includes(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !overHero;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        solid
          ? "border-b border-border bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-2 lg:h-20">
        <Logo variant={solid ? "default" : "inverted"} />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            if (!("children" in link) || !link.children) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                    solid
                      ? active
                        ? "text-brand-600"
                        : "text-foreground/80 hover:text-brand-600"
                      : "text-white/85 hover:text-white",
                  )}
                >
                  {link.label}
                </Link>
              );
            }
            return (
              <div key={link.href} className="group relative">
                <Link
                  href={link.href}
                  className={cn(
                    "inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                    solid
                      ? active
                        ? "text-brand-600"
                        : "text-foreground/80 hover:text-brand-600"
                      : "text-white/85 hover:text-white",
                  )}
                >
                  {link.label}
                  <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" />
                </Link>
                <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="w-64 rounded-xl border border-border bg-popover p-2 shadow-float">
                    {link.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-brand-50 hover:text-brand-700"
                      >
                        {c.label}
                        <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle
            variant={solid ? "default" : "inverted"}
            className="hidden sm:inline-flex"
          />
          <Button
            asChild
            className="hidden bg-gradient-brand text-white shadow-soft hover:opacity-95 lg:inline-flex"
          >
            <Link href="/contact">Get a Consultation</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("lg:hidden", !solid && "text-white hover:bg-white/10")}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm p-0">
              <SheetHeader className="border-b border-border px-5">
                <SheetTitle className="text-left">
                  <Logo href={null} />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 overflow-y-auto p-4">
                {NAV_LINKS.map((link) =>
                  "children" in link && link.children ? (
                    <Accordion key={link.href} type="single" collapsible>
                      <AccordionItem value={link.href} className="border-none">
                        <AccordionTrigger className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary hover:no-underline">
                          {link.label}
                        </AccordionTrigger>
                        <AccordionContent className="pb-1 pl-3">
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-brand-600"
                          >
                            All {link.label}
                          </Link>
                          {link.children.map((c) => (
                            <Link
                              key={c.href}
                              href={c.href}
                              onClick={() => setOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-brand-600"
                            >
                              {c.label}
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                    >
                      {link.label}
                    </Link>
                  ),
                )}
                <div className="mt-3 flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
                <Button
                  asChild
                  className="mt-2 bg-gradient-brand text-white"
                  onClick={() => setOpen(false)}
                >
                  <Link href="/contact">Get a Consultation</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
