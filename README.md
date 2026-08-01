> **Depot consolide.** Version 1 en PWA, remplacee par l'application mobile.
>
> Le developpement se poursuit sur **[let-me-cook](https://github.com/Adam-Blf/let-me-cook)**.
> Ce depot est conserve en archive pour son historique.

# Let Me Cook

[![version](https://img.shields.io/badge/version-0.1.0-000091?style=flat-square)](https://github.com/Adam-Blf/let-me-cook-v1/releases)

<!-- adam-badges:start -->
[![commits](https://img.shields.io/github/commit-activity/t/Adam-Blf/let-me-cook-v1?color=001329&label=commits&style=flat-square)](https://github.com/Adam-Blf/let-me-cook-v1/commits) [![visites](https://hits.sh/github.com/Adam-Blf/let-me-cook-v1.svg?style=flat-square&label=visites&color=001329)](https://hits.sh/github.com/Adam-Blf/let-me-cook-v1/) [![last commit](https://img.shields.io/github/last-commit/Adam-Blf/let-me-cook-v1?color=D4A437&style=flat-square&label=dernier%20push)](https://github.com/Adam-Blf/let-me-cook-v1/commits) [![top language](https://img.shields.io/github/languages/top/Adam-Blf/let-me-cook-v1?style=flat-square)](https://github.com/Adam-Blf/let-me-cook-v1) [![license](https://img.shields.io/github/license/Adam-Blf/let-me-cook-v1?style=flat-square&color=D4A437)](LICENSE)
<!-- adam-badges:end -->


![Status](https://img.shields.io/badge/status-production-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)
![Last Commit](https://img.shields.io/github/last-commit/Adam-Blf/let-me-cook-v1)

PWA Next.js 16 qui extrait et structure des recettes depuis des videos YouTube et Instagram. Scrape audio, transcrit, puis organise ingredients, etapes, et notes via LLM pour une cuisine sans friction.

## Architecture

```mermaid
flowchart TB
    USER["PWA Next.js 16<br/>App Router - offline-ready"]
    ADD["app/(app)/add<br/>saisie URL YouTube / Instagram"]
    EXTRACT["app/api/extract<br/>lib/extract.ts - transcript + LLM Groq"]
    RECIPE["Recette structuree<br/>ingredients - etapes - temps"]
    SUPA["Supabase<br/>auth - Postgres - storage - bibliotheque"]
    COOK["app/recipe/[id]/cook<br/>mode cuisine - liste courses - nutrition"]
    PAY["app/paywall + Stripe<br/>abonnement premium - lib/tokens.ts"]

    USER --> ADD --> EXTRACT --> RECIPE --> SUPA
    SUPA --> COOK
    USER --> PAY
    PAY -.quota.-> EXTRACT
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

## Fonctionnalites

- Import de videos recettes YouTube / Instagram via URL
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


## Star History

<a href="https://www.star-history.com/?repos=Adam-Blf%2Flet-me-cook-v1&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=Adam-Blf/let-me-cook-v1&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=Adam-Blf/let-me-cook-v1&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=Adam-Blf/let-me-cook-v1&type=date&legend=top-left" />
 </picture>
</a>
