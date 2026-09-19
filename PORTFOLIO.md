# Mohamed Islam — Interactive Portfolio

A personalized version of Henry Heffernan's 3D computer portfolio, using both original repositories. The room, models, textures, camera transitions, CRT effects, sounds, desktop windows, and styling are retained. The boot screen, showcase, biography, ESI education, projects, contact, OS name, favicon, and word game are personalized for Mohamed Islam.

## Run

Requires Node.js 22.15+ LTS or 24+ LTS.

```sh
npm run install:all
npm run build
npm start
```

Open http://127.0.0.1:3000. Click START, then click to approach the desk and computer. The desktop is also directly available at http://127.0.0.1:3000/os/.

Development: `npm run dev` starts the room on port 3000 and the inner Vite app on port 5173. The room proxies `/os` to the inner app. Stop the production server before starting development.

## Personal information

- Mohamed Islam, software engineer from ESI — National Higher School of Computer Science, Algeria.
- GitHub: https://github.com/eng-Islam-Mohamed
- Email: nm_benaboud@esi.dz (public contact address on WorldLens).
- WorldLens: https://world-between-your-hands.vercel.app · repository: Worldlens.
- ChronoLivre: https://chronolivre-ai.vercel.app · repository: History.

Edit `inner-site/src/components/showcase/` for content. Shared project data is in `projects/projectData.ts`; `Projects.tsx`, `Experience.tsx`, and `projects/Software.tsx` use that list. Screenshots are in `inner-site/public/projects/` and Android downloads are in `inner-site/public/downloads/`. Boot text is in `src/Application/UI/components/LoadingScreen.tsx`; room information is in `InfoOverlay.tsx`.

## Expanded project collection — September 18, 2026

Eight projects: WorldLens, ChronoLivre, Sanad, Wasslago, LeadAgent, Quantum Tutor, The Outsider Game, and My Vault. Galleries have selectable thumbnails and full-resolution picture links. Existing retro styling and the 3D scene remain intact.

- WorldLens: original landing capture plus public features and workflow captures. Its AI search service was unavailable during capture.
- ChronoLivre: original home/dossier captures plus public search and comparison workspaces. Research generation requires sign-in.
- Sanad: the two user-supplied `Downloads/sd` and `Downloads/sdd` pictures, with the user's APK copied as `sanad.apk`.
- Wasslago: existing browser proof captures from the local `Desktop/wassla go` project. The actual application/repository brand is Wasslago. Its repository is private.
- LeadAgent: live patient website and empty appointment request form; automation descriptions match the local workflow README. No appointment was submitted.
- Quantum Tutor: actual application served locally from the supplied private repository, with home and assistant screenshots. No AI question was submitted and no report email was sent.
- The Outsider Game: existing home, voting, and results captures from `Desktop/bra/recent_game_screenshots`, plus the user's release APK as `the-outsider.apk`.
- My Vault: isolated local web and responsive mobile captures from the repository's Flutter web build. Cloud connections were blocked; the account label was replaced with `demo@example.com` in the local preview only. Captures show sample welcome content and an empty item editor. No production link or APK is offered for Vault.

Private source checkouts used for captures are under `artifacts/sources/`, outside the served `public/` directory. The source preview servers are temporary and are not needed to run the portfolio. Private GitHub repositories are labeled accordingly in the showcase.

The contact form prepares an email draft addressed to Mohamed Islam. The visitor sends it from their email application. It does not submit to Henry's server. No resume was supplied, so the original resume strip links to Mohamed's GitHub. No employment history, graduation date, or project metrics have been invented.

## Structure and attribution

- `src/`, `static/`, `bundler/`: original Three.js room and its interface.
- `inner-site/`: original React desktop, built with Vite while preserving its components and CSS.
- `server/index.cjs`: serves the room and desktop from one origin.
- `scripts/copy-inner.cjs`: copies the built desktop to `public/os`.
- `public/`: generated production build.

Original personal photographs, art, music, and resume pages are not part of the active showcase. The physical computer's baked manufacturer mark and other scene textures are retained from the original model.

Original experience, composition, shaders, desktop, and interaction design: Henry Heffernan.

- https://github.com/henryjeff/portfolio-website
- https://github.com/henryjeff/portfolio-inner-site
- https://henryheffernan.com/

The MIT notice is preserved in `LICENSE.md`; original scene and audio credits remain in the desktop Credits application. Content and selected projects are personalized for Mohamed Islam. Original upstream READMEs are retained.

The outer dependency audit reports zero vulnerabilities. The inner app retains React Router 6 for compatibility; its audit reports two moderate advisories involving untrusted navigation input and SSR hydration. This app uses static internal routes and client-side rendering.

The previous portfolio is archived at `../portfolio-previous`: automatic approval review blocked permanent recursive deletion. It is not part of the active site.
