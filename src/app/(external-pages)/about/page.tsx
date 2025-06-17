import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  BookOpen,
  Code2,
  Cpu,
  Shield,
  Twitter,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      title: 'Next.js App Router',
      description:
        'Built with the latest Next.js features for optimal performance and developer experience',
      icon: Code2,
    },
    {
      title: 'Supabase Integration',
      description:
        'Seamless authentication and database functionality powered by Supabase',
      icon: BookOpen,
    },
    {
      title: 'Secure by Default',
      description:
        'Security best practices implemented throughout the application architecture',
      icon: Shield,
    },
    {
      title: 'Modern Stack',
      description:
        'TypeScript, Tailwind CSS, and other modern tools for efficient development',
      icon: Cpu,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 animate-grid-fade" />
        <div className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-4xl font-extrabold tracking-tight font-tiny5">
              <span className="align-baseline">About</span>{' '}
              <Logo textSize="4xl" />
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground/90 max-w-3xl mx-auto">
              A modern, production-ready starter template for building
              full-stack applications
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission Section */}
        <div className="relative -mt-12">
          <Card className="border-none shadow-2xl bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center ">
                Template Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-card-foreground/90 leading-relaxed">
                This template provides a solid foundation for building modern
                web applications with Next.js and Supabase. It includes
                authentication, database integration, UI components, and
                everything you need to start developing your application
                immediately. Skip the boilerplate and focus on building your
                unique features.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="py-24">
          <h2 className="text-3xl font-bold  text-center mb-16">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="relative group hover:shadow-xl transition-all duration-300 overflow-hidden border-none bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/0 group-hover:from-primary/10 transition-all duration-300" />
                <CardContent className="pt-8 pb-6">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl mb-3 ">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Founder Section */}
        <div className="py-24">
          <Card className="border-none shadow-xl bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center ">
                About the Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="max-w-3xl mx-auto text-center">
              <div className="mb-10">
                <div className="w-28 h-28 mx-auto rounded-full bg-primary/10 flex items-center justify-center p-1 ring-2 ring-primary/20">
                  <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">AT</span>
                  </div>
                </div>
              </div>
              <p className="text-lg text-card-foreground/90 leading-relaxed">
                This template was created by Andrew Ting, combining experience
                in modern web development with a passion for creating efficient,
                scalable, and user-friendly applications. This template
                represents best practices and a carefully selected technology
                stack for rapid development.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Connect Section */}
        <div className="py-24 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary mb-12">Resources</h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Button asChild size="lg" className="group">
                <Link
                  href="https://github.com/andrewting19"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="mr-2 h-5 w-5" />
                  GitHub Repository
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" className="group">
                <Link
                  href="https://supabase.com/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Supabase Documentation
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "About | Andrew Ting's Next.js + Supabase Template",
  description:
    'Learn about this Next.js + Supabase template created by Andrew Ting for building modern web applications.',
  icons: {
    icon: [
      {
        url: '/icon/favicon.ico',
        sizes: '32x32',
      },
      {
        url: '/icon/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
    apple: [
      {
        url: '/icon/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};
