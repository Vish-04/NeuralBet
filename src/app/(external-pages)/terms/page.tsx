import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 pb-2">
              Terms & Conditions
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="border-none shadow-xl bg-gradient-to-b from-card to-card/50">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              Template Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using this application, you acknowledge that you
              have read and understood these terms and conditions. These terms
              govern your use of this Next.js + Supabase template application
              and all associated services.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              2. Service Description
            </h2>
            <p>This template application provides:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>User authentication and account management</li>
              <li>Data storage and retrieval via Supabase</li>
              <li>Modern responsive UI built with Next.js</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              3. User Responsibilities
            </h2>
            <p>As a user of this application, you agree to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide accurate registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Use the application in compliance with applicable laws</li>
              <li>
                Not attempt to manipulate or abuse the application's features
              </li>
              <li>
                Not attempt to scrape or collect data from the application
                without permission
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              4. Data and Privacy
            </h2>
            <p>You acknowledge that:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Your data is stored according to our privacy policy</li>
              <li>
                We implement security measures to protect your information
              </li>
              <li>You are responsible for the content you create and share</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              5. Intellectual Property
            </h2>
            <p>All content, including but not limited to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Application code and architecture</li>
              <li>Design elements and components</li>
              <li>Documentation and guides</li>
              <li>Branding and logos</li>
            </ul>
            <p>
              are the property of their respective owners and protected by
              intellectual property laws.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              6. Application Access
            </h2>
            <p>The application owner reserves the right to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Modify or discontinue any feature without notice</li>
              <li>Limit access during maintenance or updates</li>
              <li>Suspend accounts that violate these terms</li>
              <li>Change functionality or service offerings</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              7. Usage Limitations
            </h2>
            <p>You acknowledge that:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>The application may have usage limits</li>
              <li>Performance depends on your internet connection</li>
              <li>Service availability cannot be guaranteed at all times</li>
              <li>Backup of important data is your responsibility</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              8. Limitation of Liability
            </h2>
            <p>The application owner is not liable for:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Any data loss or corruption</li>
              <li>Service interruptions or downtime</li>
              <li>Misuse of the application by users</li>
              <li>Third-party integrations or services</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              9. Privacy and Data Collection
            </h2>
            <p>
              Your use of this application is also governed by our Privacy
              Policy, which details how we collect, use, and protect your
              information.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              10. Modifications to Terms
            </h2>
            <p>
              These terms may be updated at any time. Continued use of the
              application after changes constitutes acceptance of the new terms.
              Major changes will be announced via email or application
              notification.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              11. Contact Information
            </h2>
            <p>
              For questions about these terms, please use the contact
              information provided within your implementation of this template.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Terms & Conditions | Andrew Ting's Next.js + Supabase Template",
  description:
    'Template terms and conditions for your Next.js + Supabase application.',
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
