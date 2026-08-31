import { SITE } from "@/lib/site";

export interface SiteSettingsSeed {
  key: string;
  phone: string;
  email: string;
  address: string;
  mapQuery: string;
  companyBlurb: string;
  workHours: string[];
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  statExperienceYears: number;
  statProjectsDone: number;
  statHappyClients: number;
}

export const SITE_SETTINGS: SiteSettingsSeed = {
  key: "default",
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
  // The live site shows 0 on every counter - kept as-is for the client to set.
  statExperienceYears: 0,
  statProjectsDone: 0,
  statHappyClients: 0,
};
