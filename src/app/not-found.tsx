import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-gradient-brand-deep px-6 text-center text-white">
      <div>
        <p className="font-heading text-6xl font-bold text-brand-300">404</p>
        <h1 className="mt-4 font-heading text-2xl font-semibold">
          Page not found
        </h1>
        <p className="mt-2 text-white/70">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Button asChild className="mt-8 bg-white text-[#1a5493] hover:bg-white/90">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
