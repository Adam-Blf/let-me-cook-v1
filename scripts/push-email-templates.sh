#!/usr/bin/env bash
# Push les 8 templates email Cooky-branded vers Supabase (projet genius).
# Usage ·
#   export SUPABASE_PAT=sb_pat_xxxx
#   bash scripts/push-email-templates.sh
#
# Le PAT se génère sur https://supabase.com/dashboard/account/tokens
set -euo pipefail

: "${SUPABASE_PAT:?Missing SUPABASE_PAT · crée-le sur supabase.com/dashboard/account/tokens}"
PROJECT_REF="iabeiakagjrczlahdfld"
API="https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth"

cooky_header() {
cat <<'EOF'
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Let Me Cook</title></head><body style="margin:0;padding:0;background:#EDE5D3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Geist,system-ui,sans-serif;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDE5D3;padding:40px 20px;"><tr><td align="center"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#F6F1E8;border-radius:28px;padding:40px 32px;"><tr><td align="center"><svg viewBox="0 0 120 120" width="110" height="110" xmlns="http://www.w3.org/2000/svg"><path d="M30 108 Q30 88 42 84 L78 84 Q90 88 90 108 Z" fill="#FBF8F1"/><path d="M44 82 L60 86 L76 82 L72 92 L60 90 L48 92 Z" fill="#C44536"/><circle cx="60" cy="66" r="18" fill="#E8C9A8"/><ellipse cx="50" cy="62" rx="2.2" ry="2.6" fill="#1A1511"/><ellipse cx="70" cy="62" rx="2.2" ry="2.6" fill="#1A1511"/><path d="M52 70 Q55 73 60 71 Q65 73 68 70 Q65 74 60 73 Q55 74 52 70 Z" fill="#3D342B"/><path d="M55 74 Q60 78 65 74" stroke="#1A1511" stroke-width="1.6" fill="none" stroke-linecap="round"/><rect x="42" y="48" width="36" height="6" rx="2" fill="#FBF8F1"/><circle cx="48" cy="38" r="11" fill="#FBF8F1"/><circle cx="72" cy="38" r="11" fill="#FBF8F1"/><circle cx="60" cy="32" r="13" fill="#FBF8F1"/><path d="M38 92 Q34 100 36 108" stroke="#FBF8F1" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M82 92 Q86 100 84 108" stroke="#FBF8F1" stroke-width="9" fill="none" stroke-linecap="round"/></svg><h1 style="font-family:Georgia,serif;font-style:italic;font-size:44px;color:#1A1511;letter-spacing:-1.3px;margin:14px 0 6px;line-height:1;">Let Me Cook</h1><p style="font-family:Georgia,serif;font-style:italic;font-size:16px;color:#D97A27;margin:0 0 24px;">Parce que cuisiner c&rsquo;est s&rsquo;amuser.</p>
EOF
}

cooky_footer() {
cat <<'EOF'
<hr style="border:none;border-top:1px solid rgba(26,21,17,0.08);margin:32px 0 20px;"><p style="font-size:11px;color:#B8AD9A;line-height:1.5;margin:0;letter-spacing:0.3px;">Tu n&rsquo;as pas demand&eacute; cet email ? Ignore-le.</p><p style="font-family:'Courier New',monospace;font-size:10px;color:#B8AD9A;letter-spacing:2px;text-transform:uppercase;margin:20px 0 0;">&middot; Cooky, le petit chef &middot;</p></td></tr></table></td></tr></table></body></html>
EOF
}

render() {
  local body_content="$1"
  { cooky_header; echo "$body_content"; cooky_footer; } | tr -d '\n'
}

MAGIC_LINK=$(render '<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">Bienvenue chef,<br>Cooky a pr&eacute;par&eacute; ton lien magique. Clique pour entrer.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">Entrer en cuisine &rarr;</a>')

CONFIRMATION=$(render '<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">Bienvenue chef.<br>Un dernier clic avant de sortir la planche &agrave; d&eacute;couper.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">Activer mon compte &rarr;</a>')

INVITE=$(render '<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">Quelqu&rsquo;un pense que tu m&eacute;rites Cooky en cuisine.<br>Accepte l&rsquo;invitation pour cr&eacute;er ton compte.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">Accepter l&rsquo;invitation &rarr;</a>')

EMAIL_CHANGE=$(render '<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 12px;">Tu changes ton email de <b>{{ .Email }}</b> vers <b>{{ .NewEmail }}</b>.</p><p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">Confirme pour finaliser.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">Confirmer le changement &rarr;</a>')

RECOVERY=$(render '<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 28px;">Tu as oubli&eacute; ton mot de passe ? &Ccedil;a arrive.<br>Clique pour en choisir un nouveau.</p><a href="{{ .ConfirmationURL }}" style="display:inline-block;background:#D97A27;color:#1C1612;padding:16px 36px;border-radius:999px;font-weight:600;text-decoration:none;font-size:15px;">Choisir un nouveau mot de passe &rarr;</a>')

REAUTH=$(render '<p style="font-size:16px;color:#3D342B;line-height:1.55;margin:0 0 20px;">Cooky v&eacute;rifie que c&rsquo;est bien toi avant cette action sensible.</p><div style="background:#F3D9B1;padding:22px 32px;border-radius:16px;display:inline-block;"><div style="font-family:Courier,monospace;font-size:40px;letter-spacing:12px;color:#1C1612;font-weight:700;">{{ .Token }}</div></div><p style="font-size:12px;color:#7A6D5E;margin:20px 0 0;">Le code expire dans 10 minutes.</p>')

# Construit le payload JSON
payload=$(cat <<JSON
{
  "site_url": "https://let-me-cook-v1.vercel.app",
  "uri_allow_list": "https://let-me-cook-v1.vercel.app/**,https://let-me-cook-v1-*.vercel.app/**",
  "mailer_subjects_magic_link": "Cooky t'attend en cuisine · ton lien magique",
  "mailer_subjects_confirmation": "Bienvenue chez Let Me Cook · confirme ton email",
  "mailer_subjects_invite": "Cooky t'invite à cuisiner",
  "mailer_subjects_email_change": "Confirme ton nouvel email · Let Me Cook",
  "mailer_subjects_recovery": "Reset ton mot de passe · Let Me Cook",
  "mailer_subjects_reauthentication": "Code Cooky · {{ .Token }}",
  "mailer_templates_magic_link_content": $(printf '%s' "$MAGIC_LINK" | python -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
  "mailer_templates_confirmation_content": $(printf '%s' "$CONFIRMATION" | python -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
  "mailer_templates_invite_content": $(printf '%s' "$INVITE" | python -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
  "mailer_templates_email_change_content": $(printf '%s' "$EMAIL_CHANGE" | python -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
  "mailer_templates_recovery_content": $(printf '%s' "$RECOVERY" | python -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
  "mailer_templates_reauthentication_content": $(printf '%s' "$REAUTH" | python -c 'import sys,json; print(json.dumps(sys.stdin.read()))')
}
JSON
)

echo "→ PATCHing auth config sur ${PROJECT_REF}..."
curl -sS -X PATCH "$API" \
  -H "Authorization: Bearer $SUPABASE_PAT" \
  -H "Content-Type: application/json" \
  -d "$payload" \
  | python -c 'import sys,json; d=json.load(sys.stdin); print("✓ site_url:", d.get("site_url")); print("✓ uri_allow_list:", d.get("uri_allow_list")); print("✓ templates updated · magic_link, confirmation, invite, email_change, recovery, reauthentication")'
