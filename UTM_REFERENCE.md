# UTM Reference — ethantouch.com

Paste-ready URLs for every surface where the ethantouch.com link appears.
All mediums below are GA4-canonical, so traffic routes to the right Default
Channel Group without any custom rules.

---

## Email signature (Gmail)

```
https://ethantouch.com/?utm_source=email-signature&utm_medium=email&utm_campaign=signature
```

## LinkedIn — profile fields

Featured link, About section, Contact Info → Website:

```
https://ethantouch.com/?utm_source=linkedin&utm_medium=social&utm_campaign=profile
```

## LinkedIn — DMs and posts

Outbound DM (replace per conversation if you want finer tracking):

```
https://ethantouch.com/?utm_source=linkedin&utm_medium=social&utm_campaign=dm-outbound
```

Public post or comment:

```
https://ethantouch.com/?utm_source=linkedin&utm_medium=social&utm_campaign=post
```

## Resume PDF (the link inside the PDF)

```
https://ethantouch.com/?utm_source=resume&utm_medium=referral&utm_campaign=resume-pdf
```

## Cover letter (hyperlinks inside the Google Doc)

```
https://ethantouch.com/?utm_source=cover-letter&utm_medium=referral&utm_campaign=job-apps
```

## Instagram bio (@findingmyedge)

```
https://ethantouch.com/?utm_source=instagram&utm_medium=social&utm_campaign=profile
```

## Job boards (Indeed, ZipRecruiter, Wellfound, Otta, Built In, etc.)

Swap `indeed` for the actual board name in the source value:

```
https://ethantouch.com/?utm_source=indeed&utm_medium=referral&utm_campaign=job-boards
```

## Outbound cold/pitch email (case-by-case)

Pattern — replace `client-name` and `MMyyyy`:

```
https://ethantouch.com/?utm_source=pitch&utm_medium=email&utm_campaign=client-name-MMyyyy
```

The Collars pitch already uses this pattern:

```
https://ethantouch.com/lab/emails/collars/?utm_source=pitch&utm_medium=email&utm_campaign=collars-may2026
```

---

## Why these mediums (GA4 canonical list)

GA4 only auto-classifies these medium values into channels:

| Medium     | Routes to channel |
|------------|-------------------|
| `email`    | Email             |
| `social`   | Organic Social    |
| `referral` | Referral          |
| `cpc`      | Paid Search       |
| `display`  | Display           |
| `organic`  | Organic Search    |
| `affiliate`| Affiliates        |
| `video`    | Organic Video     |
| `audio`    | Audio             |

Anything else (newsletter, outbound, blast, dm, etc.) lands in **Unassigned**.
Stick to the medium values above. Vary the source and campaign freely.

---

## Audit interval

Re-check every surface quarterly. Sources to verify quickly:

- Gmail → Settings → General → Signature
- LinkedIn → View Profile → Edit pencil on each section
- Google Drive → resume PDF → open link, inspect
- Google Drive → cover letter Google Doc → click each link
- github.com/woofwallee → Edit profile
- Each job-board profile

---

Last updated: 2026-05-14
