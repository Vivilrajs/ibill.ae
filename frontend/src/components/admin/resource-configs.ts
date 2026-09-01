import type { ResourceConfig } from "@/components/admin/resource-manager";

export const SERVICE_CONFIG: ResourceConfig = {
  resource: "services",
  singular: "service",
  columns: ["title", "category", "order", "published"],
  defaults: {
    slug: "",
    title: "",
    shortDescription: "",
    longDescription: "",
    category: "accounting",
    icon: "Sparkles",
    image: "",
    features: [],
    order: 0,
    published: true,
  },
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      help: "URL id - lowercase, hyphens (e.g. tax-planning)",
    },
    { name: "shortDescription", label: "Short description", type: "textarea", required: true },
    { name: "longDescription", label: "Long description", type: "textarea" },
    { name: "category", label: "Category", type: "select", options: ["accounting", "it"] },
    { name: "icon", label: "Icon", type: "icon" },
    { name: "image", label: "Image URL", type: "url" },
    { name: "features", label: "Features", type: "stringList" },
    { name: "order", label: "Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const PRODUCT_CONFIG: ResourceConfig = {
  resource: "products",
  singular: "product",
  columns: ["name", "tagline", "order", "published"],
  defaults: {
    slug: "",
    name: "",
    tagline: "",
    description: "",
    externalUrl: "",
    icon: "Sparkles",
    image: "",
    heroImage: "",
    gallery: [],
    features: [],
    order: 0,
    published: true,
  },
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true, help: "e.g. salon-assist" },
    { name: "tagline", label: "Tagline", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "externalUrl", label: "External URL", type: "url" },
    { name: "icon", label: "Icon", type: "icon" },
    { name: "image", label: "Image URL", type: "url" },
    { name: "heroImage", label: "Hero image URL", type: "url", help: "Large banner image on the product page" },
    { name: "gallery", label: "Screenshot gallery", type: "stringList", help: "One image URL per line" },
    { name: "features", label: "Features", type: "stringList" },
    { name: "order", label: "Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const POST_CONFIG: ResourceConfig = {
  resource: "posts",
  singular: "post",
  columns: ["title", "author", "publishedAt", "published"],
  defaults: {
    slug: "",
    title: "",
    excerpt: "",
    body: "",
    coverImage: "",
    author: "IBILL",
    publishedAt: new Date().toISOString().slice(0, 10),
    published: false,
  },
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "slug", label: "Slug", type: "text", required: true },
    { name: "excerpt", label: "Excerpt", type: "textarea" },
    { name: "body", label: "Body", type: "textarea", help: "Plain text - blank lines separate paragraphs" },
    { name: "coverImage", label: "Cover image URL", type: "url" },
    { name: "author", label: "Author", type: "text" },
    { name: "publishedAt", label: "Publish date", type: "text", help: "YYYY-MM-DD" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const TEAM_CONFIG: ResourceConfig = {
  resource: "team",
  singular: "team member",
  columns: ["name", "role", "order", "published"],
  defaults: { name: "", role: "", photo: "", bio: "", order: 0, published: true },
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "role", label: "Role", type: "text" },
    { name: "photo", label: "Photo URL", type: "url" },
    { name: "bio", label: "Bio", type: "textarea" },
    { name: "order", label: "Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const TESTIMONIAL_CONFIG: ResourceConfig = {
  resource: "testimonials",
  singular: "testimonial",
  columns: ["authorName", "authorTitle", "order", "published"],
  defaults: { quote: "", authorName: "", authorTitle: "", order: 0, published: true },
  fields: [
    { name: "quote", label: "Quote", type: "textarea", required: true },
    { name: "authorName", label: "Author name", type: "text", required: true },
    { name: "authorTitle", label: "Author title", type: "text" },
    { name: "order", label: "Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const MAINTENANCE_PLAN_CONFIG: ResourceConfig = {
  resource: "maintenancePlans",
  singular: "maintenance plan",
  columns: ["name", "annualFee", "order", "published"],
  defaults: {
    name: "",
    summary: "",
    annualFee: 0,
    feeNote: "",
    inclusions: [],
    order: 0,
    published: true,
  },
  fields: [
    { name: "name", label: "Plan name", type: "text", required: true },
    { name: "summary", label: "Summary", type: "textarea" },
    { name: "annualFee", label: "Annual maintenance fee (AED)", type: "number" },
    { name: "feeNote", label: "Fee note", type: "text", help: "e.g. + 5% VAT, billed annually" },
    { name: "inclusions", label: "What's included", type: "stringList", help: "One item per line" },
    { name: "order", label: "Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};

export const FAQ_CONFIG: ResourceConfig = {
  resource: "faqs",
  singular: "FAQ",
  columns: ["question", "order", "published"],
  defaults: { question: "", answer: "", order: 0, published: true },
  fields: [
    { name: "question", label: "Question", type: "text", required: true },
    { name: "answer", label: "Answer", type: "textarea" },
    { name: "order", label: "Order", type: "number" },
    { name: "published", label: "Published", type: "boolean" },
  ],
};
