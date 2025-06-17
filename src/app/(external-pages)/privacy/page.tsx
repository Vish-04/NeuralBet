import { Card, CardContent } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative pt-20 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500 pb-2">
              Privacy Policy
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Template privacy policy for your Next.js + Supabase application
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="border-none shadow-xl bg-gradient-to-b from-card to-card/50 py-8 px-2">
          <CardContent className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold mb-4">
              1. Information We Collect
            </h2>
            <p>
              In this template application, we collect information necessary to provide
              our services:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Account information (name, email)</li>
              <li>User preferences and settings</li>
              <li>Usage data related to application features</li>
              <li>
                Technical information such as device type and browser
                information
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              2. How We Use Your Information
            </h2>
            <p>Your information helps us provide and improve our services:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Authenticate and manage user accounts</li>
              <li>Provide personalized user experiences</li>
              <li>Analyze application usage patterns</li>
              <li>Improve application features and performance</li>
              <li>Send important notifications about your account</li>
              <li>Maintain and improve platform security</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              3. Data Collection Methods
            </h2>
            <p>We collect data through various means:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                Direct user input when creating accounts or using features
              </li>
              <li>
                Automated collection of usage analytics
              </li>
              <li>Analytics and tracking tools to improve user experience</li>
              <li>Supabase authentication and database services</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              4. Information Sharing and Disclosure
            </h2>
            <p>We maintain strict controls over your information:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>We never sell your personal data to third parties</li>
              <li>Data is shared with service providers only as necessary</li>
              <li>
                Aggregated, anonymized data may be used for application
                improvements
              </li>
              <li>
                We may share data if required by law or to protect our rights
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              5. Data Security
            </h2>
            <p>We implement robust security measures:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>End-to-end encryption for sensitive data</li>
              <li>Regular security updates</li>
              <li>Secure authentication through Supabase</li>
              <li>Data backup and recovery protocols</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              6. Your Rights and Controls
            </h2>
            <p>You have full control over your data:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>Modify your account settings and preferences</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of email notifications and updates</li>
              <li>Request an export of your personal data</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              7. Data Retention
            </h2>
            <p>
              We retain your data for as long as your account is active or as
              needed to provide services. Usage data and analytics
              may be retained in anonymized form for application improvement.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              8. Changes to Privacy Policy
            </h2>
            <p>
              We may update this privacy policy to reflect changes in our
              practices or for legal compliance.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">
              9. Contact Information
            </h2>
            <p>
              For privacy-related questions or concerns, please contact us
              through the support channels specified in your implementation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Privacy Policy | Andrew Ting's Next.js + Supabase Template",
  description:
    "Template privacy policy for your Next.js + Supabase application.",
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
