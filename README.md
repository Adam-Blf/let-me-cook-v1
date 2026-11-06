> **Depot consolide.** Version 1 en PWA, remplacee par l'application mobile.
>
> Le developpement se poursuit sur **[let-me-cook](https://github.com/Adam-Blf/let-me-cook)**.
> Ce depot est conserve en archive pour son historique.

# Let Me Cook

<!-- adam-badges:start -->
[![version](https://img.shields.io/badge/version-0.1.0-163767?style=flat-square)](CHANGELOG.md)
[![commits](https://img.shields.io/github/commit-activity/t/Adam-Blf/let-me-cook-v1?color=001329&label=commits&style=flat-square)](https://github.com/Adam-Blf/let-me-cook-v1/commits) [![visites](https://hits.sh/github.com/Adam-Blf/let-me-cook-v1.svg?style=flat-square&label=visites&color=001329)](https://hits.sh/github.com/Adam-Blf/let-me-cook-v1/) [![last commit](https://img.shields.io/github/last-commit/Adam-Blf/let-me-cook-v1?color=D4A437&style=flat-square&label=dernier%20push)](https://github.com/Adam-Blf/let-me-cook-v1/commits) [![top language](https://img.shields.io/github/languages/top/Adam-Blf/let-me-cook-v1?style=flat-square)](https://github.com/Adam-Blf/let-me-cook-v1) [![license](https://img.shields.io/github/license/Adam-Blf/let-me-cook-v1?style=flat-square&color=D4A437)](LICENSE)
<!-- adam-badges:end -->


![Status](https://img.shields.io/badge/status-production-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)
![Last Commit](https://img.shields.io/github/last-commit/Adam-Blf/let-me-cook-v1)

PWA Next.js 16 qui extrait et structure des recettes depuis des videos YouTube. Recupere la transcription de la video, puis organise ingredients, etapes et notes via un LLM pour une cuisine sans friction.

## Architecture

```mermaid
flowchart TB
    USER["PWA Next.js 16<br/>App Router"]
    ADD["app/(app)/add<br/>saisie d'une URL YouTube"]
    EXTRACT["app/api/extract<br/>controle session et abonnement"]
    LLM["lib/extract.ts<br/>transcription YouTube + LLM Groq"]
    REFUS["Refus<br/>401 non connecte, 402 abonnement requis, 400 URL non YouTube"]
    PAY["app/paywall<br/>Stripe Payment Links"]
    SUPA[("Supabase<br/>auth, profils, recettes")]
    COOK["app/recipe/[id]<br/>mode cuisine, nutrition, fin de recette"]

    USER --> ADD --> EXTRACT
    EXTRACT -->|requete refusee| REFUS
    REFUS -->|402| PAY
    EXTRACT --> LLM -->|recette structuree| SUPA
    SUPA --> COOK

    classDef input fill:#2563eb,stroke:#1e3a8a,color:#fff
    classDef process fill:#7c3aed,stroke:#4c1d95,color:#fff
    classDef store fill:#f59e0b,stroke:#92400e,color:#111
    classDef ok fill:#16a34a,stroke:#14532d,color:#fff
    classDef error fill:#dc2626,stroke:#7f1d1d,color:#fff
    class USER,ADD input
    class EXTRACT,LLM,PAY process
    class SUPA store
    class COOK ok
    class REFUS error
```

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (auth, Postgres, storage)
- Stripe (paiements abonnement)
- LLM pour extraction structuree de recettes
- PWA installable (offline-ready)

## Demo

A venir sur `letmecook.beloucif.com`.

## Installation

```bash
git clone https://github.com/Adam-Blf/let-me-cook-v1
cd let-me-cook-v1
npm install
cp .env.example .env.local  # remplir Supabase + Stripe + LLM keys
npm run dev
```

Ouvrir `http://localhost:3000`.

En local, `next.config.ts` charge aussi le fichier de secrets central
`~/.secrets/projets.env` s'il existe (chemin modifiable par `CENTRAL_ENV_FILE`),
sans jamais ecraser une variable deja definie. Les cles partagees entre projets
portent le prefixe `LETMECOOK` : `NEXT_PUBLIC_LETMECOOK_SUPABASE_URL`,
`NEXT_PUBLIC_LETMECOOK_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_LETMECOOK_APP_URL`.

## Fonctionnalites

- Import de videos recettes YouTube via URL (Instagram et TikTok non supportes en V1)
- Extraction automatique ingredients + etapes + temps de cuisson
- Sauvegarde dans bibliotheque personnelle (Supabase)
- Mode hors-ligne PWA
- Abonnement premium via Stripe
- Auth email + OAuth

## Scripts

- `npm run dev` - dev server
- `npm run build` - build production
- `npm run lint` - ESLint

## Licence

MIT

---

<p align="center">
  <sub>Par <a href="https://adam.beloucif.com">Adam Beloucif</a> - Data Engineer & Fullstack Developer - <a href="https://github.com/Adam-Blf">GitHub</a> - <a href="https://www.linkedin.com/in/adambeloucif/">LinkedIn</a></sub>
</p>
