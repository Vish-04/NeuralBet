'use client';

import Particles from '@/components/Particles';
import { createClient } from '@/supabase-clients/client';
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Component() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    initializeAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* Hero section with particles */}
      <div className="relative w-full">
        {/* Particles container */}
        <div className="absolute inset-0 w-full">
          <Particles />
        </div>

        {/* Hero content */}
        <div className="relative z-10 pointer-events-none">
          <section className="w-full py-12 md:py-24 lg:py-24 xl:py-24">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 text-center lg:text-left lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                <div className="flex flex-col items-center lg:items-start justify-center space-y-4">
                  <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 leading-[1.2] pb-1">
                      Your Edge in Daily Fantasy Sports Betting
                    </h1>
                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                      Leverage real-time pricing discrepancies between DFS
                      platforms. Get actionable insights, recommendations, and
                      educational resources to make more profitable bets.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 min-[400px]:flex-row">
                    {user ? (
                      <Link
                        className="pointer-events-auto inline-flex h-14 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-8 text-base font-bold text-white shadow-lg transition-colors hover:from-blue-600 hover:to-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        href="/dashboard"
                      >
                        Launch App
                      </Link>
                    ) : (
                      <>
                        <Link
                          className="pointer-events-auto inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                          href="/login"
                        >
                          Login
                        </Link>
                        <Link
                          className="pointer-events-auto inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                          href="/sign-up"
                        >
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-center lg:justify-start">
                  <div className="relative w-full h-0 pb-[100%] max-w-[550px] max-h-[550px]">
                    <Image
                      className="rounded-xl object-contain"
                      alt="Cashing $10,000"
                      fill
                      src="/images/tweet_streak.png"
                      priority
                      sizes="(max-width: 550px) 100vw, 550px"
                      unoptimized
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Rest of your sections without particles */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Real-Time Data. Actionable Insights.
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Stay ahead of the game with minute-by-minute updates on pricing
                discrepancies between DFS platforms. Our platform combines data
                analysis with educational resources to help you make profitable
                betting decisions.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                alt="Platform Dashboard Preview"
                className="mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                width={550}
                src="/images/discrep_screenshot.png"
                sizes="(max-width: 550px) 100vw, 550px"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Live Discrepancy Tracking
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Monitor real-time pricing differences between PrizePicks
                        and Underdog to find profitable opportunities.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Smart Recommendations
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Get data-driven betting recommendations based on
                        historical trends and machine learning insights.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">
                        Educational Resources
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Access comprehensive guides, calculators, and Monte
                        Carlo simulations to master profitable betting
                        strategies.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Turn market inefficiencies into profitable opportunities.
            </h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Let our platform do the heavy lifting by identifying valuable
              betting opportunities across multiple DFS platforms.
            </p>
          </div>
          {user ? (
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Link
                className="pointer-events-auto inline-flex h-14 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-8 text-base font-bold text-white shadow-lg transition-colors hover:from-blue-600 hover:to-purple-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                href="/dashboard"
              >
                Launch App
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                href="/sign-up"
              >
                Login
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="#"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 border-t">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Real-Time Data
              </div>
              <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Make informed decisions with up-to-the-minute data.
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                Our platform continuously monitors multiple DFS sites, providing
                you with real-time pricing discrepancies, historical performance
                data, and advanced analytics to help you make profitable betting
                decisions.
              </p>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                Sports Betting Academy
              </div>
              <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Learn profitable betting strategies
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
                Access comprehensive guides, calculators, and Monte Carlo
                simulations to master profitable betting strategies. Our
                educational resources help you understand market inefficiencies,
                calculate expected ROI, and make data-driven decisions through
                interactive tools and in-depth articles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
