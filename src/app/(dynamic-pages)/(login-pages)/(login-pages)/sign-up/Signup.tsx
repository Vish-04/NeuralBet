'use client';

import { Email } from '@/components/Auth/Email';
import { EmailAndPassword } from '@/components/Auth/EmailAndPassword';
import { EmailConfirmationPendingCard } from '@/components/Auth/EmailConfirmationPendingCard';
import { RedirectingPleaseWaitCard } from '@/components/Auth/RedirectingPleaseWaitCard';
import { Logo } from '@/components/Logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  signInWithMagicLinkAction,
  signUpAction,
  signInWithProviderAction,
} from '@/data/auth/auth';
import { RenderProviders } from '@/components/Auth/RenderProviders';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card';
import { Info } from 'lucide-react';
import { createClient } from '@/supabase-clients/client';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

// Feature flag - set to magic link only
const MAGIC_LINK_ONLY = true;

export function SignUp({
  next,
  nextActionType,
}: {
  next?: string;
  nextActionType?: string;
}) {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const toastRef = useRef<string | number | undefined>(undefined);

  const router = useRouter();
  const supabase = createClient();

  function redirectToDashboard() {
    if (next) {
      router.push(`/auth/callback?next=${next}`);
    } else {
      router.push('/dashboard');
    }
  }

  const { execute: executeMagicLink, status: magicLinkStatus } = useAction(
    signInWithMagicLinkAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Sending magic link...');
      },
      onSuccess: () => {
        toast.success('A magic link has been sent to your email!', {
          id: toastRef.current,
        });
        toastRef.current = undefined;
        setSuccessMessage('A magic link has been sent to your email!');
      },
      onError: ({ error }) => {
        const errorMessage = error.serverError ?? 'Failed to send magic link';
        toast.error(errorMessage, { id: toastRef.current });
        toastRef.current = undefined;
      },
    }
  );

  const { execute: executeSignUp, status: signUpStatus } = useAction(
    signUpAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Creating account...');
      },
      onSuccess: () => {
        toast.success('Account created!', { id: toastRef.current });
        toastRef.current = undefined;
        setSuccessMessage('A confirmation link has been sent to your email!');
      },
      onError: ({ error }) => {
        const errorMessage = error.serverError ?? 'Failed to create account';
        toast.error(errorMessage, { id: toastRef.current });
        toastRef.current = undefined;
      },
    }
  );

  const { execute: executeProvider, status: providerStatus } = useAction(
    signInWithProviderAction,
    {
      onExecute: () => {
        toastRef.current = toast.loading('Redirecting to provider...');
      },
      onSuccess: (result) => {
        toast.dismiss(toastRef.current);
        toastRef.current = undefined;
        if (result.data?.url) {
          window.location.href = result.data.url;
        }
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Provider sign in failed ${String(error)}`;
        toast.error(errorMessage, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );


  return (
    <div
      data-success={successMessage}
      className="container data-[success]:flex items-center data-[success]:justify-center text-left max-w-lg mx-auto overflow-auto data-[success]:h-full min-h-[470px]"
    >
      {successMessage ? (
        <EmailConfirmationPendingCard
          type="sign-up"
          heading="Confirmation Link Sent"
          message={successMessage}
          resetSuccessMessage={setSuccessMessage}
        />
      ) : redirectInProgress ? (
        <RedirectingPleaseWaitCard
          message="Please wait while we redirect you to your dashboard."
          heading="Redirecting to Dashboard"
        />
      ) : MAGIC_LINK_ONLY ? (
        <MagicLinkSignUp
          magicLinkStatus={magicLinkStatus}
          executeMagicLink={executeMagicLink}
          next={next}
        />
      ) : (
        <div className="space-y-8 bg-background/50 p-6 rounded-lg shadow dark:border">
          <FullSignUpScreen
            signUpStatus={signUpStatus}
            executeSignUp={executeSignUp}
            magicLinkStatus={magicLinkStatus}
            executeMagicLink={executeMagicLink}
            providerStatus={providerStatus}
            executeProvider={executeProvider}
            next={next}
          />
        </div>
      )}
    </div>
  );
}

function FullSignUpScreen({
  signUpStatus,
  executeSignUp,
  magicLinkStatus,
  executeMagicLink,
  providerStatus,
  executeProvider,
  next,
}: {
  signUpStatus: string;
  executeSignUp: (data: { email: string; password: string }) => void;
  magicLinkStatus: string;
  executeMagicLink: (data: { email: string; next?: string }) => void;
  providerStatus: string;
  executeProvider: (data: {
    provider: 'google' | 'github' | 'twitter';
    next?: string;
  }) => void;
  next?: string;
}) {
  return (
    <Tabs defaultValue="password" className="md:min-w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
        <TabsTrigger value="social-login">Social Login</TabsTrigger>
      </TabsList>
      <TabsContent value="password">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="py-6 px-0">
            <CardTitle>Welcome to Andrew Ting's Template</CardTitle>
            <CardDescription>
              Create an account with your email and password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            <EmailAndPassword
              isLoading={signUpStatus === 'executing'}
              onSubmit={(data) => executeSignUp(data)}
              view="sign-up"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="magic-link">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="py-6 px-0">
            <CardTitle>Welcome to Andrew Ting's Template</CardTitle>
            <CardDescription>
              Create an account with magic link we will send to your email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            <Email
              onSubmit={(email) => executeMagicLink({ email, next })}
              isLoading={magicLinkStatus === 'executing'}
              view="sign-up"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social-login">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="pb-6 pt-0 px-0 text-center gap-2">
            <CardTitle>
              Welcome to <Logo className="ml-2" textSize="3xl" />
            </CardTitle>
            <CardDescription className="flex items-center justify-center gap-1">
              Sign up with your social account
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <Info className="h-3 w-3 cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80" side="top" align="center">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Social Sign Up</h4>
                    <p className="text-sm text-muted-foreground">
                      We currently support Google and Whop login. To access
                      Premium Content, log in with the Whop account associated
                      with your subscription.
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            <RenderProviders
              providers={['google']}
              isLoading={providerStatus === 'executing'}
              onProviderLoginRequested={(
                provider: 'google' | 'github' | 'twitter'
              ) => executeProvider({ provider, next })}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function MagicLinkSignUp({
  magicLinkStatus,
  executeMagicLink,
  next,
}: {
  magicLinkStatus: string;
  executeMagicLink: (data: { email: string; next?: string }) => void;
  next?: string;
}) {
  return (
    <Card className="bg-card/95 p-6 border-none shadow-none">
      <CardHeader className="pb-6 pt-0 px-0 text-center gap-2">
        <CardTitle>
          <Logo className="ml-1" textSize="3xl" />
        </CardTitle>
        <CardDescription>
          Create an account with magic link we will send to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-0">
        <Email
          onSubmit={(email) => executeMagicLink({ email, next })}
          isLoading={magicLinkStatus === 'executing'}
          view="sign-up"
        />
      </CardContent>
    </Card>
  );
}
