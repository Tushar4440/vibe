This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Project Structure

This project follows a feature-driven architecture, where most of the domain-specific logic is organized under the `src/modules` directory. Here’s a brief overview of the key directories:

-   **`src/modules`**: Contains the core business logic, separated by feature (e.g., `projects`, `messages`, `usage`). Each module may include its own server-side procedures, UI components, and other related files.
-   **`src/components`**: Holds reusable UI components that are shared across different modules.
-   **`src/generated/prisma`**: Contains the auto-generated Prisma Client. This directory is essential for database access and is created by the `prisma generate` command. **Do not modify or move this directory**, as it is critical for the build process.
-   **`src/lib`**: Provides shared utility functions and houses the singleton instance of the Prisma client in `src/lib/db.ts`.
-   **`src/trpc`**: Manages the tRPC setup, including the server, client, and router configurations. It ties together the different procedures defined in the modules.

This structure helps maintain a clean separation of concerns and improves scalability by keeping feature-specific code isolated.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
