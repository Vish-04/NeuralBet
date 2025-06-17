import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function StyleGuide() {
  return (
    <div className="container py-10 space-y-8">
      <h1 className="heading-1 mb-8">Style Guide</h1>

      <section className="space-y-4">
        <h2 className="heading-2">Typography</h2>
        <div className="space-y-4">
          <h1 className="heading-1">Heading 1</h1>
          <h2 className="heading-2">Heading 2</h2>
          <h3 className="heading-3">Heading 3</h3>
          <h4 className="heading-4">Heading 4</h4>
          <p className="paragraph">
            This is a paragraph with some sample text. Andrew Ting's Template
            uses clean typography to ensure readability and hierarchy in content
            presentation.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="heading-2">Colors & Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="heading-2">Cards</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>
                Card description text goes here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content with more detailed information.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
          <Card className="bg-muted">
            <CardHeader>
              <CardTitle>Muted Card</CardTitle>
              <CardDescription>Alternative card style.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card content with more detailed information.</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="heading-2">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="heading-2">Alerts</h2>
        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              This is an informational alert message.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>This is an error alert message.</AlertDescription>
          </Alert>
          <Alert className="border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              This is a success alert message.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    </div>
  );
}
