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
  key: 'default',
  phone: '+971 56 570 8076',
  email: 'info@ibill.ae',
  address:
    'Compass Building, Al Shohada Road, Al Hamra Industrial Zone-FZ, RAK, UAE',
  mapQuery:
    'Compass Building, Al Hamra Industrial Zone, Ras Al Khaimah, UAE',
  companyBlurb:
    'IBILL Software and Consultancy, your trusted partner in accounts consultancy and software development. We empower businesses in India and the GCC region with innovative solutions and expert guidance.',
  workHours: ['Mon - Fri: 7AM - 5PM', 'Saturday: 9AM - 3PM'],
  facebook: 'https://www.facebook.com/ibillsoftware/',
  instagram: 'https://www.instagram.com/i_bill_software/',
  twitter: '',
  youtube: '',
  // The live site shows 0 on every counter - kept as-is for the client to set.
  statExperienceYears: 0,
  statProjectsDone: 0,
  statHappyClients: 0,
};
