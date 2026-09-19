# Mohamed Islam Showcase

An interactive portfolio for Mohamed Islam, a software engineer at ESI — the National Higher School of Computer Science in Algeria.

The experience combines a responsive 3D workspace, a retro computer interface, and a dedicated mobile portfolio. It presents selected web, mobile, game, and AI projects with real screenshots, demos, source links, and Android downloads.

## Highlights

- Responsive Three.js workspace with touch-friendly mobile controls
- Interactive retro desktop embedded in the computer monitor
- Mobile-first portfolio with About, Experience, Projects, and Contact pages
- Galleries for WorldLens, ChronoLivre, Sanad, Wasslago, LeadAgent, Quantum Tutor, The Outsider, and My Vault
- Working WhatsApp and email contact options
- Vercel serverless contact endpoint using Resend

## Local development

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3000`.

## Production build

```bash
npm run typecheck
npm run build
npm start
```

Copy `.env.example` to `.env` and add a Resend API key to enable email delivery locally. Environment secrets are excluded from Git.

## Deployment

The project is configured for Vercel. The build generates the complete site in `public/`, while `api/contact.js` provides the production contact endpoint.

## Author

[Mohamed Islam](https://github.com/eng-Islam-Mohamed)
