// do not cache this layout
export const dynamic = 'force-dynamic';

export const metadata = {
  title: `Andrew Ting's Next.js + Supabase Template`,
  description: 'your description here',
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
  return <>{children}</>;
}
