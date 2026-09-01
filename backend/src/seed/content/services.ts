export type ServiceCategory = "accounting" | "it";

export interface ServiceSeed {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: ServiceCategory;
  icon: string;
  features: string[];
  order: number;
  published: boolean;
}

/**
 * Copy is reproduced verbatim from ibill.ae. `longDescription` / `features` are
 * left empty on purpose - the live site has none - and can be filled from /admin.
 */
export const SERVICES: ServiceSeed[] = [
  {
    slug: "bookkeeping",
    title: "Bookkeeping",
    shortDescription: "Accurate financial record-keeping and management.",
    longDescription: "",
    category: "accounting",
    icon: "BookOpen",
    features: [],
    order: 1,
    published: true,
  },
  {
    slug: "payroll-services",
    title: "Payroll Services",
    shortDescription: "Accurate and timely payroll processing.",
    longDescription: "",
    category: "accounting",
    icon: "Wallet",
    features: [],
    order: 2,
    published: true,
  },
  {
    slug: "tax-planning",
    title: "Tax Planning",
    shortDescription:
      "Optimize tax strategy, minimize liability, maximize savings.",
    longDescription: "",
    category: "accounting",
    icon: "Calculator",
    features: [],
    order: 3,
    published: true,
  },
  {
    slug: "tax-registration",
    title: "Tax Registration",
    shortDescription: "Expert UAE tax registration and compliance services.",
    longDescription: "",
    category: "accounting",
    icon: "FileCheck2",
    features: [],
    order: 4,
    published: true,
  },
  {
    slug: "uae-vat-services",
    title: "UAE VAT Services",
    shortDescription:
      "UAE VAT registration, compliance, and returns filing services.",
    longDescription: "",
    category: "accounting",
    icon: "Receipt",
    features: [],
    order: 5,
    published: true,
  },
  {
    slug: "internal-audit",
    title: "Internal Audit",
    shortDescription:
      "Evaluations to ensure accuracy, efficiency, and compliance.",
    longDescription: "",
    category: "accounting",
    icon: "ShieldCheck",
    features: [],
    order: 6,
    published: true,
  },
  {
    slug: "business-advisory",
    title: "Business Advisory",
    shortDescription: "Expert guidance for business growth and success.",
    longDescription: "",
    category: "accounting",
    icon: "TrendingUp",
    features: [],
    order: 7,
    published: true,
  },
  {
    slug: "accounting",
    title: "Accounting",
    shortDescription: "Accurate financial reporting and management solutions.",
    longDescription: "",
    category: "accounting",
    icon: "BarChart3",
    features: [],
    order: 8,
    published: true,
  },
  {
    slug: "business-setup-licensing",
    title: "Business Setup & Licensing",
    shortDescription:
      "Support for setting up and licensing businesses in the UAE.",
    longDescription: "",
    category: "accounting",
    icon: "Building2",
    features: [],
    order: 9,
    published: true,
  },
  {
    slug: "tech-consulting",
    title: "Tech Consulting",
    shortDescription: "Expert technology solutions and consulting services.",
    longDescription: "",
    category: "it",
    icon: "Lightbulb",
    features: [],
    order: 10,
    published: true,
  },
  {
    slug: "salon-website-development",
    title: "Salon Website Development",
    shortDescription: "Create a stunning website for your salon.",
    longDescription: "",
    category: "it",
    icon: "LayoutTemplate",
    features: [],
    order: 11,
    published: true,
  },
  {
    slug: "software-development",
    title: "Software Development",
    shortDescription: "Custom software solutions for businesses and organizations.",
    longDescription: "",
    category: "it",
    icon: "Code2",
    features: [],
    order: 12,
    published: true,
  },
  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    shortDescription: "Development of mobile apps for iOS and Android.",
    longDescription: "",
    category: "it",
    icon: "Smartphone",
    features: [],
    order: 13,
    published: true,
  },
  {
    slug: "billing-software-development",
    title: "Billing Software Development",
    shortDescription: "Custom billing and invoicing software solutions.",
    longDescription: "",
    category: "it",
    icon: "ReceiptText",
    features: [],
    order: 14,
    published: true,
  },
];

export const SERVICE_CATEGORY_META: Record<
  ServiceCategory,
  { title: string; navLabel: string; intro: string; href: string }
> = {
  accounting: {
    title: "Accounting Services",
    navLabel: "Accounting Services",
    intro:
      "We offer a range of expert services to meet the unique needs of your business.",
    href: "/services/accounting",
  },
  it: {
    title: "IT Services",
    navLabel: "IT Services",
    intro:
      "Expert solutions for software development, web development, and more. Boost efficiency, productivity, and growth with our tailored IT services.",
    href: "/services/it",
  },
};
