interface LogoProps {
  className?: string;
  textSize?:
    | 'sm'
    | 'base'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl';
}

export function Logo({ className, textSize = 'xl' }: LogoProps) {
  return (
    <span
      className={`text-${textSize} font-semibold font-tiny5 align-baseline ${className}`}
    >
      Andrew Ting's{' '}
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        Next.js + Supabase Template
      </span>
    </span>
  );
}
