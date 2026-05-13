# Decision Log — IEEE Hardware Club Verification Bot

> Every architectural decision made during planning, with the reasoning preserved.
> Date: May 12, 2026

---

## Decision 1: Open Server + Verify Inside (vs. Invite-Gate)

**Chosen:** Open server with bot-based email verification for role assignment
**Rejected:** Website-generated single-use Discord invite links emailed to users

**Why:** The invite-gate approach had four compounding failure modes:
1. Invites could leak (shared before use)
2. Discord invite creation API has rate limits (problematic after events)
3. SMTP failures blocked server access entirely
4. Website backend had to be online for Discord access to work

The new approach decouples the website from Discord access entirely. The website just has a static invite link. Verification is self-contained inside Discord.

---

## Decision 2: In-Memory Map (vs. Redis)

**Chosen:** JavaScript `Map` with `setTimeout` TTL cleanup
**Rejected:** Redis

**Why:** The bot is a single Node.js process serving a club of ~250 members. Peak verification volume is ~50 users after a major event. Redis adds: a service to install, configure, and keep running — with zero benefit at this scale. No clustering, no pub/sub, no persistence needed for ephemeral OTPs.

The tradeoff: if the bot process restarts, pending OTPs are lost. Users simply re-click the verify button. This is a minor inconvenience (not data loss) that occurs rarely.

**Resume note:** Using Redis here would signal to experienced recruiters that the developer doesn't evaluate tradeoffs — they collect buzzwords. Choosing simplicity and being able to articulate WHY demonstrates more engineering maturity.

---

## Decision 3: SQLite (vs. MongoDB/PostgreSQL)

**Chosen:** SQLite via `better-sqlite3`
**Rejected:** MongoDB ($50 Atlas credit available), PostgreSQL

**Why:** The database stores exactly one table: `verified_users(discord_id, email, verified_at)`. For ~250 rows with two indexed columns, SQLite is the correct tool. Zero config, single file, no connection management, no server process, survives restarts, easy to back up (copy one file).

MongoDB or PostgreSQL would add: a database server to install/manage, connection pooling, an ORM or driver, authentication — all to store a table that fits in a spreadsheet.

---

## Decision 4: Azure Communication Services Email (vs. Resend / Gmail / AWS SES)

**Chosen:** Azure Communication Services Email ($100 student credit)
**Rejected:** Resend, Gmail App Password, AWS SES

**Why Azure ACS over Resend:**
This is the key distinction from the Redis decision. Redis for OTP storage was a WRONG tool
for the problem (distributed cache for a single-process Map). Azure ACS for email is the
RIGHT tool for the problem (production-grade transactional email platform used to send
transactional emails). The difference:

- A recruiter asks "why Redis?" → honest answer is "resume padding" → bad signal
- A recruiter asks "why Azure ACS?" → honest answer is "I needed reliable email delivery
  with SPF/DKIM compliance to institutional mail servers, and I had student credits" → real
  engineering justification that happens to also be an ATS keyword

**Why not the others:**
- Gmail App Passwords are fragile (Google can revoke, no SPF/DKIM control)
- Resend works but weaker resume signal, and free tier is only 3,000/month
- AWS SES requires sandbox exit approval, uncertain class credit timeline

**Cost:** First 1,000 emails/month free. After that $0.00025/email. With $100 credit =
400,000+ emails. The user also has a free domain from Name.com (Student Dev Pack) for
professional sender addresses.

---

## Decision 5: Separate Repo (vs. Monorepo with Website)

**Chosen:** Separate Git repository for the bot
**Rejected:** Subfolder inside the `IEEE-YorkU` website repo

**Why:**
- Different runtime models (long-running WebSocket vs. static site)
- Different deployment targets (VPS with PM2 vs. GitHub Pages)
- Zero shared code or dependencies
- Independent development cycles
- Better portfolio visibility as a standalone project

---

## Decision 6: Strictly @my.yorku.ca (vs. @yorku.ca + @my.yorku.ca)

**Chosen:** Only `@my.yorku.ca`
**Rejected:** Including `@yorku.ca`

**Why:** `@my.yorku.ca` is the student domain. `@yorku.ca` is faculty/staff. This is a student club Discord server. Faculty don't need access.

---

## Decision 7: DigitalOcean VPS (vs. T480 Laptop)

**Chosen:** DigitalOcean droplet ($200 student credit = ~40 months)
**Rejected:** Self-hosting on a Linux Mint ThinkPad T480

**Why:** Discord bots need 24/7 uptime. A laptop sleeps, loses Wi-Fi, restarts on updates, and has no power redundancy. PM2 solves process crashes but not hardware unavailability.

---

## Decision 8: Kill Express Backend on Website

**Chosen:** Remove the Express server, inline data in React, deploy as static site
**Rejected:** Keeping the Express backend running

**Why:** After moving Discord verification to the bot, the Express server serves exactly zero dynamic endpoints. All data (`pastEvents`, `team`, `sponsors`, `clubMission`) is hardcoded in `data.js`. There's no database. Running a server to serve a JSON file is unjustifiable.

Analytics will be handled by SimpleAnalytics (free via GitHub Student Dev Pack — 100k page views/month for 1 year), which is a single `<script>` tag. No backend needed.

---

## Decision 9: GitHub Pages (vs. Vercel)

**Chosen:** GitHub Pages for the static website
**Rejected:** Vercel

**Why:** Both are free for static sites. GitHub Pages is simpler, the user already uses GitHub, and there are no serverless function needs. Vercel's additional features (serverless, edge functions) are unnecessary since there's no backend.

---

## Decision 10: No Web Dashboard

**Chosen:** `/stats` slash command inside Discord
**Rejected:** Web dashboard for exec team

**Why:** The exec team are developers. A dashboard would require: a web server, authentication (OAuth2), a frontend framework, hosting, and maintenance — all to display numbers that a Discord slash command provides in one message. Overkill by any measure.
