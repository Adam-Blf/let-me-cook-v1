# Email templates Supabase · branding Cooky

Coller dans Supabase Dashboard · Authentication → Email Templates.

## Magic Link (most important)

**Subject** ·
```
Cooky t'attend en cuisine · ton lien magique
```

**Body (HTML)** ·

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Let Me Cook</title>
</head>
<body style="margin:0;padding:0;background:#EDE5D3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Geist,system-ui,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDE5D3;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#F6F1E8;border-radius:28px;padding:40px 32px;">
          <tr><td align="center">
            <!-- Cooky -->
            <svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
              <path d="M30 108 Q30 88 42 84 L78 84 Q90 88 90 108 Z" fill="#FBF8F1"/>
              <path d="M44 82 L60 86 L76 82 L72 92 L60 90 L48 92 Z" fill="#C44536"/>
              <circle cx="60" cy="66" r="18" fill="#E8C9A8"/>
              <path d="M46 63 Q50 58 54 63" stroke="#1A1511" stroke-width="1.8" fill="none" stroke-linecap="round"/>
              <path d="M66 63 Q70 58 74 63" stroke="#1A1511" stroke-width="1.8" fill="none" stroke-linecap="round"/>
              <path d="M52 70 Q55 73 60 71 Q65 73 68 70 Q65 74 60 73 Q55 74 52 70 Z" fill="#3D342B"/>
              <path d="M55 74 Q60 78 65 74" stroke="#1A1511" stroke-width="1.6" fill="none" stroke-linecap="round"/>
              <rect x="42" y="48" width="36" height="6" rx="2" fill="#FBF8F1"/>
              <circle cx="48" cy="38" r="11" fill="#FBF8F1"/>
              <circle cx="72" cy="38" r="11" fill="#FBF8F1"/>
              <circle cx="60" cy="32" r="13" fill="#FBF8F1"/>
              <path d="M38 92 Q34 100 36 108" stroke="#FBF8F1" stroke-width="9" fill="none" stroke-linecap="round"/>
              <path d="M82 92 Q92 80 96 68" stroke="#FBF8F1" stroke-width="9" fill="none" stroke-linecap="round"/>
              <circle cx="97" cy="66" r="5" fill="#E8C9A8"/>
            </svg>

            <h1 style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:48px;color:#1A1511;letter-spacing:-1.5px;margin:16px 0 8px;line-height:1;">
              Let Me Cook
            </h1>

            <p style="font-family:Georgia,serif;font-style:italic;font-size:18px;color:#D97A27;margin:0 0 32px;">
              Parce que cuisiner c&rsquo;est s&rsquo;amuser.
            </p>

            <p style="font-size:16px;color:#3D342B;line-height:1.5;margin:0 0 8px;">
              Bienvenue,
            </p>
            <p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">
              Cooky a préparé ton lien magique. Clique ci-dessous pour te connecter et transformer ta première vidéo YouTube en vraie recette.
            </p>

            <a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;letter-spacing:0.3px;">
              Entrer en cuisine →
            </a>

            <p style="font-size:12px;color:#7A6D5E;margin:32px 0 0;line-height:1.5;">
              Ou copie ce lien dans ton navigateur ·
            </p>
            <p style="font-family:'Courier New',monospace;font-size:11px;color:#7A6D5E;word-break:break-all;margin:4px 0 0;">
              {{ .ConfirmationURL }}
            </p>

            <hr style="border:none;border-top:1px solid rgba(26,21,17,0.08);margin:32px 0 20px;">

            <p style="font-size:11px;color:#B8AD9A;line-height:1.5;margin:0;letter-spacing:0.3px;">
              Tu n&rsquo;as pas demandé ce lien ? Ignore cet email, personne ne pourra se connecter sans cliquer dessus.
            </p>

            <p style="font-family:'Courier New',monospace;font-size:10px;color:#B8AD9A;letter-spacing:2px;text-transform:uppercase;margin:24px 0 0;">
              · Cooky, le petit chef ·
            </p>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

## Confirm Signup (si tu actives "confirm email")

**Subject** · `Bienvenue chez Let Me Cook · active ton compte`

Même body HTML que Magic Link, avec :
- Titre H1 remplacé par "Bienvenue, chef."
- Paragraphe · "Confirme ton email pour commencer à extraire des recettes."
- CTA · "Activer mon compte →"

## Recovery (mot de passe oublié · pas utilisé en magic link flow)

Pas nécessaire pour l'instant puisqu'on utilise magic link sans password.

## Étapes de config dans Supabase Dashboard

1. Ouvre https://supabase.com/dashboard/project/iabeiakagjrczlahdfld
2. Authentication → URL Configuration
   - **Site URL** · `https://let-me-cook-v1.vercel.app`
   - **Redirect URLs** · ajoute `https://let-me-cook-v1.vercel.app/**`
3. Authentication → Email Templates → Magic Link
   - Remplace Subject + Body par le HTML ci-dessus
4. Save · le prochain magic link arrivera branded Cooky et pointera vers
   la bonne URL prod (plus de localhost).

## Custom SMTP (plus tard, pour prod)

Supabase free tier limite à 3 mails/heure via leur SMTP partagé. Pour
plus de volume :
- Gratuit · [Resend](https://resend.com) 3000 mails/mois
- Ou Sendgrid free tier · 100 mails/jour
- Ou Brevo · 300 mails/jour gratuit

Configure dans Authentication → Emails → SMTP Settings.
