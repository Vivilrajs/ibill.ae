export interface WithId {
  id: string;
}

export interface Service extends WithId {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: "accounting" | "it";
  icon: string;
  image: string;
  features: string[];
  order: number;
  published: boolean;
}

export interface Product extends WithId {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  externalUrl: string;
  icon: string;
  image: string;
  heroImage?: string;
  gallery?: string[];
  features: string[];
  order: number;
  published: boolean;
}

export interface Post extends WithId {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  published: boolean;
}

export interface TeamMember extends WithId {
  name: string;
  role: string;
  photo: string;
  bio: string;
  order: number;
  published: boolean;
}

export interface Testimonial extends WithId {
  quote: string;
  authorName: string;
  authorTitle: string;
  order: number;
  published: boolean;
}

export interface Faq extends WithId {
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

export interface MaintenancePlan extends WithId {
  name: string;
  summary: string;
  annualFee: number;
  feeNote: string;
  inclusions: string[];
  order: number;
  published: boolean;
}

export interface SiteSettings {
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

export interface Lead extends WithId {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
  handled?: boolean;
  createdAt?: string;
}

export type ResourceKey =
  | "services"
  | "products"
  | "posts"
  | "team"
  | "testimonials"
  | "maintenancePlans"
  | "faqs";
