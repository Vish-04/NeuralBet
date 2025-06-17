'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'What is this Next.js + Supabase Template?',
    answer:
      'This is a production-ready template that combines Next.js and Supabase to help developers quickly build modern web applications. It includes authentication, database integration, responsive UI components, and everything you need to start developing your application immediately without dealing with boilerplate code.',
  },
  {
    question: 'What features are included in this template?',
    answer:
      'This template includes user authentication with Supabase Auth, database integration, responsive UI built with Tailwind CSS, dark mode support, optimized routing with Next.js App Router, TypeScript for type safety, and various pre-built components to accelerate your development process.',
  },
  {
    question: 'How do I customize the application theme?',
    answer:
      'The template uses Tailwind CSS for styling with a custom theme configuration. You can modify the theme colors, typography, spacing, and other design tokens in the tailwind.config.js file. The UI components are built with a consistent design system that automatically adapts to your theme changes.',
  },
  {
    question: 'How does the authentication system work?',
    answer:
      'Authentication is handled by Supabase Auth, which provides secure, production-ready authentication flows. The template includes sign-up, sign-in, password reset, and account management functionality. You can easily enable additional authentication providers like Google, GitHub, or social logins through the Supabase dashboard.',
  },
  {
    question: 'How do I work with the database?',
    answer:
      'The template uses Supabase as the backend database (powered by PostgreSQL). Database interactions are handled through the Supabase client, which provides a simple API for querying, inserting, updating, and deleting data. You can manage your database schema through migrations or using the Supabase dashboard.',
  },
  {
    question: 'Can I deploy this template to any hosting provider?',
    answer: `Yes, the template can be deployed to any hosting provider that supports Next.js applications, such as Vercel, Netlify, AWS, or your own server. We recommend Vercel for the simplest deployment experience, as it's optimized for Next.js applications and offers serverless functions, analytics, and global edge network.`,
  },
  {
    question: 'How do I handle environment variables?',
    answer: `Environment variables are used for sensitive configuration like API keys and database connections. The template includes a .env.example file that you should copy to .env.local for local development. When deploying, you'll need to configure these environment variables on your hosting platform. Next.js automatically handles environment variables securely, exposing only those prefixed with NEXT_PUBLIC_ to the client.`,
  },
  {
    question: 'Is this template suitable for production applications?',
    answer:
      'Absolutely! This template follows best practices for performance, security, and maintainability. It includes proper error handling, TypeScript for type safety, responsive design, accessibility features, and optimized builds. Many production applications have been built using this stack, and it scales well for applications of all sizes.',
  },
  {
    question: 'How do I add new pages or API routes?',
    answer:
      'With Next.js App Router, you can create new pages by adding files to the app directory. For example, to create a page at /dashboard, add a page.tsx file in app/dashboard/. API routes can be created as route.ts files in the app/api/ directory. The template follows a consistent directory structure to help you organize your code effectively.',
  },
  {
    question: 'Does this template support server-side rendering?',
    answer:
      'Yes, Next.js provides built-in support for server-side rendering, static site generation, and incremental static regeneration. The template is configured to use the optimal rendering strategy for each page. You can control rendering behavior using Next.js data fetching methods like fetch with appropriate cache options in server components.',
  },
  {
    question: 'How do I update dependencies?',
    answer:
      'The template uses npm (or yarn/pnpm) for dependency management. You can update dependencies by running npm update or manually updating version numbers in package.json. We recommend keeping dependencies up to date for security and performance improvements, but be sure to test thoroughly after updates.',
  },
  {
    question: 'Where can I find additional help or resources?',
    answer:
      'The template includes comprehensive documentation in the README.md file. For more specific questions, you can refer to the official Next.js and Supabase documentation. If you encounter any issues with the template itself, you can open an issue on the GitHub repository or reach out through the support channels mentioned in the documentation.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 pb-2">
        Frequently Asked Questions
      </h1>
      <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
        Everything you need to know about the Next.js + Supabase template
      </p>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-300">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
