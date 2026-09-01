export interface FaqSeed {
  question: string;
  answer: string;
  order: number;
  published: boolean;
}

/**
 * Questions reproduced verbatim from ibill.ae. The live site ships placeholder
 * answer text; kept here for the client to replace from /admin/settings.
 */
export const FAQS: FaqSeed[] = [
  {
    question: "How to Change my Photo from Admin Dashboard?",
    answer:
      "Sign in to your dashboard, open Profile settings, choose Change photo, upload a new image and save. The update applies across your account immediately.",
    order: 1,
    published: true,
  },
  {
    question: "How to Change my Password easily?",
    answer:
      "Go to Account settings, select Security, enter your current password followed by the new one, and confirm. You will stay signed in on this device.",
    order: 2,
    published: true,
  },
  {
    question: "How to Change my Subscription Plan using PayPal?",
    answer:
      "Open Billing, select Change plan, pick the plan you want, and choose PayPal at checkout. Your billing cycle and invoice update automatically.",
    order: 3,
    published: true,
  },
];

export const FAQ_INTRO =
  "Welcome to our FAQs. Here you'll find answers to common questions and solutions to everyday accounting challenges. Whether you're looking for guidance on getting started or need clarification on a specific topic, our FAQs are here to help.";
