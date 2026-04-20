# Email templates Supabase · branding Cooky · Let Me Cook

8 templates Cooky-branded à coller dans Supabase Dashboard →
Authentication → Email Templates. Ou pushés en un coup via
`scripts/push-email-templates.sh`.

> **Note** · le projet Supabase `genius` est partagé avec l'app Genius
> d'Adam. Les templates ci-dessous branderont Let Me Cook pour TOUS les
> mails du projet (y compris Genius). Solution propre future ·
> conditionnel Go template `{{ if contains .ConfirmationURL "let-me-cook" }}`
> pour switcher entre 2 brandings.

## Variables disponibles (GoTrue)

- `{{ .ConfirmationURL }}` · URL complète avec redirect
- `{{ .Token }}` · code 6 chiffres (OTP)
- `{{ .TokenHash }}`
- `{{ .SiteURL }}` · base URL projet
- `{{ .Email }}` · email destinataire
- `{{ .NewEmail }}` · nouveau mail (change email)

## Cooky wrapper HTML (factorize pour tous les templates)

```html
<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Let Me Cook</title></head>
<body style="margin:0;padding:0;background:#EDE5D3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Geist,system-ui,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDE5D3;padding:40px 20px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#F6F1E8;border-radius:28px;padding:40px 32px;">
<tr><td align="center">

<!-- Cooky SVG -->
<svg viewBox="0 0 120 120" width="110" height="110" xmlns="http://www.w3.org/2000/svg">
<path d="M30 108 Q30 88 42 84 L78 84 Q90 88 90 108 Z" fill="#FBF8F1"/>
<path d="M44 82 L60 86 L76 82 L72 92 L60 90 L48 92 Z" fill="#C44536"/>
<circle cx="60" cy="66" r="18" fill="#E8C9A8"/>
<ellipse cx="50" cy="62" rx="2.2" ry="2.6" fill="#1A1511"/>
<ellipse cx="70" cy="62" rx="2.2" ry="2.6" fill="#1A1511"/>
<path d="M52 70 Q55 73 60 71 Q65 73 68 70 Q65 74 60 73 Q55 74 52 70 Z" fill="#3D342B"/>
<path d="M55 74 Q60 78 65 74" stroke="#1A1511" stroke-width="1.6" fill="none" stroke-linecap="round"/>
<rect x="42" y="48" width="36" height="6" rx="2" fill="#FBF8F1"/>
<circle cx="48" cy="38" r="11" fill="#FBF8F1"/>
<circle cx="72" cy="38" r="11" fill="#FBF8F1"/>
<circle cx="60" cy="32" r="13" fill="#FBF8F1"/>
<path d="M38 92 Q34 100 36 108" stroke="#FBF8F1" stroke-width="9" fill="none" stroke-linecap="round"/>
<path d="M82 92 Q86 100 84 108" stroke="#FBF8F1" stroke-width="9" fill="none" stroke-linecap="round"/>
</svg>

<h1 style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:44px;color:#1A1511;letter-spacing:-1.3px;margin:14px 0 6px;line-height:1;">
Let Me Cook
</h1>
<p style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:#D97A27;margin:0 0 24px;">
Parce que cuisiner c&rsquo;est s&rsquo;amuser.
</p>

{{ BODY_CONTENT }}

<hr style="border:none;border-top:1px solid rgba(26,21,17,0.08);margin:32px 0 20px;">
<p style="font-size:11px;color:#B8AD9A;line-height:1.5;margin:0;letter-spacing:0.3px;">
Tu n&rsquo;as pas demandé cet email ? Ignore-le, aucune action ne sera prise.
</p>
<p style="font-family:'Courier New',monospace;font-size:10px;color:#B8AD9A;letter-spacing:2px;text-transform:uppercase;margin:20px 0 0;">
· Cooky, le petit chef ·
</p>

</td></tr></table></td></tr></table></body></html>
```

Dans chaque template ci-dessous, remplace `{{ BODY_CONTENT }}` par le
contenu spécifique.

---

## 1 · Magic Link

**Subject** · `Cooky t'attend en cuisine · ton lien magique`

**Body** · wrapper + content ·

```html
<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">
Bienvenue chef,<br>Cooky a préparé ton lien magique. Clique pour entrer.
</p>
<a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;letter-spacing:0.3px;">
Entrer en cuisine →
</a>
<p style="font-size:11px;color:#7A6D5E;margin:24px 0 4px;">Ou copie ce lien ·</p>
<p style="font-family:'Courier New',monospace;font-size:10px;color:#7A6D5E;word-break:break-all;margin:0;">
{{ .ConfirmationURL }}
</p>
```

---

## 2 · Confirm Sign Up (si "confirm email" activé)

**Subject** · `Bienvenue chez Let Me Cook · confirme ton email`

**Body content** ·

```html
<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">
Bienvenue chef.<br>Un dernier clic avant de sortir la planche à découper.
</p>
<a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">
Activer mon compte →
</a>
<p style="font-size:11px;color:#7A6D5E;margin:24px 0 4px;">Ou colle ce lien dans ton navigateur ·</p>
<p style="font-family:'Courier New',monospace;font-size:10px;color:#7A6D5E;word-break:break-all;margin:0;">
{{ .ConfirmationURL }}
</p>
```

---

## 3 · Invite User

**Subject** · `{{ .Email }}, Cooky t'invite à cuisiner`

**Body content** ·

```html
<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">
Quelqu'un pense que tu mérites d'avoir Cooky en cuisine.<br>Accepte l'invitation pour créer ton compte.
</p>
<a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">
Accepter l'invitation →
</a>
```

---

## 4 · Change Email Address

**Subject** · `Confirme ton nouvel email · Let Me Cook`

**Body content** ·

```html
<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 12px;">
Tu changes ton email de <b>{{ .Email }}</b> vers <b>{{ .NewEmail }}</b>.
</p>
<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">
Confirme pour finaliser.
</p>
<a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">
Confirmer le changement →
</a>
```

---

## 5 · Reset Password

**Subject** · `Reset ton mot de passe · Let Me Cook`

**Body content** ·

```html
<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">
Tu as oublié ton mot de passe ? Ça arrive.<br>Clique pour en choisir un nouveau.
</p>
<a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">
Choisir un nouveau mot de passe →
</a>
```

---

## 6 · Reauthentication (OTP code, action sensible)

**Subject** · `Code Cooky · {{ .Token }}`

**Body content** ·

```html
<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 20px;">
Cooky veut vérifier que c'est bien toi avant cette action sensible.
</p>
<div style="background:#F3D9B1;padding:22px 32px;border-radius:16px;display:inline-block;">
<div style="font-family:'Courier New',monospace;font-size:40px;letter-spacing:12px;color:#1C1612;font-weight:700;">
{{ .Token }}
</div>
</div>
<p style="font-size:12px;color:#7A6D5E;margin:20px 0 0;">Le code expire dans 10 minutes.</p>
```

---

## 7 · Password Changed (notification)

**Subject** · `Ton mot de passe Let Me Cook a été changé`

**Body content** ·

```html
<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 20px;">
On t'informe que ton mot de passe vient d'être modifié.<br>Si ce n'est pas toi, <a href="mailto:hello@beloucif.com" style="color:#D97A27;">contacte-nous immédiatement</a>.
</p>
```

---

## 8 · Email Address Changed (notification)

**Subject** · `Ton email Let Me Cook a été changé`

**Body content** ·

```html
<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 20px;">
Ton email a été mis à jour vers <b>{{ .NewEmail }}</b>.<br>Si ce n'est pas toi, change ton mot de passe et <a href="mailto:hello@beloucif.com" style="color:#D97A27;">contacte-nous</a>.
</p>
```

---

## Push automatisé · `scripts/push-email-templates.sh`

Utilise le script ci-dessous · il PATCHe les 8 templates en un coup via
Supabase Management API. Nécessite un PAT (Personal Access Token).

```bash
export SUPABASE_PAT=sb_pat_xxxx  # depuis supabase.com/dashboard/account/tokens
bash scripts/push-email-templates.sh
```
