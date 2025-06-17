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
} from '@/data/auth/auth';
import { createClient } from '@/supabase-clients/client';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

// Feature flag - set to magic link only
const MAGIC_LINK_ONLY = true;

export function Login({
  next,
  nextActionType,
}: {
  next?: string;
  nextActionType?: string;
}) {
  const [emailSentSuccessMessage, setEmailSentSuccessMessage] = useState<
    string | null
  >(null);
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
        setEmailSentSuccessMessage('A magic link has been sent to your email!');
      },
      onError: (error) => {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Send magic link failed ${String(error)}`;
        toast.error(errorMessage, {
          id: toastRef.current,
        });
        toastRef.current = undefined;
      },
    }
  );


  return (
    <div
      data-success={emailSentSuccessMessage}
      className="container data-[success]:flex items-center data-[success]:justify-center text-left max-w-lg mx-auto overflow-auto data-[success]:h-full min-h-[470px]"
    >
      {emailSentSuccessMessage ? (
        <EmailConfirmationPendingCard
          type={'login'}
          heading={'Confirmation Link Sent'}
          message={emailSentSuccessMessage}
          resetSuccessMessage={setEmailSentSuccessMessage}
        />
      ) : redirectInProgress ? (
        <RedirectingPleaseWaitCard
          message="Please wait while we redirect you to your dashboard."
          heading="Redirecting to Dashboard"
        />
      ) : MAGIC_LINK_ONLY ? (
        <MagicLinkLogin
          magicLinkStatus={magicLinkStatus}
          executeMagicLink={executeMagicLink}
          next={next}
        />
      ) : (
        <div className="space-y-8 bg-background/50 p-6 rounded-lg shadow dark:border">
          <FullLoginScreen
            passwordStatus={passwordStatus}
            executePassword={executePassword}
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

// New helper components
function FullLoginScreen({
  passwordStatus,
  executePassword,
  magicLinkStatus,
  executeMagicLink,
  providerStatus,
  executeProvider,
  next,
}: {
  passwordStatus: string;
  executePassword: (data: { email: string; password: string }) => void;
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
            <CardTitle>Login to Andrew Ting's Template</CardTitle>
            <CardDescription>
              Login with the account you used to signup.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            <EmailAndPassword
              isLoading={passwordStatus === 'executing'}
              onSubmit={(data) => {
                executePassword({
                  email: data.email,
                  password: data.password,
                });
              }}
              view="sign-in"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="magic-link">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="py-6 px-0">
            <CardTitle>Login to Andrew Ting's Template</CardTitle>
            <CardDescription>
              Login with magic link we will send to your email.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 p-0">
            <Email
              onSubmit={(email) => executeMagicLink({ email, next })}
              isLoading={magicLinkStatus === 'executing'}
              view="sign-in"
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social-login">
        <Card className="bg-transparent border-none shadow-none">
          <CardHeader className="pb-6 pt-0 px-0 text-center gap-2">
            <CardTitle>Login to Andrew Ting's Template</CardTitle>
            <CardDescription>
              <div className="flex items-center justify-center gap-1">
                Login with your social account
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <InfoIcon className="h-3 w-3 cursor-help" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80" side="top" align="center">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Social Login</h4>
                      <p className="text-sm text-muted-foreground">
                        We currently support Google and Whop login. To access
                        Premium Content, log in with the Whop account associated
                        with your subscription.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
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

function MagicLinkLogin({
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
          <Logo textSize="3xl" />
        </CardTitle>
        <CardDescription>
          Login with magic link we will send to your email
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 p-0">
        <Email
          onSubmit={(email) => executeMagicLink({ email, next })}
          isLoading={magicLinkStatus === 'executing'}
          view="sign-in"
        />
      </CardContent>
    </Card>
  );
}
