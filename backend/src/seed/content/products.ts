export interface ProductSeed {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  externalUrl: string;
  icon: string;
  heroImage?: string;
  gallery?: string[];
  features: string[];
  order: number;
  published: boolean;
}

export const PRODUCTS: ProductSeed[] = [
  {
    slug: "salon-assist",
    name: "Salon Assist",
    tagline: "Productivity and revenue tracking for salon owners.",
    description:
      "The Salon Assist App helps salon owners monitor staff productivity and revenue in detail - with real-time performance metrics, individual revenue tracking per stylist, and detailed revenue reports that make financial growth easy to follow.",
    externalUrl: "https://salonassist.ibill.ae/",
    icon: "Smartphone",
    features: [
      "Home",
      "About Our App",
      "Our Benefits",
      "App Work",
      "Screenshots",
      "Pricing",
      "Downloads",
      "Testimonials",
      "Clients",
    ],
    order: 1,
    published: true,
  },
];
