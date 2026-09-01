import { Schema } from 'mongoose';

const opts = { timestamps: true } as const;

/* ---------------------------------- Service --------------------------------- */
export interface IService {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: 'accounting' | 'it';
  icon: string;
  image: string;
  features: string[];
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const ServiceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    longDescription: { type: String, default: '' },
    category: { type: String, enum: ['accounting', 'it'], required: true },
    icon: { type: String, default: 'Sparkles' },
    image: { type: String, default: '' },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  opts,
);

/* ---------------------------------- Product --------------------------------- */
export interface IProduct {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  externalUrl: string;
  icon: string;
  image: string;
  heroImage: string;
  gallery: string[];
  features: string[];
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    externalUrl: { type: String, default: '' },
    icon: { type: String, default: 'Sparkles' },
    image: { type: String, default: '' },
    heroImage: { type: String, default: '' },
    gallery: { type: [String], default: [] },
    features: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  opts,
);

/* ----------------------------------- Post ----------------------------------- */
export interface IPost {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string;
  author: string;
  publishedAt: Date;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const PostSchema = new Schema<IPost>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: '' },
    body: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    author: { type: String, default: 'IBILL' },
    publishedAt: { type: Date, default: Date.now },
    published: { type: Boolean, default: false },
  },
  opts,
);

/* -------------------------------- TeamMember -------------------------------- */
export interface ITeamMember {
  name: string;
  role: string;
  photo: string;
  bio: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: '' },
    photo: { type: String, default: '' },
    bio: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  opts,
);

/* ------------------------------- Testimonial ------------------------------- */
export interface ITestimonial {
  quote: string;
  authorName: string;
  authorTitle: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const TestimonialSchema = new Schema<ITestimonial>(
  {
    quote: { type: String, required: true },
    authorName: { type: String, required: true, trim: true },
    authorTitle: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  opts,
);

/* ---------------------------- MaintenancePlan ----------------------------- */
export interface IMaintenancePlan {
  name: string;
  summary: string;
  annualFee: number;
  feeNote: string;
  inclusions: string[];
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const MaintenancePlanSchema = new Schema<IMaintenancePlan>(
  {
    name: { type: String, required: true, trim: true },
    summary: { type: String, default: '' },
    annualFee: { type: Number, default: 0 },
    feeNote: { type: String, default: '' },
    inclusions: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  opts,
);

/* ----------------------------------- Faq ----------------------------------- */
export interface IFaq {
  question: string;
  answer: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, default: '' },
    order: { type: Number, default: 0, index: true },
    published: { type: Boolean, default: true },
  },
  opts,
);

/* ------------------------------- SiteSettings ------------------------------ */
export interface ISiteSettings {
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
  updatedAt: Date;
}
export const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true, default: 'default' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    address: { type: String, default: '' },
    mapQuery: { type: String, default: '' },
    companyBlurb: { type: String, default: '' },
    workHours: { type: [String], default: [] },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    youtube: { type: String, default: '' },
    statExperienceYears: { type: Number, default: 0 },
    statProjectsDone: { type: Number, default: 0 },
    statHappyClients: { type: Number, default: 0 },
  },
  opts,
);

/* ----------------------------------- Lead ---------------------------------- */
export interface ILead {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  handled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    message: { type: String, default: '' },
    source: { type: String, default: 'contact' },
    handled: { type: Boolean, default: false },
  },
  opts,
);

export const MODELS = {
  Service: 'Service',
  Product: 'Product',
  Post: 'Post',
  TeamMember: 'TeamMember',
  Testimonial: 'Testimonial',
  MaintenancePlan: 'MaintenancePlan',
  Faq: 'Faq',
  SiteSettings: 'SiteSettings',
  Lead: 'Lead',
} as const;

export const MONGOOSE_FEATURES = [
  { name: MODELS.Service, schema: ServiceSchema },
  { name: MODELS.Product, schema: ProductSchema },
  { name: MODELS.Post, schema: PostSchema },
  { name: MODELS.TeamMember, schema: TeamMemberSchema },
  { name: MODELS.Testimonial, schema: TestimonialSchema },
  { name: MODELS.MaintenancePlan, schema: MaintenancePlanSchema },
  { name: MODELS.Faq, schema: FaqSchema },
  { name: MODELS.SiteSettings, schema: SiteSettingsSchema },
  { name: MODELS.Lead, schema: LeadSchema },
];
