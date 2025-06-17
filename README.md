# AndrewTing-NextJS-Supabase-Template

This is a modern Typescript + React 19 + Next.js 15 + TailwindCSS 3.4 + Supabase template, updated and maintained by Andrew Ting. It's based on the NextBase Lite template but includes significantly upgraded packages with cutting-edge versions.

## Features

- 🚀 Next.js 15.0.3 with app router, Turbopack, and async components
- ⚛️ React 19 (Release Candidate) for the latest React features
- 🔄 Supabase integration (supabase-js 2.46.1, auth-helpers-nextjs 0.10.0)
- 💻 Data fetching examples in React server and client components with suspenseful data fetching
- ⚛️ TanStack React Query setup configured
- 🔥 React Hot Toast component
- 💻 Fully typed with TypeScript 5.5.4, including automatic type generation for Supabase tables
- 🎨 TailwindCSS 3.4.10 for styling
- 🧪 Unit testing (Vitest) and integration testing (Playwright) setup built-in
- 💚 ESLint, TypeScript, Prettier, PostCSS configured for dev and test environments
- 📈 Automatic sitemap generation
- 🔍 SEO metadata, JSON-LD and Open Graph tags
- ✍️ Semantic release with automatic changelog generation
- 🎨 Prettier code formatter
- 💎 Minimal styling
- 📖 Clean, readable, and maintainable codebase
- 🔄 Regularly updated dependencies

### Development

1. Clone the repo
2. Install dependencies with `yarn`
3. Create a Supabase account if you don't have one already
4. Create a new project in Supabase
5. Link Supabase to your project using `yarn supabase link --project-ref <project-ref>`. You can get your project ref from the Supabase Project dashboard (Project Settings -> API)
6. Duplicate `.env.local.example` and rename it to `.env.local` and add the Project ref, Supabase URL and anon key.
7. Push the database schema to your Supabase project using `yarn supabase db push`.
8. Generate types for your Supabase tables using `yarn generate:types:local`.
9. Run `yarn dev` or `npm run dev` to start the development server with Turbopack.

> **Note:** This project is registered as `andrew-ting-nextjs-supabase-starter` in package.json and uses Yarn as the preferred package manager.

### Testing

1. Unit test using `yarn test` or `npm test`
2. End-to-end test using `yarn test:e2e` or `npm run test:e2e`

### Deployment

This is a standard Next.js project. You can deploy it to Vercel, Netlify, or any other hosting provider that supports Next.js.

### Contributing

Contributions are welcome. Please open an issue or a PR.

### License

MIT

### Troubleshooting

Checkout the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file for common issues.

### Acknowledgements

This template is derived from the [NextBase Lite](https://github.com/imbhargav5/nextbase-nextjs13-supabase-starter) boilerplate, with updates and modifications by Andrew Ting.
