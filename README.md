# Little Baby Love – Mommy's Happy World ❤️

A cute, offline-first baby-themed mini-game app: **one Nuxt 4 codebase** powering a website, an installable PWA and a Capacitor Android app.
No backend, no ads, no accounts, no purchases. Everything is saved on the device (IndexedDB).

## What is inside

| Area | Details |
|---|---|
| Games | **Baby Room** (39 items, drag & drop, paint, buy with coins) · **Memory Puzzle** (3 difficulties, 6 themes, 4 card backs) · **Bubble Pop** (hex-grid shooter, 30 levels, star/bomb/rainbow bubbles, combos) · **Dress Up** (40 pieces, colours, favourites, random) |
| Hearts | **Mommy's Love Notes** (52 notes, favourites, own notes) · **Daddy's Secret Messages** + **Daddy Mode** (PIN-protected admin dashboard) · Baby Journey (entertainment only) |
| Gamification | Daily rewards (7-day cycle, duplicate-claim & clock-rollback protection) · coins & stars · 10 achievements · collection · progress |
| Platform | PWA (Workbox precache, installable) · Capacitor Android (bundled assets, portrait, back button, status bar, splash, share-sheet export) |

Sound effects and the lullaby are **synthesised with the Web Audio API** (no audio files, nothing to download). Illustrations are inline SVG. The font (Nunito) is bundled via `@fontsource-variable/nunito`.

## Project structure

```
app/
  app.vue                      splash, welcome redirect, achievement watcher, global modals
  assets/css/main.css          Tailwind 4 + design tokens, themes, animations
  components/
    common/    Icon, CoinDisplay, GameHeader, PageHeader, ModalSheet, ConfirmDialog, SoundControls,
               ToggleRow, EmptyState, ToastHost, FloatingHearts, SkyBackdrop, BackupPanel
    layout/    BottomNav, AppSplash
    games/     GameCard, MemoryCard, BabyAvatar
    baby-room/ RoomStage (drag & drop), RoomTray (shop)
    rewards/   RewardModal
    messages/  DaddyLetter, DaddyEditor, PinPad, SurpriseEnvelope, SurpriseHost
  composables/ useGameStorage (IndexedDB modules + autosave + migration), useSettings, useSound, useCoins,
               useRewards, useAchievements, useMommyNotes, useDaddyMessages, useBabyRoom, useBackup,
               useInstall, useBackStack (Android back button), useGoBack, useToast
  data/        room, dress, memory, messages, daddy, rewards  (all catalogues & artwork)
  games/       memory/ (engine + composable) · bubble-pop/ (engine + canvas composable) · dress-up/
  layouts/     default (bottom nav) · game
  middleware/  welcome.global.ts (first-launch redirect)
  pages/       index, welcome, games/{index,baby-room,memory,bubble-pop,dress-up}, mommy-notes,
               daddy-messages, memories, baby, rewards, achievements, collection, progress, journey,
               settings/{index,daddy}, about
  plugins/     00.storage.client (load data first) · pwa.client (service worker) · native.client (Android)
  types/ utils/
public/        favicon, icons/, .htaccess (Hostinger)
assets/        icon/splash source art for @capacitor/assets
scripts/       generate-icons.mjs
tests/         bubble-engine.test.ts, utils.test.ts
android/       Capacitor Android project (com.littlebabylove.app)
capacitor.config.ts · nuxt.config.ts
```

State uses small composable modules persisted to IndexedDB (Pinia was not needed). Small preferences (sound, theme…) live in `localStorage`. If IndexedDB is blocked the app falls back to `localStorage`, and the Settings screen says which storage is in use.

## Install & develop

```powershell
npm install
npm run dev            # http://localhost:3000  (service worker is off in dev)
npm run typecheck
npm test               # engine + utility unit tests
```

## Website production build

```powershell
npm run build          # = nuxt generate  ->  .output/public  (static files)
npm run preview        # serves .output/public on http://localhost:4173
```

### Deploy to Hostinger
1. `npm run build`
2. In hPanel → **File Manager** → `public_html` (or your domain's folder) upload **everything inside `.output/public`** (including the hidden `.htaccess`, `_nuxt/`, `sw.js`, `workbox-*.js`, `manifest.webmanifest`, `icons/`).
3. Make sure the site is served over **HTTPS** (hPanel → SSL; free certificate). Service workers/PWA install require HTTPS.
4. Hash routing (`/#/games`) is used, so **no rewrite rules are needed**. Deploy at the domain root (or a subdomain). For a sub-folder deployment set `app.baseURL` in `nuxt.config.ts` and the manifest `start_url`/`scope`.
5. Updates: upload the new build; the service worker updates itself on the next visit.

### Installing the PWA
- **Android Chrome:** open the site once while online → menu ⋮ → *Install app* (or the in-app *Settings → Install app* button).
- **iPhone Safari:** Share → *Add to Home Screen*.
- **Desktop Chrome/Edge:** install icon in the address bar.
Settings → *Offline & install* shows "Offline ready ✓" once everything is cached.

## Android (Capacitor)

Requirements: **JDK 21** and **Android Studio** (SDK 35/36). The Android project already exists in `android/`.

```powershell
npm run build                 # Nuxt static output
npx cap sync android          # copy .output/public into the APK assets + plugins
npx cap open android          # open in Android Studio (Run ▶ on emulator/device)
```
Shortcut: `npm run cap:sync`.

### Debug APK
```powershell
npm run android:debug
# -> android\app\build\outputs\apk\debug\app-debug.apk
```
(or Android Studio → *Build → Build APK(s)*.)

### Signed release APK / AAB
1. Create a keystore once (keep it and its passwords safe – you need it for every update):
   ```powershell
   keytool -genkeypair -v -keystore android\little-baby-love.jks -alias littlebabylove -keyalg RSA -keysize 2048 -validity 10000
   ```
2. Copy `android/keystore.properties.example` → `android/keystore.properties` and fill in the passwords (git-ignored).
3. Build:
   ```powershell
   npm run android:release-apk   # android\app\build\outputs\apk\release\app-release.apk
   npm run android:release-aab   # android\app\build\outputs\bundle\release\app-release.aab  (Play Store)
   ```
Bump `versionCode`/`versionName` in `android/app/build.gradle` for every update.

### Regenerating icons / splash
Edit `scripts/generate-icons.mjs`, then `npm run icons` (PWA icons + Android launcher + splash).

### Android notes
- The app loads the **bundled** files (`webDir: .output/public`); there is no `server.url`.
- Portrait only, native splash (cream), pink status bar, hardware back button: closes dialogs/pause → goes back → from Home minimises the app.
- Backups use the Android share sheet (Filesystem cache + Share plugin) – no storage permission needed.
- Manifest permission: Capacitor adds `INTERNET` by default. The app never uses the network. Removing that line is optional; if you do, test on a real device (see limitations).

## Daddy's Secret Messages & Daddy Mode

**Settings → Daddy Mode** (first time: choose a 4–8 digit PIN; it is stored only as a salted SHA-256 hash). The manager is also reachable on Android and web.

- Dashboard: write / edit / delete / preview messages; each has **title, body, signature, category, card design, special flag, published/unpublished**, and a delivery mode:
  - **Daily surprise** – joins the rotation (frequency: every day / 2 days / weekly / off).
  - **On a date** – hidden until that day, then arrives as an envelope on Mommy's next app open.
  - **Manual** – hidden until you press **Send now**.
- Mommy only ever sees *published* messages whose time has come, and only **after she opens the envelope**; each message surprises her once (use **Surprise again** to repeat one). Unpublished and future messages are never shown early.
- 10 sample messages are included (daily rotation); edit or delete them freely. Deleted samples do not come back; messages are never deleted automatically.
- **Backup:** export/import JSON (file, or copy/paste text). Full-app backup/restore is in Settings.
- Hide the entry: Daddy Mode → *Hide Daddy Mode in Settings*. Reveal by tapping the gear icon at the top of Settings 5 times.
- Forgot the PIN? There is no recovery by design. Clearing the app data resets it (export a backup first!).
- The PIN only protects surprises from accidental peeking; data is not encrypted on the device.

## Rewards logic
7-day cycle: 20 / 30 / 40 / 50 / 75 / 100 coins, day 7 gives the Golden Teddy + 100 coins; every claim also gives stars and a small random surprise gift. "Today" uses the device's local date and never goes backwards (turning the clock back cannot re-claim). Missing a day restarts the week.

## Testing checklist
- [ ] `npm run typecheck` and `npm test` pass
- [ ] Welcome → Home; coins/stars show; daily reward claim works once per day and survives refresh
- [ ] Baby Room: add, drag, resize, remove, buy, paint, preview, reset; refresh keeps the room
- [ ] Memory: all three difficulties, win screen, coins, replay, pause/restart
- [ ] Bubble Pop: aim/shoot, matches, combos, ceiling drop, pause, win and lose screens
- [ ] Dress Up: equip/unequip, colours, random, favourites, buy locked items
- [ ] Love Notes: favourite, surprise, personal notes
- [ ] Daddy Mode: set PIN, wrong PIN, create/edit/delete/preview, dated message hidden until its day, send-now, export/import
- [ ] Settings: sound/music/volume/animations/theme; backup export → reset → restore
- [ ] Offline: open the site once, go offline (or stop the server), reload – everything works
- [ ] Android: airplane mode launch; back button closes dialogs, pauses games, then goes back; Home → back minimises

## Verified here vs. not verified
Verified in this repo: type-check clean; engine unit tests; production build; in the browser – all routes load, Memory game played to victory, Bubble Pop playable (shots, pops, score, ceiling drop), Baby Room add/persist, Dress-up favourites, Daddy Mode PIN + message creation + hidden-until-date, reward claim + refresh persistence, and **offline reload with the server stopped**.

**Not verified:** the Android build. This machine has no JDK/Android SDK, so the APK/AAB was **not built or run on an emulator/device**. The Android project is generated and synced (`android/app/src/main/assets/public`), but the Android-only behaviour (back button, status bar, share-sheet export, splash, safe areas, haptics) is untested on a device.

## Limitations
- Memory cards (except the teddy theme) use emoji glyphs from the device font; they look slightly different on each OS.
- Bubble Pop ends when bubbles reach the dotted line; levels are procedurally generated (random each play).
- Music is a simple generated lullaby loop; it starts only after a tap when enabled.
- No cloud sync: moving to a new phone needs an exported backup.
- Pregnancy week and journey are purely for fun – no medical content.
