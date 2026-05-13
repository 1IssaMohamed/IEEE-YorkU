# IEEE YorkU Hardware Club — Discord Verification Bot

## Complete Specification & Context Document

> **Purpose of this document:** This file captures the full architectural context, every
> technical decision, and all implementation requirements for the Discord verification bot.
> It is designed so that any developer or AI agent can pick this up cold, in a separate
> repository, and build the complete bot without needing additional context.

---

## 1. Project Overview

### What This Bot Does

A Discord.js v14 bot that gates access to the IEEE YorkU Hardware Club Discord server.
The server is **open to join** (anyone can click the invite link), but all channels except
`#verify` (and optionally `#rules`) are locked behind a `@Verified` role. The bot handles
the email verification flow to prove the user is a current York University student.

### Why This Bot Exists

Previously, the IEEE YorkU website had an invite-gate system: users entered their YorkU
email on the website, the Express backend minted a single-use Discord invite via the
Discord API, and emailed it. This approach had critical problems:

- **Invite leaking** — single-use links could be shared before use
- **Discord API rate limits** — invite creation endpoint has tight limits, especially
  problematic after large events
- **SMTP failures** — Gmail App Password setup was fragile and unreliable
- **Coupling** — the website backend had to stay online for Discord access to work

The new approach decouples completely: the website has a static Discord invite link,
and verification happens entirely inside Discord via the bot.

### Who This Bot Serves

- **Primary:** York University engineering/computing students joining the Hardware Club
- **Server scope:** Hardware Club Discord server (separate from the main IEEE YorkU server)
- **Future:** May be extended to the main IEEE YorkU Discord server later

---

## 2. Architecture

### System Diagram

```
┌─────────────────┐     clicks invite link     ┌──────────────────────┐
│  IEEE YorkU     │ ──────────────────────────> │  Hardware Club       │
│  Website        │                             │  Discord Server      │
│  (static site)  │                             │                      │
└─────────────────┘                             │  #verify channel:    │
                                                │  [Verify Button]     │
                                                │         │            │
                                                │         ▼            │
                                                │  Bot shows Modal     │
                                                │  (email input)       │
                                                │         │            │
                                                │         ▼            │
                                                │  Bot validates       │
                                                │  @my.yorku.ca        │
                                                │         │            │
                                                │         ▼            │
                                                │  Bot sends OTP via   │
                                                │  Azure ACS Email     │
                                                │         │            │
                                                │         ▼            │
                                                │  User enters OTP     │
                                                │  (second modal or    │
                                                │   slash command)     │
                                                │         │            │
                                                │         ▼            │
                                                │  Bot grants          │
                                                │  @Verified role      │
                                                │         │            │
                                                │         ▼            │
                                                │  All channels        │
                                                │  now visible         │
                                                └──────────────────────┘
                                                         │
                                                         │ persists
                                                         ▼
                                                ┌──────────────────┐
                                                │  SQLite DB       │
                                                │  (verified_users │
                                                │   table)         │
                                                └──────────────────┘
```

### Technology Stack

| Component          | Technology                | Rationale                                             |
|--------------------|---------------------------|-------------------------------------------------------|
| Bot framework      | discord.js v14            | Industry standard, well-documented                    |
| Runtime            | Node.js 18+               | Matches the existing IEEE YorkU website stack          |
| OTP storage        | In-memory `Map` with TTL  | Redis is overkill for single-process bot at this scale |
| Persistence        | SQLite via `better-sqlite3`| Zero-config, single file, survives restarts           |
| Email delivery     | Azure Communication Services Email | $100 student credit, production-grade, SPF/DKIM/DMARC tooling, deliverability analytics |
| Process manager    | PM2                       | Keeps bot alive on VPS, auto-restart on crash         |
| Hosting            | DigitalOcean droplet      | $200 student credit available (~40 months of hosting) |

### What Was Explicitly Rejected (and Why)

| Technology   | Why Rejected                                                        |
|--------------|---------------------------------------------------------------------|
| Redis        | Overkill for single-process bot with ~50 verifications/event max. In-memory Map with TTL cleanup is sufficient. If bot restarts, users just re-click verify — minor inconvenience, not data loss. |
| MongoDB/PostgreSQL | Overkill for storing Discord ID ↔ email pairs. SQLite handles this perfectly with zero operational burden. |
| Web dashboard | The exec team are developers. A `/stats` slash command provides any metrics they need. A dashboard would add: web server, auth, frontend, hosting — all for displaying a number. |
| Linked Roles (OAuth2) | Requires a full web application with OAuth2 consent flow and Connection Metadata API. Standard bot-based verification is simpler and correct for this scale. |
| Gmail App Passwords | Fragile — Google can revoke silently, rate limits are undocumented, no SPF/DKIM control. |
| Resend | Good DX but free tier is only 3,000/month. Azure ACS is a stronger resume signal and the user already has credits. |

---

## 3. Verification Flow (Detailed)

### Step 1: Server Setup (One-Time, Manual in Discord UI)

1. Create a role called `@Verified` in the server
2. Set **all channels** (except #verify and optionally #rules) to require `@Verified` to view
3. Set #verify to be visible to `@everyone` but read-only (only the bot posts there)
4. The bot sends a persistent message in #verify with a "Verify YorkU Email" button

> **Important:** When new channels are added to the server in the future, the server admin
> simply sets that channel's permissions to require `@Verified`. NO bot code changes needed.
> NO env var changes needed. The bot only assigns the role — Discord's permission system
> handles channel access.

### Step 2: User Clicks "Verify YorkU Email" Button

- Bot opens a **Modal** (Discord's built-in form popup)
- Modal contains a single text input: "Enter your @my.yorku.ca email"
- This is a native Discord UI — no external website needed

### Step 3: Bot Validates Email

Server-side validation with regex: `^[^@\s]+@my\.yorku\.ca$` (case-insensitive)

**Guards before sending OTP:**

1. **Email domain check** — must be strictly `@my.yorku.ca` (student domain only, NOT `@yorku.ca` which is faculty/staff)
2. **Already-verified check** — query SQLite: if this email is already linked to a Discord account, reject with "This email is already verified with another account"
3. **Already-verified user check** — query SQLite: if this Discord user ID already has a verified email, reject with "Your account is already verified"
4. **Cooldown check** — if this user requested an OTP within the last 60 seconds, reject with "Please wait before requesting another code"
5. **Attempt tracking** — if this user has generated more than 5 OTPs in the last 15 minutes, reject (prevents email spam)

### Step 4: OTP Generation and Email

- Generate 6-digit OTP using `crypto.randomInt(100000, 999999)` — NOT `Math.random()`
- Store in memory Map: `{ visitorId: { otp, email, attempts: 0, expiresAt: Date.now() + 900_000 } }`
- Set a `setTimeout` to auto-delete after 15 minutes
- Send OTP email via Azure Communication Services to the user's @my.yorku.ca address
- Reply to user (ephemeral): "Verification code sent. Check your YorkU inbox (including junk/spam)."

### Step 5: User Enters OTP

Two implementation options (recommend Option A):

**Option A: Second button + modal**
- After sending the OTP, the ephemeral reply includes a "Enter Code" button
- User clicks it, gets a second modal with a text input for the 6-digit code
- Simpler UX — stays in the same interaction flow

**Option B: Slash command**
- User types `/verify <code>` in the #verify channel
- Slightly less intuitive but works

### Step 6: OTP Verification

**Guards:**
1. Check if an OTP exists for this user in the Map — if not, "No pending verification. Please start over."
2. Check if OTP is expired — if so, "Code expired. Please request a new one."
3. Check attempt count — if >= 3 failed attempts, delete the OTP entry and reply "Too many incorrect attempts. Please request a new code." (prevents brute-force on 6-digit code)
4. Compare user input to stored OTP
5. If mismatch: increment attempts, reply "Incorrect code. X attempts remaining."
6. If match: proceed to role assignment

### Step 7: Role Assignment and Persistence

1. `member.roles.add(VERIFIED_ROLE_ID)` — grants the @Verified role
2. Insert into SQLite: `INSERT INTO verified_users (discord_id, email, verified_at) VALUES (?, ?, ?)`
   - `email` column has a UNIQUE constraint — prevents one student email being used by multiple Discord accounts
   - `discord_id` column has a UNIQUE constraint — prevents one Discord account verifying multiple emails
3. Delete the OTP entry from the in-memory Map
4. Reply (ephemeral): "You're verified! All channels are now unlocked."
5. Optionally: send a welcome message in a #general or #welcome channel tagging the new member

---

## 4. Database Schema

```sql
CREATE TABLE IF NOT EXISTS verified_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discord_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    verified_at TEXT NOT NULL DEFAULT (datetime('now')),
    -- Optional: track the Discord username at time of verification for admin reference
    discord_username TEXT
);

-- Index for quick lookups during verification checks
CREATE INDEX IF NOT EXISTS idx_email ON verified_users(email);
CREATE INDEX IF NOT EXISTS idx_discord_id ON verified_users(discord_id);
```

SQLite file location: `./data/verified_users.db` (relative to bot project root)

---

## 5. OTP In-Memory Store Design

```javascript
// OTP store structure
const otpStore = new Map();

// Entry shape:
// otpStore.set(discordUserId, {
//     otp: "482917",              // 6-digit string
//     email: "user@my.yorku.ca",  // normalized lowercase
//     attempts: 0,                // failed verification attempts (max 3)
//     createdAt: 1715000000000,   // Date.now() when created
//     expiresAt: 1715000900000,   // createdAt + 15 minutes
//     timerId: <TimeoutId>        // reference to setTimeout for cleanup
// });

// Cleanup: when storing, set a timer
const timerId = setTimeout(() => otpStore.delete(userId), 15 * 60 * 1000);

// On bot shutdown: otpStore is lost. This is acceptable.
// Users who had pending OTPs simply click the verify button again.
```

### Cooldown / Rate Limit Store

```javascript
// Separate map to track OTP request timestamps per user
const cooldownStore = new Map();

// Entry shape:
// cooldownStore.set(discordUserId, {
//     lastRequest: 1715000000000,     // timestamp of last OTP request
//     requestCount: 2,                 // number of requests in current window
//     windowStart: 1715000000000,      // start of the 15-minute rate limit window
// });

// Rules:
// - Minimum 60 seconds between OTP requests (per user)
// - Maximum 5 OTP requests per 15-minute window (per user)
```

---

## 6. Environment Variables

```env
# Discord Bot Configuration
DISCORD_BOT_TOKEN=<your-bot-token>
DISCORD_GUILD_ID=<hardware-club-server-id>
VERIFY_CHANNEL_ID=<the-verify-channel-id>
VERIFIED_ROLE_ID=<the-verified-role-id>

# Email Configuration (Azure Communication Services)
AZURE_ACS_CONNECTION_STRING=<your-acs-connection-string>
EMAIL_FROM=<your-verified-sender-address>  # e.g., DoNotReply@<your-acs-domain>.azurecomm.net or a custom domain

# OTP Configuration (optional overrides)
OTP_EXPIRY_MS=900000          # 15 minutes (default)
OTP_MAX_ATTEMPTS=3            # max failed attempts before OTP is burned
OTP_COOLDOWN_MS=60000         # 60 seconds between requests
OTP_MAX_REQUESTS_PER_WINDOW=5 # max requests per 15-minute window
```

---

## 7. Email Template

### Plain Text
```
Hi,

Your IEEE YorkU Hardware Club verification code is: {OTP}

This code expires in 15 minutes.

If you did not request this, you can ignore this email.

- IEEE YorkU Hardware Club
```

### HTML
```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #00629B; margin-bottom: 16px;">IEEE YorkU Hardware Club</h2>
    <p style="color: #334155; font-size: 16px; line-height: 1.6;">
        Your verification code is:
    </p>
    <div style="background: #f1f5f9; border: 2px solid #00629B; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
        <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #00629B;">{OTP}</span>
    </div>
    <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
        This code expires in 15 minutes. If you did not request this, you can safely ignore this email.
    </p>
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
    <p style="color: #94a3b8; font-size: 12px;">
        IEEE York University Student Branch &bull; Hardware Design Club
    </p>
</div>
```

---

## 8. Bot Commands

### Slash Commands (Admin Only)

| Command | Description | Permissions |
|---------|-------------|-------------|
| `/stats` | Shows verification stats: total verified users, verifications today/this week, pending OTPs | Admin/Moderator role |
| `/lookup <email or @user>` | Look up a verified user by email or Discord mention | Admin/Moderator role |
| `/unverify <@user>` | Remove verified role and delete DB entry (for edge cases) | Admin only |
| `/deploy-verify-button` | Sends the persistent verify button message to the current channel | Admin only (used once during setup) |

### User-Facing Interactions

| Interaction | Type | Description |
|-------------|------|-------------|
| "Verify YorkU Email" button | Button (persistent in #verify) | Triggers the email input modal |
| Email input | Modal | Collects @my.yorku.ca email address |
| "Enter Code" button | Button (ephemeral reply) | Triggers the OTP input modal |
| OTP input | Modal | Collects the 6-digit verification code |

---

## 9. Project Structure

```
ieee-hardware-bot/           # This will become its own Git repo
├── src/
│   ├── index.js              # Bot entry point — client login, event registration
│   ├── events/
│   │   ├── ready.js          # Bot ready event — log status, register commands
│   │   └── interactionCreate.js  # Routes all interactions (buttons, modals, commands)
│   ├── interactions/
│   │   ├── verifyButton.js   # Handles "Verify YorkU Email" button click → shows email modal
│   │   ├── emailModal.js     # Handles email modal submit → validates, sends OTP
│   │   ├── otpButton.js      # Handles "Enter Code" button click → shows OTP modal
│   │   └── otpModal.js       # Handles OTP modal submit → verifies, assigns role
│   ├── commands/
│   │   ├── stats.js          # /stats slash command
│   │   ├── lookup.js         # /lookup slash command
│   │   ├── unverify.js       # /unverify slash command
│   │   └── deployButton.js   # /deploy-verify-button slash command
│   ├── services/
│   │   ├── email.js          # Email sending via Azure Communication Services
│   │   ├── otp.js            # OTP generation, storage, validation, cooldowns
│   │   └── database.js       # SQLite connection, queries, schema init
│   └── utils/
│       ├── config.js         # Loads and validates env vars
│       └── logger.js         # Simple structured logging
├── data/                     # Created at runtime
│   └── verified_users.db     # SQLite database file (gitignored)
├── .env                      # Environment variables (gitignored)
├── .env.example              # Template with placeholder values (committed)
├── .gitignore
├── package.json
├── README.md                 # Setup instructions, architecture overview
└── ecosystem.config.js       # PM2 configuration file
```

---

## 10. Discord Server Setup Checklist

These steps are done manually in the Discord UI before the bot goes live:

1. **Create the Discord Application**
   - Go to https://discord.com/developers/applications
   - Click "New Application" → name it (e.g., "IEEE YorkU Verify Bot")
   - Under **Bot** tab:
     - Click "Reset Token" → save to `.env` as `DISCORD_BOT_TOKEN`
     - Enable **Server Members Intent** (required to see member joins)
     - Enable **Message Content Intent** (may be needed for future features)
   - Under **OAuth2** tab:
     - Generate invite URL with scopes: `bot`, `applications.commands`
     - Bot permissions: `Manage Roles`, `Send Messages`, `Use External Emojis`, `Read Message History`
     - Use this URL to invite the bot to the Hardware Club server

2. **Create the @Verified Role**
   - Server Settings → Roles → Create Role → name it "Verified"
   - **Important:** The bot's role must be ABOVE the @Verified role in the role hierarchy, otherwise it can't assign it
   - Copy the Role ID → save to `.env` as `VERIFIED_ROLE_ID`

3. **Set Up Channel Permissions**
   - For **every channel except #verify** (and optionally #rules):
     - Edit channel → Permissions → @everyone → Deny "View Channel"
     - Edit channel → Permissions → @Verified → Allow "View Channel"
   - For **#verify**:
     - @everyone → Allow "View Channel", Deny "Send Messages"
     - Bot role → Allow "Send Messages"
   - Copy the #verify Channel ID → save to `.env` as `VERIFY_CHANNEL_ID`

4. **Get Server ID**
   - Right-click server name → Copy Server ID → save to `.env` as `DISCORD_GUILD_ID`

---

## 11. Deployment (DigitalOcean)

### VPS Setup

The user already has a DigitalOcean VPS with $200 student credit.

```bash
# SSH into the droplet
ssh root@your-droplet-ip

# Install Node.js 18+ (if not already)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
npm install -g pm2

# Clone the bot repo
git clone https://github.com/YOUR_USERNAME/ieee-hardware-bot.git
cd ieee-hardware-bot

# Install dependencies
npm install

# Create .env with production values
cp .env.example .env
nano .env  # fill in real values

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # generates the command to auto-start PM2 on reboot
```

### PM2 Ecosystem Config

```javascript
// ecosystem.config.js
module.exports = {
    apps: [{
        name: "ieee-hardware-bot",
        script: "./src/index.js",
        instances: 1,
        autorestart: true,
        watch: false,
        max_memory_restart: "200M",
        env: {
            NODE_ENV: "production"
        }
    }]
};
```

### Updating the Bot

```bash
ssh root@your-droplet-ip
cd ieee-hardware-bot
git pull origin main
npm install  # in case dependencies changed
pm2 restart ieee-hardware-bot
```

---

## 12. Email Provider Setup (Azure Communication Services)

### Why Azure Communication Services Email

- **Legitimate infrastructure choice:** ACS Email is a production-grade transactional email
  platform — using it for its exact intended purpose (sending OTP verification emails)
- **Cost:** First 1,000 emails/month are FREE (no credits consumed). After that, $0.00025
  per email. With $100 student credit, that's 400,000+ emails before credits run out.
- **DNS compliance:** Built-in tooling for SPF, DKIM, and DMARC configuration
- **Deliverability analytics:** Monitor whether YorkU's mail gateway is accepting emails
- **Resume value:** Azure cloud services experience is a genuine ATS keyword that matches
  a real engineering requirement here (unlike using Redis for a Map-sized workload)

### Alternatives That Were Considered

| Provider | Verdict | Reason |
|----------|---------|--------|
| Resend | Good but weaker resume signal | 3,000/month free, great DX, but Azure is more impactful |
| Gmail App Password | Rejected | Fragile, no DNS control, Google can revoke silently |
| AWS SES | Rejected | Sandbox mode friction, uncertain class credit timeline |

### Setup Steps

1. **Azure Portal:** Log in at https://portal.azure.com with your student account
2. **Create resource:** Search "Email Communication Services" → Create
   - Choose your subscription (student $100 credit)
   - Create a new resource group (e.g., `ieee-yorku-bot-rg`)
   - Pick a data location (United States or Canada)
3. **Provision email domain:**
   - **Option A (Quick start):** Use Azure-managed domain (`xxxxxxxx.azurecomm.net`)
     - Pros: Zero DNS setup, works immediately
     - Cons: Generic sender address (`DoNotReply@<hash>.azurecomm.net`)
   - **Option B (Professional):** Connect a custom domain
     - Use the free domain from Name.com (GitHub Student Dev Pack)
     - Example: `ieeeyorku.dev` or `ieeehardware.live`
     - Azure will provide SPF, DKIM, and DMARC records to add to your domain's DNS
     - Sender address becomes something like `noreply@ieeeyorku.dev`
4. **Create Communication Services resource:**
   - Search "Communication Services" → Create → Link it to your Email resource
5. **Get connection string:**
   - Communication Services resource → Keys → copy "Connection string"
   - Save to `.env` as `AZURE_ACS_CONNECTION_STRING`
6. **Note sender address:**
   - From Email resource → Provision Domains → copy your verified sender address
   - Save to `.env` as `EMAIL_FROM`

### DNS Records (Custom Domain — Option B)

Azure will provide the exact records during domain verification. General pattern:

- **SPF:** TXT record — `v=spf1 include:spf.protection.outlook.com -all`
- **DKIM:** CNAME records provided by Azure (two DKIM selectors)
- **DMARC:** TXT record — `v=DMARC1; p=none;` (start with `p=none`, move to `p=quarantine` after confirming deliverability)
- **Domain verification:** TXT record with a verification token Azure provides

### Free Domain from Name.com

The user's GitHub Student Dev Pack includes a **free domain from Name.com** with extensions
like `.live`, `.studio`, `.software`, `.app`, `.dev`.

Example: `ieeeyorku.dev` or `ieeehardware.live` — use this as the sending domain for
professional sender addresses like `noreply@ieeeyorku.dev`.

### Azure SDK Usage in Code

```javascript
// services/email.js
import { EmailClient } from "@azure/communication-email";

const connectionString = process.env.AZURE_ACS_CONNECTION_STRING;
const emailClient = new EmailClient(connectionString);

export async function sendVerificationEmail(toAddress, otpCode) {
    const message = {
        senderAddress: process.env.EMAIL_FROM,
        content: {
            subject: "Your IEEE YorkU Hardware Club Verification Code",
            plainText: `Your verification code is: ${otpCode}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, you can ignore this email.\n\n- IEEE YorkU Hardware Club`,
            html: `...` // See HTML template in Section 7
        },
        recipients: {
            to: [{ address: toAddress }]
        }
    };

    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();
    return result;
}
```

---

## 13. Website Changes Required

### What Changes on the IEEE YorkU Website

The IEEE YorkU website (`IEEE-YorkU` repo) needs these modifications:

#### 1. Remove the Express Backend Entirely

The Express server (`server/`) currently serves only static data from `data.js`:
- `GET /api/info` → hardcoded mission string
- `GET /api/past-events` → hardcoded events array
- `GET /api/team` → hardcoded team array
- `GET /api/sponsors` → hardcoded sponsors array
- `POST /api/hardware/request-invite` → **moving to the Discord bot**

None of these endpoints require a server. Move the data directly into the React frontend.

#### 2. Inline the Data

Move `server/data.js` exports into the React frontend, e.g., `client/src/data/siteData.js`.
Remove all `api.get(...)` calls from `App.jsx` and import the data directly.

#### 3. Remove HardwareInviteModal Component

Delete `client/src/components/HardwareInviteModal.jsx` entirely.
In `Home.jsx`, replace the "Join Hardware Team" button's `onClick` handler:

**Before:** Opens the HardwareInviteModal
**After:** Direct link to Discord → `<a href="https://discord.gg/YOUR_PERMANENT_INVITE" target="_blank">`

#### 4. Remove API Client

Delete `client/src/api/client.js` (Axios config) — no longer needed.
Remove `axios` from `client/package.json`.

#### 5. Deploy as Static Site on GitHub Pages

- Remove `server/` directory entirely
- Remove root `package.json` scripts that reference the server
- Build with `npm run build` in `client/`
- Deploy `client/dist/` to GitHub Pages
- Optionally add SimpleAnalytics script tag for visitor tracking
  (Free for 1 year via GitHub Student Dev Pack: 100k page views/month)

#### 6. Files to Delete

- `server/` (entire directory)
- `client/src/components/HardwareInviteModal.jsx`
- `client/src/api/client.js`
- Root `package.json` (replace with simpler one, or just use `client/package.json`)

#### 7. Files to Modify

- `client/src/App.jsx` — remove all API fetch logic, import data directly
- `client/src/pages/Home.jsx` — remove HardwareInviteModal import/usage, add Discord link
- `client/package.json` — remove `axios` dependency

---

## 14. Security Considerations

### OTP Security
- Use `crypto.randomInt(100000, 999999)` — cryptographically secure
- 3 failed attempts → OTP burned, must request new one
- 15-minute expiry on all OTPs
- 60-second cooldown between OTP requests per user
- 5 OTP requests max per 15-minute window per user

### Email Domain Validation
- Regex: `^[^@\s]+@my\.yorku\.ca$` (case-insensitive)
- Strictly `@my.yorku.ca` only — student accounts
- `@yorku.ca` (faculty/staff) is intentionally excluded
- The act of receiving an OTP at this address proves enrollment — domain spoofing
  is a SENDING problem, not a RECEIVING problem. If they can read the OTP, they own
  the mailbox.

### Database Constraints
- UNIQUE constraint on `email` — one email, one Discord account
- UNIQUE constraint on `discord_id` — one Discord account, one email
- These prevent: multi-accounting, email sharing, re-verification with different emails

### Bot Token Security
- Never hardcode the token
- Store in `.env`, which is `.gitignore`d
- The `.env.example` file contains only placeholder keys
- On the VPS: restrict file permissions on `.env` (`chmod 600 .env`)

### Discord Permissions Principle of Least Privilege
- Bot only needs: `Manage Roles`, `Send Messages`, `Read Message History`
- `Server Members Intent` must be enabled (required to see members and assign roles)
- Bot role must be positioned ABOVE @Verified in the role hierarchy

---

## 15. Package Dependencies

```json
{
    "name": "ieee-hardware-bot",
    "version": "1.0.0",
    "type": "module",
    "description": "Discord verification bot for IEEE YorkU Hardware Club",
    "main": "src/index.js",
    "scripts": {
        "start": "node src/index.js",
        "dev": "node --watch src/index.js"
    },
    "dependencies": {
        "discord.js": "^14.16.0",
        "better-sqlite3": "^11.0.0",
        "@azure/communication-email": "^1.0.0",
        "dotenv": "^16.4.0"
    },
    "devDependencies": {},
    "engines": {
        "node": ">=18.0.0"
    }
}
```

---

## 16. Testing Checklist

### Positive Flow
- [ ] User clicks "Verify YorkU Email" button → modal appears
- [ ] User enters valid `user@my.yorku.ca` email → OTP email is sent
- [ ] User receives email in inbox (check junk/spam too)
- [ ] User clicks "Enter Code" → second modal appears
- [ ] User enters correct OTP → @Verified role is assigned
- [ ] User can now see all previously locked channels
- [ ] SQLite database has a new entry with correct discord_id and email

### Negative Flows
- [ ] Invalid email domain (e.g., `user@gmail.com`) → rejected with clear message
- [ ] `@yorku.ca` (faculty domain) → rejected
- [ ] Already-verified email → rejected ("This email is already verified")
- [ ] Already-verified Discord account → rejected ("You're already verified")
- [ ] Wrong OTP → "Incorrect code. X attempts remaining"
- [ ] 3 wrong OTPs → OTP burned, "Too many attempts, request a new code"
- [ ] Expired OTP (wait 15 min) → "Code expired"
- [ ] Rapid OTP requests (within 60s) → "Please wait before requesting another code"
- [ ] 5+ OTP requests in 15 min → "Too many requests, please try again later"

### Edge Cases
- [ ] Bot restarts mid-verification → OTP store is cleared, user re-clicks verify (acceptable)
- [ ] User leaves server after verifying → DB entry persists (they're still verified if they rejoin — consider auto-granting role on rejoin)
- [ ] User is banned → admin can `/unverify` to clean up DB entry

### Admin Commands
- [ ] `/stats` shows correct numbers
- [ ] `/lookup @user` returns their verified email
- [ ] `/lookup user@my.yorku.ca` returns the linked Discord user
- [ ] `/unverify @user` removes role and deletes DB entry
- [ ] `/deploy-verify-button` posts the verify message in the current channel

---

## 17. Future Enhancements (Not In Scope for V1)

- **Auto-verify on rejoin:** If a verified user leaves and rejoins, check DB and auto-grant @Verified
- **Verification expiry:** Optionally require re-verification at the start of each academic year
- **Multi-server support:** Extend to the main IEEE YorkU server (config-driven via env vars per server)
- **Audit logging:** Log verification events to a Discord channel for transparency
- **Bulk operations:** Admin command to export all verified users as CSV
- **Welcome message:** Post a personalized welcome in #general when someone verifies
