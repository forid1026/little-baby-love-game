// Generates PWA icons + Android launcher/splash source art from SVG (run: node scripts/generate-icons.mjs)
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

const face = (s = 1) => `
<g transform="translate(512 540) scale(${s})">
  <circle cx="-300" cy="-20" r="78" fill="#FFD9C7"/><circle cx="300" cy="-20" r="78" fill="#FFD9C7"/>
  <circle cx="-300" cy="-20" r="36" fill="#FFB9A6" opacity=".7"/><circle cx="300" cy="-20" r="36" fill="#FFB9A6" opacity=".7"/>
  <circle cx="0" cy="0" r="340" fill="#FFD9C7" stroke="#F2B9A3" stroke-width="10"/>
  <path d="M-60 -330 Q-20 -420 40 -350 Q70 -420 120 -340" stroke="#C9926B" stroke-width="30" fill="none" stroke-linecap="round"/>
  <ellipse cx="-130" cy="-10" rx="38" ry="50" fill="#4a3340"/><ellipse cx="130" cy="-10" rx="38" ry="50" fill="#4a3340"/>
  <circle cx="-118" cy="-32" r="14" fill="#fff"/><circle cx="142" cy="-32" r="14" fill="#fff"/>
  <ellipse cx="-210" cy="110" rx="62" ry="40" fill="#FFA3B8" opacity=".6"/><ellipse cx="210" cy="110" rx="62" ry="40" fill="#FFA3B8" opacity=".6"/>
  <path d="M-70 120 Q0 200 70 120" stroke="#B5546F" stroke-width="22" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="70" rx="18" ry="12" fill="#E9A28C"/>
  <path transform="translate(230 -300) scale(7)" d="M0 8 C-14 -2 -10 -14 0 -6 C10 -14 14 -2 0 8Z" fill="#E27AA3"/>
</g>`
const bg = (rx = 224) => `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE3EE"/><stop offset="1" stop-color="#F4BFD3"/></linearGradient></defs><rect width="1024" height="1024" rx="${rx}" fill="url(#g)"/>`
const wrap = (inner, size = 1024) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">${inner}</svg>`

const iconRounded = wrap(bg() + face(1))
const iconMaskable = wrap(bg(0) + face(0.78))
const foreground = wrap(face(0.62)) // adaptive icon foreground (safe zone)
const background = wrap(`<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFE3EE"/><stop offset="1" stop-color="#F4BFD3"/></linearGradient></defs><rect width="1024" height="1024" fill="url(#g)"/>`)
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="2732" height="2732" viewBox="0 0 2732 2732"><rect width="2732" height="2732" fill="#FFF8EF"/><g transform="translate(854 700) scale(1.0)">${face(1).replace('translate(512 540)', 'translate(512 440)')}</g><text x="1366" y="1700" text-anchor="middle" font-family="Arial, sans-serif" font-weight="800" font-size="150" fill="#C45C86">Little Baby Love</text><text x="1366" y="1850" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="84" fill="#8C7884">Mommy's Happy World</text></svg>`

writeFileSync('public/favicon.svg', iconRounded)
const png = (svg, size, out) => sharp(Buffer.from(svg)).resize(size, size).png().toFile(out)
await Promise.all([
  png(iconRounded, 192, 'public/icons/icon-192.png'),
  png(iconRounded, 512, 'public/icons/icon-512.png'),
  png(iconMaskable, 512, 'public/icons/icon-maskable-512.png'),
  png(iconMaskable, 180, 'public/icons/apple-touch-icon.png'),
  png(iconRounded, 1024, 'assets/icon-only.png'),
  png(foreground, 1024, 'assets/icon-foreground.png'),
  png(background, 1024, 'assets/icon-background.png'),
  sharp(Buffer.from(splashSvg)).png().toFile('assets/splash.png'),
  sharp(Buffer.from(splashSvg)).png().toFile('assets/splash-dark.png'),
])
console.log('icons generated')
