import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Andrew Ting',
  description: 'Frequently Asked Questions about Andrew Ting',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
