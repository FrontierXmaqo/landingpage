# Project photos — Commercial & Industrial page

Photos for the six reference projects on `/commercial-and-industrial`.

Drop the files in this folder using the filenames below, then set the
matching `image` field in
`app/[lang]/(main)/commercial-and-industrial/content.ts`:

| Filename              | Project                     | Capacity   |
| --------------------- | --------------------------- | ---------- |
| `spritzer.*`          | Spritzer                    | 1,071 kWp  |
| `bermaz.*`            | Bermaz Motor Trading        | 159.72 kWp |
| `khe-beng.*`          | SRJK (C) Khe Beng           | 185.13 kWp |
| `1doc-medical.*`      | 1 Doc Medical Group Sdn Bhd | 26 kWp     |
| `surau-at-taqwa.*`    | Surau At-Taqwa              | 6.96 kWp   |
| `amcorp-gemas.*`      | Amcorp Gemas Solar Plant    | 10.25 MWp  |

JPEG or PNG is fine to commit — convert to `.webp` at roughly 800x520
before wiring it up, the same way the hero and partner logos are already
self-hosted. Until a card's `image` is set it falls back to a branded
tile carrying its category icon, so a missing photo never breaks the row.

Self-hosted rather than hotlinked on purpose: the partner logos and the
hero were moved here after CDN paths on the old site broke and silently
emptied parts of the page.
