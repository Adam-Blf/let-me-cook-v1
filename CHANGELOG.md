# Changelog

Toutes les evolutions notables de ce depot sont consignees ici.
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), versions : [SemVer](https://semver.org/lang/fr/).

## [0.1.0] - 2026-11-06

Version 1 en PWA, conservee en archive. Le developpement continue sur [let-me-cook](https://github.com/Adam-Blf/let-me-cook).

### Ajoute

- PWA Next.js 16 (App Router) : bibliotheque, recherche, liste de courses, profil, compte, ajout, editeur, onboarding, mode cuisine, fin de recette, nutrition, page hors ligne.
- Extraction de recette depuis une URL YouTube : transcription de la video puis structuration par un LLM Groq (`app/api/extract`, `lib/extract.ts`).
- Authentification Supabase par lien magique et modeles de courriels personnalises.
- Paywall vers Stripe Payment Links, acces conditionne au champ `subscription_active` du profil.
- Substitutions d'ingredients, partage vers l'application et invite d'installation.
- Variables d'environnement a nom unique prefixees `LETMECOOK`.
- README vitrine (badge de version, architecture Mermaid coloree), changelog et workflow de release sur tag.
