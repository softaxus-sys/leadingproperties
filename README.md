# Leading Properties — website

Next.js (App Router) + TypeScript + Tailwind CSS + lucide-react. No database, no CMS, no auth,
no backend. Property listings come from Vrodux ERP; the rest of the content (projects, team,
company details) lives in JSON files, images in `public/images/`.

Rebuilt from the old WordPress site (mirror in `../ExistingWebsite`): its copy, listings, team,
reviews, developer logos and photography were carried over.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3100
npm run build && npm start
```

## Content

| File | What |
|---|---|
| `src/data/projects.json` | New / off-plan projects |
| `src/data/team.json` | Sales team |
| `src/data/site.json` | Company details, contact, socials, CEO message, reviews, developer logos |

## Listings: from Vrodux ERP

Pages never call the API directly — they call `getListings()` / `getListing(slug)` from
`src/lib/listings`:

```
src/lib/listings/
  types.ts          Listing type + ListingsSource interface (the contract)
  vrodux-source.ts  reads the Vrodux Real Estate website API
  index.ts          selects the source; filtering and sorting
```

Set in `.env.local` (or the host's environment):

```
VRODUX_API_URL=https://erp.vrodux.com
VRODUX_API_KEY=<key from Vrodux ERP → Real Estate → Website>
VRODUX_REVALIDATE_SECONDS=300
```

The adapter calls `GET /api/real-estate/website/properties` with the key in the `X-Api-Key`
header, and turns every unit with an asking rent or sale price into a listing. The key belongs
to one workspace and is locked to one website address in the ERP; keep it in server
environment variables only. Photos use the signed URLs the API returns (their host is allowed
for `next/image` automatically from `VRODUX_API_URL`). Pages are cached and
refetched every `VRODUX_REVALIDATE_SECONDS`.

Before switching production over, check against a real response: the unit of
`PropertyUnit.Area` (the site assumes sq.ft.), the residential/commercial mapping, and that
the tenant has properties published to the website in the ERP.

## Enquiries

There is no backend, so the enquiry forms open WhatsApp or the visitor's email client with the
details pre-filled (`src/components/EnquiryForm.tsx`). To send leads straight into Vrodux CRM
later, add a server route that relays to the CRM inbound URL and keep that URL server-side.

## Before going live

- [ ] Check listing prices and photos (see notes in the handover — some carried-over data looks wrong).
- [ ] Replace project placeholder descriptions (Binghatti, Flare, Damac, Meraas, Sobha, Reportage) with real copy.
- [ ] Add RERA ORN / trade licence number to the footer.
- [ ] Set `NEXT_PUBLIC_SITE_URL`.
