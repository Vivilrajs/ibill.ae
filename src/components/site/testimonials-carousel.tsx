"use client";

import { Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export interface TestimonialItem {
  id: string;
  quote: string;
  authorName: string;
  authorTitle: string;
}

export function TestimonialsCarousel({ items }: { items: TestimonialItem[] }) {
  if (!items.length) return null;
  return (
    <Carousel opts={{ loop: true, align: "start" }} className="w-full">
      <CarouselContent>
        {items.map((t) => (
          <CarouselItem key={t.id}>
            <figure className="relative rounded-3xl border border-border bg-card p-8 shadow-soft sm:p-12">
              <Quote
                className="absolute right-8 top-8 size-14 text-brand-100"
                aria-hidden
              />
              <blockquote className="relative max-w-3xl text-lg leading-relaxed text-brand-ink text-pretty sm:text-xl">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-full bg-gradient-brand font-heading text-sm font-bold text-white">
                  {t.authorName
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <span>
                  <span className="block font-semibold text-brand-ink">
                    {t.authorName}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {t.authorTitle}
                  </span>
                </span>
              </figcaption>
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="mt-6 flex justify-end gap-2">
        <CarouselPrevious className="static translate-y-0" />
        <CarouselNext className="static translate-y-0" />
      </div>
    </Carousel>
  );
}
