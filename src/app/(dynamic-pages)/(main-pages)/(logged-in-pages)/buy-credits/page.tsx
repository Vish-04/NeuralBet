'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Wallet,
  DollarSign,
  Zap,
  Crown,
  Star,
  Gift,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { WalletBalance } from '@/components/Betting';
import type { WalletBalance as WalletBalanceType } from '@/types/betting';

// Mock wallet balance
const mockWalletBalance: WalletBalanceType = {
  id: 'wallet-1',
  userId: 'user-1',
  credits: 2847.5,
  lastUpdated: new Date().toISOString(),
};

// Credit packages
interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
  originalPrice?: number;
  bonus: number;
  popular?: boolean;
  premium?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  description: string;
}

const creditPackages: CreditPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 1000,
    price: 9.99,
    bonus: 0,
    icon: Zap,
    features: [
      'Perfect for beginners',
      'Instant credit delivery',
      '30-day money back guarantee',
    ],
    description: 'Get started with AI battle betting',
  },
  {
    id: 'popular',
    name: 'Popular Choice',
    credits: 2500,
    price: 19.99,
    originalPrice: 24.99,
    bonus: 500,
    popular: true,
    icon: Star,
    features: [
      'Most popular choice',
      '+20% bonus credits',
      'Priority customer support',
      'Exclusive betting tips',
    ],
    description: 'Best value for regular bettors',
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    credits: 5000,
    price: 39.99,
    originalPrice: 49.99,
    bonus: 1000,
    premium: true,
    icon: Crown,
    features: [
      'Maximum value',
      '+20% bonus credits',
      'VIP customer support',
      'Early access to new features',
      'Monthly bonus credits',
    ],
    description: 'For serious AI battle enthusiasts',
  },
  {
    id: 'ultimate',
    name: 'Ultimate Pack',
    credits: 10000,
    price: 79.99,
    originalPrice: 99.99,
    bonus: 2500,
    premium: true,
    icon: Sparkles,
    features: [
      'Ultimate package',
      '+25% bonus credits',
      'Dedicated account manager',
      'Exclusive tournaments access',
      'Weekly bonus rewards',
    ],
    description: 'The complete AI betting experience',
  },
];

// Payment methods
interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  processingTime: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: '💳',
    description: 'Visa, Mastercard, American Express',
    processingTime: 'Instant',
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '🟦',
    description: 'Pay with your PayPal account',
    processingTime: 'Instant',
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    icon: '🍎',
    description: 'Quick and secure payment',
    processingTime: 'Instant',
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    icon: '🔵',
    description: 'Pay with Google',
    processingTime: 'Instant',
  },
];

export default function BuyCreditsPage() {
  const [selectedPackage, setSelectedPackage] = useState<string>('popular');
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance] = useState<WalletBalanceType>(mockWalletBalance);

  const selectedPkg = creditPackages.find((pkg) => pkg.id === selectedPackage);
  const totalCredits = selectedPkg
    ? selectedPkg.credits + selectedPkg.bonus
    : 0;
  const price = selectedPkg ? selectedPkg.price : 0;

  const handlePurchase = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would integrate with Stripe or another payment processor
    console.log('Processing payment:', {
      package: selectedPackage,
      paymentMethod: selectedPayment,
      amount: price,
      credits: totalCredits,
    });

    setIsProcessing(false);

    // Show success message or redirect
    alert(`Successfully purchased ${totalCredits} credits for $${price}!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Buy Betting Credits</h1>
        <p className="text-muted-foreground">
          Power up your AI battle betting experience with instant credit top-ups
        </p>
      </div>

      {/* Current Balance */}
      <div className="flex justify-center">
        <WalletBalance balance={walletBalance} className="max-w-none" />
      </div>

      {/* Credit Packages */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-center">
          Choose Your Credit Package
        </h2>

        <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPackages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div key={pkg.id} className="relative">
                  <RadioGroupItem
                    value={pkg.id}
                    id={pkg.id}
                    className="sr-only"
                  />
                  <Label htmlFor={pkg.id} className="cursor-pointer">
                    <Card
                      className={`h-full transition-all hover:shadow-lg ${
                        selectedPackage === pkg.id
                          ? 'ring-2 ring-primary shadow-lg'
                          : 'hover:shadow-md'
                      } ${
                        pkg.premium
                          ? 'bg-gradient-to-b from-yellow-50 to-white dark:from-yellow-900/10 dark:to-background'
                          : ''
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-green-600 text-white">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      {pkg.premium && (
                        <div className="absolute -top-2 right-2">
                          <Badge className="bg-yellow-600 text-white">
                            Premium
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-4">
                        <div className="flex justify-center mb-2">
                          <Icon
                            className={`h-8 w-8 ${
                              pkg.premium ? 'text-yellow-600' : 'text-primary'
                            }`}
                          />
                        </div>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <div className="space-y-1">
                          <div className="text-3xl font-bold">
                            {formatCurrency(pkg.price)}
                          </div>
                          {pkg.originalPrice && (
                            <div className="text-sm text-muted-foreground line-through">
                              {formatCurrency(pkg.originalPrice)}
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-2 text-2xl font-bold text-green-600">
                            <DollarSign className="h-5 w-5" />
                            {pkg.credits.toLocaleString()}
                          </div>
                          {pkg.bonus > 0 && (
                            <div className="text-sm text-green-600 font-medium">
                              +{pkg.bonus.toLocaleString()} bonus credits
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {pkg.description}
                          </p>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          {pkg.features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </div>

      {/* Custom Amount Option */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Custom Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="custom"
              checked={isCustom}
              onChange={(e) => setIsCustom(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="custom">I want to buy a custom amount</Label>
          </div>

          {isCustom && (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="custom-amount">Amount (USD)</Label>
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="Enter amount..."
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  min="5"
                  max="500"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Minimum $5, Maximum $500. Credits = Amount × 100
                </p>
              </div>

              {customAmount && parseFloat(customAmount) >= 5 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    You will receive{' '}
                    <strong>
                      {(parseFloat(customAmount) * 100).toLocaleString()}{' '}
                      credits
                    </strong>{' '}
                    for ${customAmount}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={selectedPayment}
            onValueChange={setSelectedPayment}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="sr-only"
                  />
                  <Label htmlFor={method.id} className="cursor-pointer">
                    <Card
                      className={`transition-all hover:shadow-md ${
                        selectedPayment === method.id
                          ? 'ring-2 ring-primary shadow-md'
                          : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="text-xl">{method.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium">{method.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {method.description}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {method.processingTime}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Purchase Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Purchase Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!isCustom && selectedPkg && (
              <>
                <div className="flex justify-between items-center">
                  <span>Package:</span>
                  <span className="font-medium">{selectedPkg.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Base Credits:</span>
                  <span className="font-medium">
                    {selectedPkg.credits.toLocaleString()}
                  </span>
                </div>
                {selectedPkg.bonus > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Bonus Credits:</span>
                    <span className="font-medium">
                      +{selectedPkg.bonus.toLocaleString()}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Credits:</span>
                  <span>{totalCredits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Price:</span>
                  <span>{formatCurrency(price)}</span>
                </div>
              </>
            )}

            {isCustom && customAmount && parseFloat(customAmount) >= 5 && (
              <>
                <div className="flex justify-between items-center">
                  <span>Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(parseFloat(customAmount))}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Credits:</span>
                  <span className="font-medium">
                    {(parseFloat(customAmount) * 100).toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Secure Payment:</strong> All transactions are encrypted and
          processed securely. We never store your payment information. Credits
          are delivered instantly after successful payment.
        </AlertDescription>
      </Alert>

      {/* Purchase Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          size="lg"
          onClick={handlePurchase}
          disabled={
            isProcessing ||
            (isCustom && (!customAmount || parseFloat(customAmount) < 5))
          }
          className="flex items-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" />
              Complete Purchase
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>

        <Button variant="outline" size="lg" asChild>
          <Link href="/portfolio">
            <Wallet className="h-4 w-4 mr-2" />
            View Portfolio
          </Link>
        </Button>
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-muted-foreground space-y-2">
        <p>
          Need help? Contact our{' '}
          <Link href="/support" className="text-primary hover:underline">
            customer support
          </Link>
        </p>
        <p>
          By purchasing, you agree to our{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
