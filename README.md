This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Profile registry

- `/admin`: staff login and live profiles, family details, private photos/documents, applications, households, and placements.
- `/register`: public applications in English, Hindi, and Marathi, saved directly to Supabase.
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` and your hosting environment. The registry project is `jesfduyyewrxmtoudkyr` (Sakhis-db).
- Customer enquiries from the homepage form are stored in Supabase (`enquiries` table). Staff review them under **Enquiries** in `/admin`.
- Public verified availability is listed at `/maids` (no private contact details).
- For Cursor Supabase MCP, set a personal access token in your environment as `SUPABASE_ACCESS_TOKEN` (do not commit it).
- The first approved admin email is `chetan44rt@gmail.com`. Open `/admin`, create your account with your own password, confirm your email, and sign in. Configure allowed redirect URLs and production Site URL in Supabase Authentication when deploying.
- Admins manage staff access in **Workspace**. Staff must register their own authentication account; adding access does not send an invitation.
- Photos: JPEG, PNG or WebP, up to 5 MB. Documents: those image formats or PDF, up to 10 MB. Upload from the profile editor, then **Save profile** to retain the attachment. Buckets are private; photos use temporary signed viewing URLs.
- Records persist across tabs and refresh. There is no demo data or browser-session record storage. Conflicting edits and overlapping placements are rejected by the database. Applications are approved with a single atomic database operation.
- Remote schema changes are recorded in Supabase migrations. `database/registry.sql` and `database/harden-registry.sql` document initial setup. `database/verify-registry.sql` runs database policy checks inside a rolled-back transaction.

Run `npm run dev` to preview. If the local Turbopack worker fails, use `npx next dev --webpack -p 3001`.

## Getting Started


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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
