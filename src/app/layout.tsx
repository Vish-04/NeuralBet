import Footer from '@/components/Footer';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/next';
import { Inter, Roboto_Mono, Tiny5 } from 'next/font/google';
import { ClientLayout } from './ClientLayout';
import './globals.css';
import { ExternalNavigation } from './Navbar';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

const tiny5 = Tiny5({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-tiny5',
  preload: true,
  adjustFontFallback: false,
});

export const metadata = {
  title: `Andrew Ting's Next.js + Supabase Template`,
  description:
    'your description here',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${roboto_mono.variable} ${tiny5.variable}`}
    >
      <head />
      <body>
        <TooltipProvider>
          <div className="flex pt-2 flex-col min-h-screen bg-white dark:bg-gray-900 overflow-x-hidden">
            <ExternalNavigation />
            <ClientLayout>{children}</ClientLayout>
            <Footer />
          </div>
        </TooltipProvider>
        <Analytics />
      </body>
    </html>
  );
}
