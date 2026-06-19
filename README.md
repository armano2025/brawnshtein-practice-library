# Brawnshtein Practice Library

Hebrew RTL practice-library website built with React, TypeScript, Vite, Firebase Hosting, and Cloud Firestore.

## Prerequisites

- Node.js 20 or newer
- npm
- Firebase CLI (only when deployment is needed)

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`.

3. Add the Firebase web-app configuration values to `.env.local`.

4. Keep `VITE_USE_DEMO_DATA=false` to load the catalog from Firestore. Set it to `true` only for local demo mode using the bundled seed data.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite.

## Available commands

- `npm run dev` — start the development server.
- `npm run build` — type-check and create a production build.
- `npm run preview` — preview the production build locally.
- `npm run lint` — check the source code with ESLint.

## Routes

- `/`
- `/mathematics`
- `/grade/:id`
- `/topic/:id`
- `/worksheet/:id`

## Firebase and Firestore setup

The Firebase configuration lives in `src/lib/firebase.ts`. Catalog reads use four top-level Firestore collections:

- `subjects`
- `grades`
- `topics`
- `worksheets`

Use each entity's `id` as its Firestore document ID. Relations use `subjectId`, `gradeSlug`, and `topicSlug`. Create the collections in the Firebase console and copy the matching documents from the local demo data files. Firestore timestamps are supported for worksheet `createdAt` and `updatedAt` fields.

The included security rules allow public reads for the catalog collections and deny all client writes. Authentication, administration, analytics, and client-side counter updates are intentionally not connected yet.

## One-time Firestore seed

The seed command uses the Firebase Admin SDK and the local demo data as its source. Documents use stable IDs and are written with merge semantics, so repeated runs update existing documents and create missing documents without duplicates.

1. In Firebase Console, create a service account key from **Project settings > Service accounts**.

2. Copy `.env.seed.example` to `.env.seed`.

3. Set the Firebase project ID and the absolute path to the downloaded service-account JSON file:

   ```env
   FIREBASE_PROJECT_ID=your-firebase-project-id
   GOOGLE_APPLICATION_CREDENTIALS=C:\absolute\path\to\service-account-key.json
   ```

4. Validate the seed locally without connecting to Firebase:

   ```bash
   npm run seed:dry-run
   ```

5. Create or update all Firestore documents:

   ```bash
   npm run seed
   ```

The command prints collection counts before writing and a per-collection write summary afterward. `.env.seed` and service-account keys must never be committed. You can select another environment file by setting `SEED_ENV_FILE`.

## Phase 1 PDF hosting

PDF files are served as static assets by Firebase Hosting. Firebase Storage and the Blaze plan are not required for this phase.

Place files under:

```text
public/pdfs/mathematics/{grade-slug}/{topic-folder}/{file-name}.pdf
```

Use lowercase English kebab-case for every folder and filename. Keep names stable after publishing because Firestore documents link to these paths. Example:

```text
public/pdfs/mathematics/grade-7/percentages/sample.pdf
```

Store the corresponding root-relative URL in the worksheet's Firestore `pdfUrl` field:

```text
/pdfs/mathematics/grade-7/percentages/sample.pdf
```

The `storagePath` field is optional during Phase 1 and can be omitted or left empty. Vite copies everything under `public/` into `dist/` during the production build. To publish the website and PDF files together, run:

```bash
npm run build
firebase deploy --only hosting
```

Adding or replacing a PDF requires another build and Hosting deployment. Do not place sensitive or private files in `public/`; every hosted PDF is publicly accessible to anyone with its URL.

To prepare hosting later:

```bash
npm run build
firebase login
firebase use --add
firebase deploy --only firestore:rules,hosting
```

## Project structure

```text
src/
  components/       Shared UI and navigation components
  hooks/            Asynchronous data-loading hooks
  models/           Catalog domain models
  repositories/     Firestore collection access and future CRUD methods
  services/         Catalog orchestration and demo fallback
  lib/              Firebase and integration foundations
  pages/            Route-level pages
  styles/           Global responsive styling
```
