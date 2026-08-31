import mongoose, { Schema, model, models, type Model } from "mongoose";

const opts = { timestamps: true } as const;

/* ---------------------------------- Service --------------------------------- */
export interface IService {
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
  createdAt: Date;
  updatedAt: Date;
}
const ServiceSchema = new Schema<IService>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    longDescription: { type: String, default: "" },
    category: { type: String, enum: ["accounting", "it"], required: true },
    icon: { type: String, default: "Sparkles" },
    image: { type: String, default: "" },
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
  features: string[];
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    externalUrl: { type: String, default: "" },
    icon: { type: String, default: "Sparkles" },
    image: { type: String, default: "" },
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
const PostSchema = new Schema<IPost>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    author: { type: String, default: "IBILL" },
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
const TeamMemberSchema = new Schema<ITeamMember>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    photo: { type: String, default: "" },
    bio: { type: String, default: "" },
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
const TestimonialSchema = new Schema<ITestimonial>(
  {
    quote: { type: String, required: true },
    authorName: { type: String, required: true, trim: true },
    authorTitle: { type: String, default: "" },
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
const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    answer: { type: String, default: "" },
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
const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    address: { type: String, default: "" },
    mapQuery: { type: String, default: "" },
    companyBlurb: { type: String, default: "" },
    workHours: { type: [String], default: [] },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    youtube: { type: String, default: "" },
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
const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    message: { type: String, default: "" },
    source: { type: String, default: "contact" },
    handled: { type: Boolean, default: false },
  },
  opts,
);

function reg<T>(name: string, schema: Schema<T>): Model<T> {
  return (models[name] as Model<T>) || model<T>(name, schema);
}

export const Service = reg<IService>("Service", ServiceSchema);
export const Product = reg<IProduct>("Product", ProductSchema);
export const Post = reg<IPost>("Post", PostSchema);
export const TeamMember = reg<ITeamMember>("TeamMember", TeamMemberSchema);
export const Testimonial = reg<ITestimonial>("Testimonial", TestimonialSchema);
export const Faq = reg<IFaq>("Faq", FaqSchema);
export const SiteSettings = reg<ISiteSettings>("SiteSettings", SiteSettingsSchema);
export const Lead = reg<ILead>("Lead", LeadSchema);

export { mongoose };
