export const PAYMENT_LINKS = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_MONTHLY!,
  yearly: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_YEARLY!,
  lifetime: process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LIFETIME!,
} as const;

export type PlanKey = keyof typeof PAYMENT_LINKS;

export const PLANS = {
  monthly: {
    name: 'Mensuel',
    priceLabel: '7,99 €',
    period: 'par mois',
    monthlyEquivalent: '7,99 €/mois',
    trialDays: 7,
  },
  yearly: {
    name: 'Annuel',
    priceLabel: '39,99 €',
    period: 'par an · économise 58 %',
    monthlyEquivalent: '3,33 €/mois',
    badge: 'LE PLUS POPULAIRE',
    trialDays: 7,
  },
  lifetime: {
    name: 'À vie',
    priceLabel: '99,99 €',
    period: 'paiement unique',
    monthlyEquivalent: 'une fois, jamais renouvelé',
    badge: 'EARLY BIRD',
  },
} as const;

export const FEATURES = [
  { icon: '∞', label: 'Extractions illimitées' },
  { icon: '▶', label: 'YouTube (Shorts + tutos longs)' },
  { icon: '✎', label: 'Éditeur de recette manuelle' },
  { icon: '◌', label: 'Cook mode mains libres + timers' },
  { icon: '☰', label: 'Liste de courses groupée par rayon' },
  { icon: '♥', label: 'Bibliothèque sync cross-device' },
];
