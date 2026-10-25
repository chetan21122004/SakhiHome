This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Profile registry

- `/admin`: full team workspace (admin only for coordinators redirect to field).
- `/field`: mobile-friendly maid browse and onboarding for admin and coordinators (no delete/archive; verification stays admin-side).
- `/register`: public applications in English, Hindi, and Marathi, saved directly to Supabase.
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local` and your hosting environment. The registry project is `jesfduyyewrxmtoudkyr` (Sakhis-db).
- Customer enquiries from the homepage form are stored in Supabase (`enquiries` table). Staff review them under **Enquiries** in `/admin`.
- Maid profiles are **not** listed publicly. Staff share **basic** and **full** invitation links (`/s/…` with random tokens) from `/admin` or `/field`. Run [`database/maid_share_links.sql`](database/maid_share_links.sql) in Supabase to create the table and revoke public access to `maid_public_listings`.
- For Cursor Supabase MCP, set a personal access token in your environment as `SUPABASE_ACCESS_TOKEN` (do not commit it).
- **Admin login (no Supabase Auth):** `/admin` checks email + password against the `staff_access` table (seed row `chetan44rt@gmail.com` / `123456`). Change password with SQL: `update staff_access set password = '…' where email = '…'`. Run [`database/staff-access-password.sql`](database/staff-access-password.sql) on existing projects.
- Set `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (server only) and `ADMIN_SESSION_SECRET` in production. Run [`database/admin-service-role.sql`](database/admin-service-role.sql) once in the SQL editor.
- Configure allowed redirect URLs and production Site URL in Supabase Authentication when deploying.
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
