import type { SVGProps } from "react";

/** lucide-react dropped brand glyphs, so social icons are inlined here. */

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M13.5 21v-8.2h2.8l.42-3.26H13.5V7.46c0-.94.26-1.58 1.6-1.58h1.72V2.96c-.3-.04-1.32-.13-2.5-.13-2.48 0-4.18 1.51-4.18 4.29v2.4H7.33v3.26h2.6V21h3.57Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.47l7.73-8.84L1.05 2.25h6.83l4.71 6.23 5.65-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z" />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M23.5 7.2s-.23-1.65-.94-2.38c-.9-.94-1.9-.95-2.36-1C16.9 3.5 12 3.5 12 3.5h-.01s-4.9 0-8.19.32c-.46.05-1.46.06-2.36 1C.73 5.55.5 7.2.5 7.2S.27 9.14.27 11.07v1.8c0 1.94.23 3.87.23 3.87s.23 1.65.94 2.38c.9.94 2.08.91 2.6 1.01 1.89.18 8.03.24 8.03.24s4.9-.01 8.19-.33c.46-.06 1.46-.06 2.36-1 .71-.73.94-2.38.94-2.38s.23-1.93.23-3.87v-1.8c0-1.93-.23-3.86-.23-3.86ZM9.75 15.02V8.9l6.3 3.07-6.3 3.05Z" />
    </svg>
  );
}
