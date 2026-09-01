import { forwardRef } from "react";
import {
  Link as RouterLink,
  Navigate as RouterNavigate,
  type LinkProps,
  type NavigateProps,
  type To,
} from "react-router-dom";
import { useLang } from "./lang-context";

function localize(to: To, localePath: (t: string) => string): To {
  return typeof to === "string" ? localePath(to) : to;
}

/** Drop-in <Link> that prefixes string targets with the active locale. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, ...rest },
  ref,
) {
  const { localePath } = useLang();
  return <RouterLink ref={ref} to={localize(to, localePath)} {...rest} />;
});

/** Drop-in <Navigate> that prefixes string targets with the active locale. */
export function Navigate({ to, ...rest }: NavigateProps) {
  const { localePath } = useLang();
  return <RouterNavigate to={localize(to, localePath)} {...rest} />;
}
