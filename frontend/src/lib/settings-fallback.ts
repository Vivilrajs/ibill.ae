import type { SiteSettings } from "./types";
import { SITE } from "./site";

/** Used until the /api/settings query resolves (and if the API is unreachable). */
export const SITE_SETTINGS_FALLBACK: SiteSettings = {
  phone: SITE.phone,
  email: SITE.email,
  address: SITE.address,
  mapQuery: SITE.mapQuery,
  companyBlurb: SITE.description,
  workHours: [...SITE.workHours],
  facebook: SITE.socials.facebook,
  instagram: SITE.socials.instagram,
  twitter: "",
  youtube: "",
  statExperienceYears: 0,
  statProjectsDone: 0,
  statHappyClients: 0,
};
