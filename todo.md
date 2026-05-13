# IEEE YorkU — Remaining TODO

> Last updated: May 12, 2026
> Website migration to static site: ✅ COMPLETE
> QA audit & fixes: ✅ COMPLETE
> Discord bot code: ✅ COMPLETE
> Bot deployment: 🔲 NEEDS YOUR SETUP FIRST

---

## 🤖 Bot — What YOU Need To Do (Before It Can Run)

### Step 1: Discord Application Setup (~10 min)
- [ ] Go to https://discord.com/developers/applications
- [ ] Click "New Application" → name it `IEEE Hardware Bot`
- [ ] Go to **Bot** tab:
  - [ ] Click "Reset Token" → copy it (this is your `DISCORD_BOT_TOKEN`)
  - [ ] Enable **Server Members Intent** ✅
  - [ ] Disable "Public Bot" (only you should install it) ✅
- [ ] Go to **OAuth2** tab:
  - [ ] Select scopes: `bot`, `applications.commands`
  - [ ] Select permissions: `Manage Roles`, `Send Messages`, `Use Slash Commands`
  - [ ] Copy the generated URL → open it → invite bot to your Hardware Club server

### Step 2: Discord Server Configuration (~5 min)
- [ ] Create a role named `@Verified` (no special permissions needed)
- [ ] Move the **bot's role** ABOVE `@Verified` in Settings → Roles (drag it up)
- [ ] Create a channel named `#verify`
  - [ ] Set `@everyone` permissions: View Channel ✅, Send Messages ❌
  - [ ] Set bot role permissions: Send Messages ✅
- [ ] For ALL other channels: set "View Channel" to require `@Verified` role
- [ ] Copy these IDs (Enable Developer Mode: User Settings → Advanced → Developer Mode):
  - Right-click server name → Copy Server ID → `DISCORD_GUILD_ID`
  - Right-click #verify channel → Copy Channel ID → `VERIFY_CHANNEL_ID`
  - Right-click @Verified role → Copy Role ID → `VERIFIED_ROLE_ID`

### Step 3: Azure Email Setup (~15 min)
- [ ] Go to https://portal.azure.com (log in with your student account)
- [ ] Search "Email Communication Services" → Create
- [ ] Search "Communication Services" → Create → link to your Email resource
- [ ] Go to your Email resource → Provision Domains:
  - **Quick option:** Use Azure-managed domain (e.g., `DoNotReply@xxxxxxxx.azurecomm.net`)
  - **Professional option:** Add custom domain from Name.com (requires DNS records)
- [ ] Go to Communication Services resource → Keys → copy `Connection String` → `AZURE_ACS_CONNECTION_STRING`
- [ ] Note your sender address → `EMAIL_FROM`

### Step 4: Create .env File (~2 min)
- [ ] In `ieeebot/`, copy `.env.example` to `.env`
- [ ] Fill in all 6 values from Steps 1-3:
  ```
  DISCORD_BOT_TOKEN=<from Step 1>
  DISCORD_GUILD_ID=<from Step 2>
  VERIFY_CHANNEL_ID=<from Step 2>
  VERIFIED_ROLE_ID=<from Step 2>
  AZURE_ACS_CONNECTION_STRING=<from Step 3>
  EMAIL_FROM=<from Step 3>
  ```

### Step 5: Test Locally (~5 min)
- [ ] Run: `cd ieeebot && node src/index.js`
- [ ] Confirm bot comes online in your server
- [ ] Run `/deploy-verify-button` in any channel (admin only)
- [ ] Go to #verify → click the verify button → test with your own @my.yorku.ca email
- [ ] Confirm you receive the OTP email
- [ ] Enter the code → confirm @Verified role is assigned

### Step 6: Deploy to DigitalOcean (~10 min)
- [ ] SSH into your VPS
- [ ] Clone repo (or copy `ieeebot/` folder)
- [ ] Create `.env` with production values
- [ ] `npm install`
- [ ] `npm install -g pm2` (if not already installed)
- [ ] `pm2 start ecosystem.config.cjs`
- [ ] `pm2 save && pm2 startup` (auto-restart on reboot)
- [ ] Verify bot stays online after disconnecting SSH

---

## ✅ Bot — Completed (Code)

### Project Setup
- [x] `package.json` with discord.js, better-sqlite3, Azure ACS, dotenv
- [x] `.env.example` with all required variables documented
- [x] `.gitignore` (protects .env, SQLite DB, node_modules)
- [x] `ecosystem.config.cjs` for PM2 production deployment

### Core Services
- [x] `src/utils/config.js` — env validation with fail-fast on missing vars
- [x] `src/utils/logger.js` — timestamped structured logging
- [x] `src/services/database.js` — SQLite with WAL mode, schema init, CRUD ops
- [x] `src/services/otp.js` — crypto.randomInt OTP, in-memory Map with TTL, rate limiting
- [x] `src/services/email.js` — Azure ACS email with HTML template

### Interaction Handlers (Verification Flow)
- [x] `src/interactions/verifyButton.js` — persistent embed + button builder, email modal trigger
- [x] `src/interactions/emailModal.js` — email validation, DB checks, cooldown, OTP creation, email send
- [x] `src/interactions/otpButton.js` — code input modal trigger
- [x] `src/interactions/otpModal.js` — OTP verification, role assignment, DB persistence

### Admin Commands
- [x] `src/commands/deployButton.js` — `/deploy-verify-button` (admin only)
- [x] `src/commands/stats.js` — `/stats` (verification metrics)
- [x] `src/commands/lookup.js` — `/lookup` (find user by email/ID)
- [x] `src/commands/unverify.js` — `/unverify` (revoke role + delete record)

### Event Handlers
- [x] `src/events/ready.js` — DB init, slash command registration
- [x] `src/events/interactionCreate.js` — central router for buttons/modals/commands

### Entry Point
- [x] `src/index.js` — client setup, global error handlers, graceful shutdown

### Build Verification
- [x] `npm install` — 0 vulnerabilities, 84 packages
- [x] All modules pass syntax check (node --check)

---

## Website — Final Touches (Unchanged)

### Content Updates (You — before launch)
- [ ] Replace Discord invite placeholder URL in `client/src/pages/Home.jsx` line 39
- [ ] Replace footer social links in `Home.jsx` lines 12-14 with real URLs
- [ ] Get real LinkedIn profile URLs from Daniel W, Zainab, and Abdi

### Deployment
- [ ] Sign up for SimpleAnalytics via GitHub Student Dev Pack
- [ ] Set up GitHub Pages
- [ ] (Optional) Claim free domain from Name.com

### Documentation & Cleanup
- [ ] Rewrite `README.md`
- [ ] Move `ieeebot/` to its own repo
- [ ] Delete stale root `node_modules/` and `package-lock.json`
- [ ] Git commit all changes