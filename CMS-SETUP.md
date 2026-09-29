# Vednix CMS — Phase 1 & 2 Setup Guide

Covers what's live right now: the admin foundation (auth, dashboard shell,
security) and the full Blog CMS. Later phases (Careers, Contact Leads,
Newsletter, Early Access, Product Updates, Press Releases, Media Library,
Website Settings, Activity Logs viewer) will get their own section added here
as they ship.

## 1. What was added, folder by folder

```
src/lib/admin/
  types.ts        Shared TS types (BlogPost, AdminRecord, etc.)
  auth.ts         signInAdmin / signOutAdmin / getAdminRecord
  activity.ts     logActivity() — writes to activityLogs
  blogs.ts        Firestore CRUD for blogs (create/update/delete/publish/list)
  categories.ts   Firestore CRUD for the categories collection

src/lib/cloudinary.ts   Unsigned image upload helper (Media Library building block)

src/components/admin/
  AdminAuthProvider.tsx   React context: current Firebase user + admin role
  RequireAdmin.tsx        Redirects to /admin/login if not an authorized admin
  AdminShell.tsx          Sidebar + topbar chrome for every admin page
  blogs/
    RichTextEditor.tsx    Tiptap-based editor with a toolbar
    BlogEditor.tsx        The full create/edit form (metadata, SEO, images)

src/routes/admin/
  route.tsx        Layout — mounts AdminAuthProvider once for the whole /admin tree
  login.tsx        /admin/login
  index.tsx        /admin — dashboard home with overview cards
  blogs/
    index.tsx      /admin/blogs — list, search, filter, publish/unpublish, delete
    new.tsx        /admin/blogs/new
    $blogId.tsx    /admin/blogs/:blogId — edit

src/routes/insights.tsx        Existing page, now reads from Firestore instead of a hardcoded array
src/routes/insights.$slug.tsx  New — public post page with SEO + Article schema

scripts/bootstrap-admin.mjs    One-time script to create your first admin
firestore.rules                Security rules
firestore.indexes.json         Composite indexes the blog queries need
firebase.json                  Points the Firebase CLI at the two files above
```

The only changes to *existing* files: `src/lib/firebase.ts` (added an `auth`
export alongside your existing `db` export), `src/routes/__root.tsx` (skips
the public Navbar/Footer/CookieConsent specifically for `/admin/*` routes,
and mounts a toast notifier), `src/routes/insights.tsx` (data source
swapped, markup/classes untouched), and `src/styles.css` (one line
registering the Tailwind typography plugin used by the rich text content).
Nothing else on the public site was modified.

## 2. Firestore collections

| Collection      | Written by                          | Notes |
|------------------|--------------------------------------|-------|
| `admins`         | `scripts/bootstrap-admin.mjs` only    | Doc ID = Firebase Auth UID. `{ email, role, createdAt }` |
| `blogs`          | Admin CMS                             | See `src/lib/admin/types.ts` for the full shape |
| `categories`     | Admin CMS (auto-created inline)       | `{ name, slug }` |
| `activityLogs`   | Admin CMS (automatic, every action)   | Append-only |

Your pre-existing collections (`contact_messages`, `early_access_users`,
`newsletter_subscribers`, `career_applications`) are untouched — the new
security rules just lock them down to create-only from the public site.

## 3. Deploy the Firestore security rules

```bash
npm install -g firebase-tools
firebase login
firebase use vednix-web        # your existing project ID
firebase deploy --only firestore:rules,firestore:indexes
```

If you manage rules by pasting into the Firebase Console instead, copy the
contents of `firestore.rules` into Console → Firestore Database → Rules →
Publish, and create the two composite indexes listed in
`firestore.indexes.json` under the Indexes tab (or just click the
"create index" link Firestore prints in the browser console the first time
a query needs one).

## 4. Enable Email/Password sign-in

Firebase Console → Authentication → Sign-in method → **Email/Password** →
Enable. Nothing else needs enabling.

## 5. Create your first admin

```bash
# 1. Firebase Console -> Project Settings -> Service Accounts
#    -> Generate new private key -> save as serviceAccountKey.json
#    in the project root (already gitignored)

# 2. Run the bootstrap script
npm run bootstrap:admin -- --email=you@vednix.com --password=YourStrongPassword1
```

This creates the Firebase Auth user (or updates the password if it already
exists) and writes the `admins/{uid}` doc that grants dashboard access. Run
it again any time to add another admin with a different `--email`. Pass
`--role=editor` for a non-super-admin (stored for future permission tiers —
every admin currently has the same access).

Delete `serviceAccountKey.json` afterward if you'd rather not keep it on
disk — regenerate it from the Firebase Console if you need the script again.

## 6. Set up Cloudinary (Media Library — image uploads)

1. Create a free account at cloudinary.com.
2. Your Dashboard shows a **Cloud Name** — copy it.
3. Settings → Upload → Upload presets → **Add upload preset**:
   - Signing Mode: **Unsigned**
   - Save, copy the preset name.
4. Add both to `.env.local` (see `.env.example`):
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=your-preset-name
   ```
5. Add the same two variables in Vercel → Project → Settings →
   Environment Variables, then redeploy.

Until these are set, the cover/OG image upload buttons show a clear error
toast rather than failing silently — everything else in the Blog CMS works
without them.

## 7. Deploy on Vercel

No change to your existing deploy flow. Just make sure the two
`VITE_CLOUDINARY_*` env vars are set there too (step 6).
`serviceAccountKey.json` / the bootstrap script never run in production —
it's a local, one-time tool.

## 8. Using the Blog CMS day-to-day

1. Go to `/admin/login`, sign in.
2. **Blogs → New Blog.** Title auto-generates the slug (editable). Write in
   the rich text editor — bold/italic/headings/lists/quotes/links/images
   all work, images upload straight to Cloudinary.
3. Upload a **Cover Image** (shown on the `/insights` card and the post
   page) and optionally a separate **Open Graph Image** for social shares
   (falls back to the cover image if skipped).
4. Fill in category (pick existing or type a new one + "Add"), tags,
   author, and SEO fields (all optional — fall back to Title/Excerpt if
   left blank).
5. **Save Draft** any time — it won't appear on the public site yet.
   Existing drafts autosave every 20 seconds while you're editing.
6. **Publish** when ready — it immediately appears on `/insights` and gets
   its own page at `/insights/your-slug`.
7. From the **Blogs** list you can quick-toggle Publish/Unpublish or Delete
   without opening the editor. Search and status filter sit above the
   table; pagination kicks in past 10 posts.

Every action is recorded in `activityLogs` (no viewer page yet — that's a
later phase — but the data's being collected from day one).

## 9. Careers + Career Applications (added)

New files, same patterns as the Blog CMS:

```
src/lib/admin/careers.ts              Firestore CRUD for job postings
src/lib/admin/careerApplications.ts   List/update/delete for career_applications
src/lib/admin/careerIcons.ts          Icon-key -> Lucide icon map (shared by admin + public page)
src/components/admin/careers/JobEditor.tsx
src/routes/admin/careers/{index,new,$jobId}.tsx
src/routes/admin/applications/index.tsx
```

`careers` is a new collection: `{ title, department, badgeColor, iconKey,
location, employmentType, experience, duration, overview, responsibilities[],
requirements[], preferred[], salary, applyLink, status: "open"|"closed" }`.
The public `/careers` page reads only `status == "open"` jobs; the exact
same card markup/classes as before, just Firestore-backed. If `applyLink` is
left blank, the "Apply Now" button uses your existing internal
`/career-apply` flow; if set, it opens that URL in a new tab instead
(useful for external ATS links).

`career_applications` is your existing collection (unchanged shape) —
`/admin/applications` adds a `notes` field per applicant (not previously
in the schema) and a `status` workflow (New → Reviewing → Shortlisted →
Rejected/Hired) on top of what `saveCareerApplication` already writes.

The `/career-apply` position dropdown now pulls its options from open
Firestore jobs, falling back to the original static list if none are open
yet (so the form never breaks even with an empty CMS).

## 11. Contact Leads, Newsletter, Early Access (added)

```
src/lib/admin/contacts.ts      Firestore data layer for contact_messages
src/lib/admin/earlyAccess.ts   Firestore data layer for early_access_users
src/lib/admin/newsletter.ts    Firestore data layer for newsletter_subscribers
src/lib/admin/csv.ts           exportToCsv() — generic CSV download helper
src/routes/admin/contacts/index.tsx
src/routes/admin/early-access/index.tsx
src/routes/admin/newsletter/index.tsx
```

**Contact Leads** (`/admin/contacts`) — every `/contact` submission, with a
status workflow (New/In Progress/Resolved) and a Notes field, both new on
top of what the public form already writes. Search by name/email/subject,
view full message in a dialog, delete.

**Early Access** (`/admin/early-access`) — every `/early-access` signup
(name, email, phone, occupation, city — the fields your existing form
actually collects), search, CSV export, delete.

**Newsletter** (`/admin/newsletter`) — ⚠️ **there is no public newsletter
signup form on the site yet** (the `newsletter_subscribers` collection was
declared in `src/lib/submissions.ts` but nothing wrote to it). Rather than
guess where to add one — your instructions said not to touch the footer,
and there was no other obvious existing spot — I built the admin side only
(search, CSV export, delete) so it's ready the moment a form exists. The
page shows a clear note about this and the dashboard's Subscribers card
will read 0 until then. Tell me where you'd like the signup form (footer,
bottom of /insights, a dedicated page, a popup, etc.) and I'll wire it up.

## 13. Product Updates & Press Releases (added)

Brand-new public pages (there was no existing `/product-updates` or
`/press` to preserve, so these were designed fresh, matching the site's
existing look via the same `Section`/`GlassCard`/`Reveal`/`Eyebrow`
primitives everything else uses):

```
src/lib/admin/productUpdates.ts / pressReleases.ts
src/components/admin/updates/ProductUpdateEditor.tsx
src/components/admin/press/PressReleaseEditor.tsx
src/routes/admin/updates/{index,new,$updateId}.tsx
src/routes/admin/press/{index,new,$pressId}.tsx
src/routes/product-updates.tsx + product-updates.$slug.tsx
src/routes/press.tsx + press.$slug.tsx
```

Same draft/publish workflow, rich text editor, cover image, and SEO fields
as Blogs. Product Updates additionally has a **Version** field.

**Note:** since your instructions said not to modify navigation, these two
pages exist and work at their URLs but aren't linked from the main Navbar.
Say the word if you'd like them added there — that's a small, deliberate
Navbar edit I've held off on until you confirm.

## 14. Activity Logs viewer (added)

`/admin/logs` — every `activityLogs` entry (search by summary/actor/action,
grouped by category badge). The logging itself has been running since
Phase 1; this just makes it visible.

## 15. Website Settings (added)

`/admin/settings` — a single Firestore document (`websiteSettings/main`)
covering every field from your spec: company name, logo/favicon/hero
banner (Cloudinary upload), announcement bar, footer text, address/email/
phone, Google Maps, all five social links, privacy/terms URLs, SEO
defaults (title/description/keywords/OG image), Analytics/Tag Manager IDs,
robots.txt, and a sitemap toggle.

**Important:** this form is fully functional and saves for real, but the
live **Navbar, Footer, and per-page SEO tags don't read from these values
yet** — wiring that up means editing `Navbar.tsx`, `Footer.tsx`, and the
root SEO defaults directly, which your instructions explicitly said not to
touch. I didn't want to silently violate that, so I built the data layer +
admin UI (the part that was unambiguously requested) and left the "make
the live site consume it" step as an explicit decision for you. Tell me to
go ahead and I'll do it as a small, scoped change.

## 16. Media Library (added)

`/admin/media` — browse, search, filter by folder, copy URL, and remove
from the list. Built without needing your Cloudinary API secret: every
upload made anywhere in the CMS (`uploadImageToCloudinary` in
`src/lib/cloudinary.ts`) now also writes a record to a Firestore `media`
collection, and this page reads that index.

Two honest limitations, both fixable once you add a Cloudinary **API
key/secret** (server-only, never `VITE_`-prefixed) as a follow-up:
- **"Remove" only removes the Firestore index entry** — it doesn't delete
  the actual file from Cloudinary (that needs a signed Admin API request).
- The library only shows images uploaded **through this CMS** going
  forward — it can't retroactively list anything already sitting in your
  Cloudinary account from before.

## 17. Final Integration Pass (Website Settings live, Newsletter, Nav, Cloudinary, security fixes)

This pass connected the previously "data-only" modules to the live site and
hardened the Media Library and two public forms. Full detail in the
delivery message, but the essentials:

- **Navbar/Footer/root SEO** now read from `websiteSettings/main` via
  `useWebsiteSettings()`, falling back to the site's exact original
  hardcoded content when nothing's been edited yet — verified zero visual
  change with a fresh (empty) settings doc.
- **Newsletter** now has a public signup section in the Footer, using
  email-as-document-ID (`saveWithEmailKey`/`emailExistsByKey` in
  `src/lib/submissions.ts`) so duplicate-checking works from an
  unauthenticated browser without needing a bulk `list` read.
- **Security fix**: the same list-query bug existed in Early Access's
  duplicate check (`emailExists` needs an admin-only `list`, which a public
  visitor can't do) — every Early Access submission was silently failing
  at that step. Fixed the same way, plus updated `firestore.rules` to grant
  a narrow public `get` (not `list`) on these two collections.
- **Media Library** now does real, production Cloudinary integration:
  signed uploads and server-side deletion via new `CLOUDINARY_API_KEY` /
  `CLOUDINARY_API_SECRET` env vars (server-only) plus a Firebase Admin SDK
  check (`FIREBASE_SERVICE_ACCOUNT_KEY`) that verifies the caller is an
  admin before signing anything. See `.env.example` — the old unsigned
  `VITE_CLOUDINARY_*` vars are no longer used.
- **Nav**: "Updates" and "Press" added as new top-level links.
- `.prettierrc.json` added (`endOfLine: "auto"`) so ESLint stops flagging
  every pre-existing CRLF file — no existing file's line endings were
  touched.

Blogs, Careers, Career Applications, Contact Leads, Newsletter (admin side
— see §11 for the public form caveat), Early Access, Product Updates,
Press Releases, Media Library, Website Settings, and Activity Logs all
have working admin pages. Every `vite build` in this guide was actually
run and passed with no errors.

**Two things intentionally left for you to greenlight, since they'd touch
files your instructions marked off-limits:**
1. Public newsletter signup form location (footer / bottom of /insights /
   dedicated page / etc.)
2. Wiring Website Settings into the live Navbar/Footer/SEO tags, and
   linking Product Updates/Press into the main Navbar

---

## 13. Firestore Rules Testing & RBAC Verification

The project includes an automated, isolated runtime test suite verifying all database security rules and Role-Based Access Control (RBAC) boundaries against the local Firebase Firestore Emulator.

### Purpose
Guarantees that modifications to `firestore.rules`, role models, or collection schemas cannot silently introduce privilege escalations, unauthorized destructive actions, or public submission vulnerabilities.

### Canonical Command
```bash
# Ensure Java 17+ is on PATH (or set JAVA_HOME)
npx firebase-tools emulators:exec --only firestore "npm run test:rules"
```

### Environment Requirements
- **Node.js**: v18+ (tested on v22)
- **Java Runtime**: OpenJDK 17+ (required by the Firestore Emulator jar)
- **Firebase CLI**: `firebase-tools` (automatically executed via `npx`)

### Coverage (132 Tests)
1. **Admin Documents**: Client writes completely forbidden (`allow write: if false`); read access restricted to authenticated owner.
2. **RBAC & Content Collections**: `blogs`, `categories`, `productUpdates`, `pressReleases`, `careers`, `media`, and `websiteSettings` verify that only `super_admin` can perform deletions, updates to settings, or category mutations.
3. **Public Forms Schema Whitelist**: `contact_messages`, `early_access_users`, `newsletter_subscribers`, and `career_applications` enforce strict field whitelisting via `hasOnly(...)` and type bounds, blocking unauthorized extra or privileged fields (`role`, `isAdmin`, etc.).
4. **Visibility Contracts**: Published/open items are public; draft/closed items are strictly private to authorized editors.
5. **Activity Logs**: Append-only; immutability rules prevent any update or deletion by any user.
6. **Batch & Multi-Doc Escalation**: Atomic transaction verification ensures forbidden writes cannot be hidden inside multi-operation batches.
7. **Malformed Roles**: Missing, null, empty, or unexpected roles (`admin`, `owner`, `root`, etc.) fail closed.

### Safety Guarantee
All tests execute strictly against local emulator memory data. The suite **never** touches production Firebase, never modifies live data, and requires zero production credentials or secrets.

---

## 14. Public Form Abuse Protection & Anti-Spam (Phase 2B)

The public forms (`contact_messages`, `early_access_users`, `newsletter_subscribers`, `career_applications`) are protected by a defense-in-depth security model:

```text
Browser (React Form + Honeypot + Turnstile Widget)
       ↓
TanStack Start Server Function (Nitro Server Runtime)
       ↓
[Layer 3: Abuse Protection]
  1. Honeypot Check (Bot traps silently dropped)
  2. Cloudflare Turnstile Verification (Server-Side)
  3. IP-Based Sliding Window Rate Limiting
  4. Identifier / Email Cooldown & Deduplication
  5. Strict Zod Schema & Protocol Bounds
       ↓
[Layer 1 & 2: Firestore Authorization & Schema Whitelist]
  Firestore Security Rules (hasOnly validation & RBAC)
```

### Protection Mechanisms
1. **Honeypot Trap**: Invisible field (`website`) rendered off-screen. Automated spambots populate it; human users never see it. Triggered submissions are silently dropped with a generic success response to avoid giving feedback to bot operators.
2. **IP-Based Sliding Window Limiting**:
   - `contact_messages`: Max 5 submissions per 10 minutes per IP.
   - `career_applications`: Max 3 submissions per 15 minutes per IP.
   - `early_access_users`: Max 5 submissions per 10 minutes per IP.
   - `newsletter_subscribers`: Max 5 submissions per 10 minutes per IP.
   - Limit state is maintained in-memory on the server with automatic memory expiration.
3. **Identifier / Email Cooldown**:
   - 60-second cooldown per email for contact messages to prevent rapid-fire repeated clicks.
   - Deterministic email document IDs for `early_access_users` and `newsletter_subscribers` in Firestore.
4. **Cloudflare Turnstile Verification**:
   - Verification is conducted strictly server-side against `https://challenges.cloudflare.com/turnstile/v0/siteverify`.
   - Single-use token enforcement prevents replay attacks.
   - Operates in non-blocking passthrough mode in local development when unconfigured.
5. **Career Application Resume Bounds**:
   - Requires secure HTTPS protocol (`https://`).
   - Maximum length 500 characters.
   - Domain whitelisted to verified cloud storage providers (Google Drive, Dropbox, OneDrive). Dangerous schemes (`javascript:`, `data:`, `file:`) are strictly rejected.
   - Admin view renders external resume links with `rel="noreferrer"` and `target="_blank"`.

### Testing Abuse Protection
```bash
npm run test:abuse
```
Executes 32 automated tests covering honeypot traps, sliding-window rate limiting, cooldowns, Cloudflare Turnstile token validation/replays, and payload bounds.

