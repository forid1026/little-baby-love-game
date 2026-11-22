// Nursery decoration catalogue. All artwork is inline SVG (viewBox 0 0 100 100), drawn here – no image files.
export type RoomCat = 'furniture' | 'toys' | 'wall' | 'sky' | 'soft' | 'window'
export interface RoomItem {
  id: string
  name: string
  cat: RoomCat
  price: number // 0 = free from the start; -1 = reward only
  w: number // default width in % of the room
  y: number // default vertical position in %
  art: string
}

const bars = (x1: number, x2: number, y1: number, y2: number, n: number, c: string, sw = 2) =>
  Array.from({ length: n }, (_, i) => {
    const x = x1 + ((x2 - x1) * i) / (n - 1)
    return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`
  }).join('')

const bearArt = (fur: string, inner: string, extra = '') =>
  `<circle cx="28" cy="26" r="11" fill="${fur}"/><circle cx="72" cy="26" r="11" fill="${fur}"/><circle cx="28" cy="26" r="6" fill="${inner}"/><circle cx="72" cy="26" r="6" fill="${inner}"/>` +
  `<ellipse cx="50" cy="78" rx="26" ry="20" fill="${fur}"/><ellipse cx="50" cy="80" rx="15" ry="12" fill="${inner}"/>` +
  `<circle cx="22" cy="72" r="8" fill="${fur}"/><circle cx="78" cy="72" r="8" fill="${fur}"/><ellipse cx="36" cy="94" rx="10" ry="6" fill="${fur}"/><ellipse cx="64" cy="94" rx="10" ry="6" fill="${fur}"/>` +
  `<circle cx="50" cy="40" r="26" fill="${fur}"/><ellipse cx="50" cy="48" rx="11" ry="8" fill="${inner}"/><ellipse cx="50" cy="45" rx="4" ry="3" fill="#6b4553"/>` +
  `<circle cx="40" cy="36" r="3" fill="#4a3340"/><circle cx="60" cy="36" r="3" fill="#4a3340"/><path d="M45 52 Q50 56 55 52" stroke="#6b4553" stroke-width="1.6" fill="none" stroke-linecap="round"/>${extra}`

const star = (cx: number, cy: number, r: number, fill: string) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = i % 2 ? r * 0.45 : r
    return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`
  }).join(' ')
  return `<polygon points="${pts}" fill="${fill}" stroke="#fff" stroke-width="1" stroke-linejoin="round"/>`
}
const heart = (cx: number, cy: number, s: number, fill: string) =>
  `<path transform="translate(${cx} ${cy}) scale(${s})" d="M0 8 C-14 -2 -10 -14 0 -6 C10 -14 14 -2 0 8Z" fill="${fill}"/>`

export const ROOM_ITEMS: RoomItem[] = [
  // ---------- Furniture ----------
  { id: 'crib_classic', name: 'Classic Crib', cat: 'furniture', price: 0, w: 38, y: 66,
    art: `<rect x="8" y="30" width="84" height="48" rx="8" fill="#FFF8EF" stroke="#E27AA3" stroke-width="3"/>${bars(18, 82, 34, 74, 8, '#F4BFD3', 3)}<rect x="12" y="52" width="76" height="18" rx="7" fill="#F8DDE8"/><rect x="12" y="52" width="76" height="6" rx="3" fill="#fff"/><rect x="6" y="22" width="8" height="70" rx="4" fill="#E27AA3"/><rect x="86" y="22" width="8" height="70" rx="4" fill="#E27AA3"/>${heart(50, 62, 1.3, '#E27AA3')}` },
  { id: 'crib_cloud', name: 'Cloud Crib', cat: 'furniture', price: 150, w: 38, y: 66,
    art: `<rect x="8" y="30" width="84" height="48" rx="12" fill="#EAF5FF" stroke="#8DBDE8" stroke-width="3"/>${bars(18, 82, 34, 74, 8, '#BFE0F8', 3)}<rect x="12" y="52" width="76" height="18" rx="7" fill="#fff"/><circle cx="34" cy="20" r="11" fill="#fff" stroke="#8DBDE8" stroke-width="2"/><circle cx="50" cy="14" r="13" fill="#fff" stroke="#8DBDE8" stroke-width="2"/><circle cx="66" cy="20" r="11" fill="#fff" stroke="#8DBDE8" stroke-width="2"/><rect x="26" y="19" width="48" height="12" fill="#fff"/><rect x="6" y="40" width="8" height="52" rx="4" fill="#8DBDE8"/><rect x="86" y="40" width="8" height="52" rx="4" fill="#8DBDE8"/>` },
  { id: 'wardrobe', name: 'Baby Wardrobe', cat: 'furniture', price: 80, w: 26, y: 62,
    art: `<rect x="14" y="8" width="72" height="84" rx="8" fill="#F8DDE8" stroke="#C45C86" stroke-width="3"/><rect x="20" y="14" width="28" height="72" rx="5" fill="#FFF8EF" stroke="#E27AA3" stroke-width="2"/><rect x="52" y="14" width="28" height="72" rx="5" fill="#FFF8EF" stroke="#E27AA3" stroke-width="2"/><circle cx="43" cy="50" r="3" fill="#C45C86"/><circle cx="57" cy="50" r="3" fill="#C45C86"/>${heart(34, 32, 1.1, '#F4BFD3')}${star(66, 32, 8, '#F6C453')}<rect x="20" y="92" width="8" height="6" rx="2" fill="#C45C86"/><rect x="72" y="92" width="8" height="6" rx="2" fill="#C45C86"/>` },
  { id: 'bookshelf', name: 'Bookshelf', cat: 'furniture', price: 60, w: 24, y: 58,
    art: `<rect x="12" y="8" width="76" height="86" rx="5" fill="#FFE4D5" stroke="#EE8F66" stroke-width="3"/><line x1="14" y1="36" x2="86" y2="36" stroke="#EE8F66" stroke-width="3"/><line x1="14" y1="64" x2="86" y2="64" stroke="#EE8F66" stroke-width="3"/><rect x="20" y="16" width="9" height="20" fill="#E27AA3"/><rect x="30" y="12" width="9" height="24" fill="#8DBDE8"/><rect x="40" y="18" width="9" height="18" fill="#F6C453"/><rect x="56" y="14" width="10" height="22" fill="#B9A4F0"/><rect x="68" y="18" width="9" height="18" fill="#5FBE8C"/><rect x="20" y="44" width="12" height="20" fill="#8DBDE8"/><rect x="33" y="48" width="9" height="16" fill="#E27AA3"/><circle cx="66" cy="54" r="9" fill="#fff" stroke="#EE8F66" stroke-width="2"/><rect x="22" y="74" width="56" height="20" rx="4" fill="#F8DDE8"/><rect x="26" y="78" width="14" height="12" fill="#B9A4F0"/><rect x="44" y="78" width="14" height="12" fill="#F6C453"/>` },
  { id: 'changing_table', name: 'Changing Table', cat: 'furniture', price: 70, w: 30, y: 66,
    art: `<rect x="8" y="30" width="84" height="12" rx="6" fill="#fff" stroke="#8DBDE8" stroke-width="3"/><rect x="12" y="42" width="76" height="40" rx="5" fill="#DCEEFF" stroke="#8DBDE8" stroke-width="3"/><rect x="18" y="48" width="64" height="12" rx="3" fill="#fff" stroke="#8DBDE8" stroke-width="2"/><rect x="18" y="64" width="64" height="12" rx="3" fill="#fff" stroke="#8DBDE8" stroke-width="2"/><circle cx="50" cy="54" r="2.5" fill="#8DBDE8"/><circle cx="50" cy="70" r="2.5" fill="#8DBDE8"/><rect x="14" y="82" width="8" height="12" rx="3" fill="#8DBDE8"/><rect x="78" y="82" width="8" height="12" rx="3" fill="#8DBDE8"/>${heart(24, 24, 1, '#F4BFD3')}` },
  { id: 'toy_chest', name: 'Toy Chest', cat: 'furniture', price: 50, w: 22, y: 72,
    art: `<path d="M10 44 Q50 14 90 44Z" fill="#B9A4F0" stroke="#7C63C4" stroke-width="3" stroke-linejoin="round"/><rect x="10" y="44" width="80" height="44" rx="6" fill="#E8DFFF" stroke="#7C63C4" stroke-width="3"/><rect x="42" y="42" width="16" height="14" rx="3" fill="#F6C453" stroke="#C99A2E" stroke-width="2"/>${star(26, 68, 8, '#F6C453')}${heart(74, 68, 1.2, '#E27AA3')}` },
  { id: 'rocking_chair', name: 'Rocking Chair', cat: 'furniture', price: 90, w: 24, y: 68,
    art: `<path d="M26 10 Q22 40 28 62 L72 62 Q78 40 74 10Z" fill="#FFE4D5" stroke="#EE8F66" stroke-width="3" stroke-linejoin="round"/><rect x="24" y="58" width="52" height="12" rx="6" fill="#F8DDE8" stroke="#E27AA3" stroke-width="3"/><path d="M12 88 Q50 100 88 88" stroke="#EE8F66" stroke-width="5" fill="none" stroke-linecap="round"/><line x1="30" y1="70" x2="26" y2="90" stroke="#EE8F66" stroke-width="4"/><line x1="70" y1="70" x2="74" y2="90" stroke="#EE8F66" stroke-width="4"/>${heart(50, 34, 1.5, '#F4BFD3')}` },

  // ---------- Soft: lamps, rugs, curtains ----------
  { id: 'lamp_night', name: 'Night Lamp', cat: 'soft', price: 0, w: 12, y: 54,
    art: `<circle cx="50" cy="40" r="34" fill="#FFF3B8" opacity=".5"/><path d="M28 24 L72 24 L62 56 L38 56Z" fill="#F6C453" stroke="#C99A2E" stroke-width="2.5" stroke-linejoin="round"/><rect x="45" y="56" width="10" height="22" fill="#C99A2E"/><ellipse cx="50" cy="82" rx="18" ry="7" fill="#C99A2E"/>${heart(50, 40, 1, '#fff')}` },
  { id: 'lamp_star', name: 'Star Lamp', cat: 'soft', price: 60, w: 13, y: 54,
    art: `<circle cx="50" cy="36" r="36" fill="#E8DFFF" opacity=".6"/>${star(50, 36, 28, '#F6C453')}<rect x="46" y="62" width="8" height="16" fill="#7C63C4"/><ellipse cx="50" cy="82" rx="18" ry="7" fill="#7C63C4"/>` },
  { id: 'rug_round', name: 'Round Rug', cat: 'soft', price: 0, w: 42, y: 86,
    art: `<ellipse cx="50" cy="55" rx="46" ry="26" fill="#F4BFD3" stroke="#E27AA3" stroke-width="3"/><ellipse cx="50" cy="55" rx="34" ry="18" fill="#FFF8EF"/><ellipse cx="50" cy="55" rx="22" ry="11" fill="#F8DDE8"/>${heart(50, 55, 1.1, '#E27AA3')}` },
  { id: 'rug_heart', name: 'Heart Rug', cat: 'soft', price: 70, w: 40, y: 86,
    art: `<path d="M50 88 C-8 52 8 14 50 38 C92 14 108 52 50 88Z" transform="translate(0 -6) scale(1 .62) translate(0 22)" fill="#F4BFD3" stroke="#E27AA3" stroke-width="3"/><path d="M50 80 C10 52 20 28 50 46 C80 28 90 52 50 80Z" transform="translate(0 4) scale(1 .62) translate(0 14)" fill="#FFF8EF"/>` },
  { id: 'rug_star', name: 'Star Rug', cat: 'soft', price: 90, w: 40, y: 86,
    art: `<ellipse cx="50" cy="55" rx="46" ry="26" fill="#CDBBFA" stroke="#7C63C4" stroke-width="3"/>${star(50, 55, 30, '#FFF3B8')}` },
  { id: 'curtains_pink', name: 'Pink Curtains', cat: 'soft', price: 0, w: 34, y: 30,
    art: `<rect x="4" y="6" width="92" height="5" rx="2.5" fill="#C45C86"/><path d="M8 10 Q26 30 14 90 L6 90Z M8 10 L44 10 Q34 50 40 90 L14 90 Q26 40 8 10" fill="#F4BFD3"/><path d="M92 10 Q74 30 86 90 L94 90Z M92 10 L56 10 Q66 50 60 90 L86 90 Q74 40 92 10" fill="#F4BFD3"/><path d="M14 10 Q22 50 18 90 M30 10 Q36 50 30 90 M86 10 Q78 50 82 90 M70 10 Q64 50 70 90" stroke="#E27AA3" stroke-width="2" fill="none"/>` },
  { id: 'curtains_blue', name: 'Sky Curtains', cat: 'soft', price: 60, w: 34, y: 30,
    art: `<rect x="4" y="6" width="92" height="5" rx="2.5" fill="#3F82B8"/><path d="M8 10 L44 10 Q34 50 40 90 L8 90Z" fill="#BFE0F8"/><path d="M92 10 L56 10 Q66 50 60 90 L92 90Z" fill="#BFE0F8"/><path d="M20 10 Q24 50 18 90 M32 10 Q36 50 30 90 M80 10 Q76 50 82 90 M68 10 Q64 50 70 90" stroke="#8DBDE8" stroke-width="2" fill="none"/>${star(24, 40, 6, '#fff')}${star(76, 40, 6, '#fff')}` },

  // ---------- Windows ----------
  { id: 'window_day', name: 'Sunny Window', cat: 'window', price: 0, w: 26, y: 32,
    art: `<rect x="10" y="8" width="80" height="84" rx="10" fill="#fff" stroke="#C45C86" stroke-width="4"/><rect x="17" y="15" width="66" height="70" rx="5" fill="#BFE0F8"/><circle cx="64" cy="34" r="11" fill="#FFE27A"/><ellipse cx="38" cy="56" rx="16" ry="8" fill="#fff"/><ellipse cx="50" cy="52" rx="12" ry="9" fill="#fff"/><line x1="50" y1="15" x2="50" y2="85" stroke="#fff" stroke-width="4"/><line x1="17" y1="50" x2="83" y2="50" stroke="#fff" stroke-width="4"/><rect x="6" y="88" width="88" height="7" rx="3.5" fill="#C45C86"/>` },
  { id: 'window_night', name: 'Starry Window', cat: 'window', price: 80, w: 26, y: 32,
    art: `<rect x="10" y="8" width="80" height="84" rx="10" fill="#fff" stroke="#7C63C4" stroke-width="4"/><rect x="17" y="15" width="66" height="70" rx="5" fill="#4B4380"/><path d="M62 28 a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22z" fill="#FFF3B8"/>${star(30, 36, 5, '#FFF3B8')}${star(36, 64, 4, '#FFF3B8')}${star(68, 68, 4, '#FFF3B8')}<line x1="50" y1="15" x2="50" y2="85" stroke="#fff" stroke-width="4"/><line x1="17" y1="50" x2="83" y2="50" stroke="#fff" stroke-width="4"/><rect x="6" y="88" width="88" height="7" rx="3.5" fill="#7C63C4"/>` },

  // ---------- Wall decorations ----------
  { id: 'frame_bear', name: 'Teddy Frame', cat: 'wall', price: 0, w: 15, y: 22,
    art: `<rect x="10" y="10" width="80" height="80" rx="10" fill="#fff" stroke="#E27AA3" stroke-width="4"/><rect x="18" y="18" width="64" height="64" rx="5" fill="#FFE4D5"/><g transform="translate(24 22) scale(.52)">${bearArt('#E7B98A', '#F6DDC0')}</g>` },
  { id: 'frame_heart', name: 'Heart Frame', cat: 'wall', price: 40, w: 14, y: 22,
    art: `<rect x="10" y="10" width="80" height="80" rx="10" fill="#fff" stroke="#B9A4F0" stroke-width="4"/><rect x="18" y="18" width="64" height="64" rx="5" fill="#E8DFFF"/>${heart(50, 48, 3.2, '#E27AA3')}` },
  { id: 'garland', name: 'BABY Garland', cat: 'wall', price: 50, w: 36, y: 14,
    art: `<path d="M2 10 Q50 40 98 10" stroke="#C45C86" stroke-width="2" fill="none"/>${['B', 'A', 'B', 'Y'].map((l, i) => { const x = 16 + i * 22; const y = 22 + Math.sin(((x - 2) / 96) * Math.PI) * 14; const c = ['#F4BFD3', '#BFE0F8', '#FFD2B9', '#CDBBFA'][i]; return `<path d="M${x - 9} ${y - 4} L${x + 9} ${y - 4} L${x} ${y + 18}Z" fill="${c}" stroke="#fff" stroke-width="1.5"/><text x="${x}" y="${y + 6}" text-anchor="middle" font-size="9" font-weight="900" fill="#604C59" font-family="sans-serif">${l}</text>` }).join('')}` },
  { id: 'bunting', name: 'Flag Bunting', cat: 'wall', price: 40, w: 36, y: 12,
    art: `<path d="M2 8 Q50 34 98 8" stroke="#8C7884" stroke-width="1.5" fill="none"/>${Array.from({ length: 7 }, (_, i) => { const x = 10 + i * 13; const y = 8 + Math.sin(((x - 2) / 96) * Math.PI) * 18; return `<path d="M${x - 6} ${y + 1} L${x + 6} ${y + 1} L${x} ${y + 17}Z" fill="${['#F4BFD3', '#BFE0F8', '#FFE27A', '#CDBBFA', '#C9EBD5', '#FFD2B9', '#F4BFD3'][i]}"/>` }).join('')}` },
  { id: 'rainbow', name: 'Rainbow', cat: 'wall', price: 60, w: 30, y: 24,
    art: `<path d="M8 80 A42 42 0 0 1 92 80" stroke="#F4A0B9" stroke-width="9" fill="none"/><path d="M17 80 A33 33 0 0 1 83 80" stroke="#FFD27A" stroke-width="9" fill="none"/><path d="M26 80 A24 24 0 0 1 74 80" stroke="#A8E0BF" stroke-width="9" fill="none"/><path d="M35 80 A15 15 0 0 1 65 80" stroke="#A9D4F5" stroke-width="9" fill="none"/><ellipse cx="14" cy="82" rx="14" ry="8" fill="#fff"/><ellipse cx="86" cy="82" rx="14" ry="8" fill="#fff"/>` },

  // ---------- Sky: moon, stars, balloons ----------
  { id: 'moon', name: 'Sleepy Moon', cat: 'sky', price: 50, w: 14, y: 14,
    art: `<path d="M64 8 a42 42 0 1 0 28 62 a34 34 0 1 1 -28 -62z" fill="#FFE27A" stroke="#F0C040" stroke-width="2.5"/><path d="M30 52 q5 4 10 0" stroke="#8A6A1E" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="26" cy="62" r="4" fill="#FFB3C6" opacity=".8"/>` },
  { id: 'star_big', name: 'Twinkle Star', cat: 'sky', price: 30, w: 11, y: 14,
    art: `${star(50, 52, 42, '#FFE27A')}<circle cx="42" cy="50" r="2.5" fill="#6b4553"/><circle cx="58" cy="50" r="2.5" fill="#6b4553"/><path d="M45 58 q5 4 10 0" stroke="#6b4553" stroke-width="2" fill="none" stroke-linecap="round"/>` },
  { id: 'mobile', name: 'Hanging Mobile', cat: 'sky', price: 80, w: 20, y: 18,
    art: `<line x1="50" y1="0" x2="50" y2="22" stroke="#8C7884" stroke-width="2"/><line x1="14" y1="22" x2="86" y2="22" stroke="#8C7884" stroke-width="3" stroke-linecap="round"/>${[[16, '#F4BFD3'], [50, '#BFE0F8'], [84, '#FFE27A']].map(([x, c]) => `<line x1="${x}" y1="22" x2="${x}" y2="46" stroke="#8C7884" stroke-width="1.5"/>${star(Number(x), 58, 13, String(c))}`).join('')}` },
  { id: 'balloons', name: 'Balloons', cat: 'sky', price: 40, w: 16, y: 40,
    art: `<path d="M30 52 Q40 80 52 96 M54 46 Q50 76 52 96 M76 52 Q66 78 52 96" stroke="#8C7884" stroke-width="1.5" fill="none"/><ellipse cx="30" cy="34" rx="16" ry="20" fill="#F4BFD3"/><ellipse cx="54" cy="26" rx="16" ry="20" fill="#BFE0F8"/><ellipse cx="76" cy="36" rx="15" ry="19" fill="#FFE27A"/><ellipse cx="24" cy="26" rx="4" ry="6" fill="#fff" opacity=".6"/><ellipse cx="48" cy="18" rx="4" ry="6" fill="#fff" opacity=".6"/>` },
  { id: 'cloud', name: 'Fluffy Cloud', cat: 'sky', price: 30, w: 18, y: 18,
    art: `<g fill="#fff" stroke="#BFE0F8" stroke-width="2.5"><circle cx="30" cy="58" r="20"/><circle cx="52" cy="44" r="26"/><circle cx="74" cy="58" r="20"/><rect x="26" y="52" width="52" height="26" stroke="none"/></g><rect x="28" y="56" width="48" height="24" fill="#fff"/><circle cx="42" cy="58" r="2.5" fill="#6b4553"/><circle cx="62" cy="58" r="2.5" fill="#6b4553"/><path d="M48 64 q4 3 8 0" stroke="#6b4553" stroke-width="1.8" fill="none" stroke-linecap="round"/>` },
  { id: 'butterflies', name: 'Butterflies', cat: 'sky', price: 40, w: 16, y: 40,
    art: `<g transform="translate(14 30) rotate(-15 20 20)"><ellipse cx="12" cy="14" rx="12" ry="14" fill="#F4BFD3"/><ellipse cx="30" cy="14" rx="12" ry="14" fill="#F4BFD3"/><ellipse cx="14" cy="32" rx="8" ry="9" fill="#E27AA3"/><ellipse cx="28" cy="32" rx="8" ry="9" fill="#E27AA3"/><rect x="19" y="8" width="4" height="30" rx="2" fill="#604C59"/></g><g transform="translate(52 6) scale(.7) rotate(15 20 20)"><ellipse cx="12" cy="14" rx="12" ry="14" fill="#CDBBFA"/><ellipse cx="30" cy="14" rx="12" ry="14" fill="#CDBBFA"/><ellipse cx="14" cy="32" rx="8" ry="9" fill="#9A82E0"/><ellipse cx="28" cy="32" rx="8" ry="9" fill="#9A82E0"/><rect x="19" y="8" width="4" height="30" rx="2" fill="#604C59"/></g>` },

  // ---------- Toys ----------
  { id: 'teddy', name: 'Teddy Bear', cat: 'toys', price: 0, w: 14, y: 76, art: bearArt('#E7B98A', '#F6DDC0', '<path d="M38 66 L50 60 L62 66 L50 72Z" fill="#E27AA3"/>') },
  { id: 'teddy_big', name: 'Big Teddy', cat: 'toys', price: 100, w: 24, y: 72, art: bearArt('#F6DDC0', '#FFF3E4', '<path d="M34 64 Q50 76 66 64" stroke="#8DBDE8" stroke-width="6" fill="none" stroke-linecap="round"/>') },
  { id: 'teddy_golden', name: 'Golden Teddy', cat: 'toys', price: -1, w: 22, y: 72, art: bearArt('#F6C453', '#FFE9A8', `<path d="M36 12 L42 2 L50 10 L58 2 L64 12Z" fill="#E27AA3"/>${star(50, 82, 6, '#fff')}`) },
  { id: 'bunny', name: 'Plush Bunny', cat: 'toys', price: 60, w: 15, y: 76,
    art: `<ellipse cx="36" cy="18" rx="8" ry="20" fill="#fff" stroke="#F4BFD3" stroke-width="2"/><ellipse cx="64" cy="18" rx="8" ry="20" fill="#fff" stroke="#F4BFD3" stroke-width="2"/><ellipse cx="36" cy="20" rx="4" ry="13" fill="#F4BFD3"/><ellipse cx="64" cy="20" rx="4" ry="13" fill="#F4BFD3"/><ellipse cx="50" cy="80" rx="22" ry="17" fill="#fff" stroke="#F4BFD3" stroke-width="2"/><circle cx="50" cy="50" r="24" fill="#fff" stroke="#F4BFD3" stroke-width="2"/><circle cx="42" cy="48" r="3" fill="#4a3340"/><circle cx="58" cy="48" r="3" fill="#4a3340"/><ellipse cx="50" cy="55" rx="3.5" ry="2.5" fill="#E27AA3"/><circle cx="36" cy="57" r="4" fill="#FFB3C6" opacity=".7"/><circle cx="64" cy="57" r="4" fill="#FFB3C6" opacity=".7"/><circle cx="70" cy="88" r="6" fill="#fff" stroke="#F4BFD3" stroke-width="2"/>` },
  { id: 'duck', name: 'Rubber Duck', cat: 'toys', price: 40, w: 12, y: 80,
    art: `<ellipse cx="50" cy="70" rx="34" ry="24" fill="#FFE27A" stroke="#F0C040" stroke-width="2.5"/><path d="M70 62 Q92 56 88 72 Q80 70 70 72Z" fill="#FFE27A" stroke="#F0C040" stroke-width="2"/><circle cx="36" cy="40" r="20" fill="#FFE27A" stroke="#F0C040" stroke-width="2.5"/><path d="M16 42 L2 46 L16 52Z" fill="#FFA45C"/><circle cx="34" cy="36" r="3" fill="#4a3340"/><circle cx="28" cy="46" r="3.5" fill="#FFB3C6" opacity=".8"/>` },
  { id: 'blocks', name: 'ABC Blocks', cat: 'toys', price: 30, w: 14, y: 80,
    art: `<rect x="8" y="52" width="38" height="38" rx="5" fill="#F4BFD3" stroke="#E27AA3" stroke-width="2.5"/><rect x="50" y="52" width="38" height="38" rx="5" fill="#BFE0F8" stroke="#5FA3D9" stroke-width="2.5"/><rect x="28" y="12" width="38" height="38" rx="5" fill="#FFE27A" stroke="#F0C040" stroke-width="2.5"/><g font-family="sans-serif" font-weight="900" font-size="22" fill="#fff" text-anchor="middle"><text x="27" y="80">A</text><text x="69" y="80">B</text><text x="47" y="40">C</text></g>` },
  { id: 'rocking_horse', name: 'Rocking Horse', cat: 'toys', price: 120, w: 22, y: 74,
    art: `<path d="M8 86 Q50 102 92 86" stroke="#C99A2E" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M26 44 Q22 30 34 24 L44 10 L50 26 Q70 22 78 40 L76 66 L66 66 L64 54 L40 54 L38 80 L28 80Z" fill="#FFE4D5" stroke="#EE8F66" stroke-width="3" stroke-linejoin="round"/><circle cx="44" cy="30" r="2.5" fill="#4a3340"/><path d="M52 24 Q64 30 62 44" stroke="#E27AA3" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M36 54 Q50 64 66 54 L66 62 Q50 70 36 62Z" fill="#E27AA3"/>` },
  { id: 'ball', name: 'Play Ball', cat: 'toys', price: 20, w: 9, y: 82,
    art: `<circle cx="50" cy="50" r="42" fill="#fff" stroke="#E27AA3" stroke-width="3"/><path d="M50 8 Q30 50 50 92 M8 50 Q50 34 92 50" stroke="#E27AA3" stroke-width="5" fill="none"/><path d="M20 22 Q50 40 80 22 M20 78 Q50 60 80 78" stroke="#5FA3D9" stroke-width="5" fill="none"/>` },
  { id: 'train', name: 'Toy Train', cat: 'toys', price: 90, w: 24, y: 82,
    art: `<rect x="8" y="42" width="40" height="34" rx="6" fill="#E27AA3" stroke="#C45C86" stroke-width="2.5"/><rect x="34" y="26" width="22" height="50" rx="5" fill="#F4BFD3" stroke="#C45C86" stroke-width="2.5"/><rect x="14" y="26" width="14" height="16" rx="3" fill="#FFE27A"/><rect x="38" y="32" width="14" height="14" rx="3" fill="#fff"/><rect x="58" y="50" width="34" height="26" rx="5" fill="#8DBDE8" stroke="#3F82B8" stroke-width="2.5"/><circle cx="24" cy="80" r="9" fill="#604C59"/><circle cx="46" cy="80" r="9" fill="#604C59"/><circle cx="68" cy="80" r="8" fill="#604C59"/><circle cx="84" cy="80" r="8" fill="#604C59"/><circle cx="24" cy="80" r="3" fill="#fff"/><circle cx="46" cy="80" r="3" fill="#fff"/>` },
  { id: 'bottle', name: 'Baby Bottle', cat: 'toys', price: 20, w: 7, y: 78,
    art: `<path d="M38 8 Q50 -2 62 8 L62 24 L38 24Z" fill="#F4BFD3" stroke="#E27AA3" stroke-width="3"/><rect x="34" y="22" width="32" height="8" rx="3" fill="#E27AA3"/><rect x="30" y="30" width="40" height="62" rx="12" fill="#fff" stroke="#8DBDE8" stroke-width="3"/><rect x="34" y="58" width="32" height="30" rx="9" fill="#F8F0FF"/><g stroke="#8DBDE8" stroke-width="2"><line x1="30" y1="44" x2="40" y2="44"/><line x1="30" y1="56" x2="40" y2="56"/></g>${heart(50, 72, 1.1, '#F4BFD3')}` },

  // ---------- Plants & flowers ----------
  { id: 'flowers_vase', name: 'Flower Vase', cat: 'soft', price: 30, w: 11, y: 56,
    art: `<path d="M34 54 L66 54 L60 92 L40 92Z" fill="#BFE0F8" stroke="#5FA3D9" stroke-width="3" stroke-linejoin="round"/><g stroke="#5FBE8C" stroke-width="3" stroke-linecap="round"><line x1="50" y1="54" x2="50" y2="20"/><line x1="44" y1="54" x2="30" y2="30"/><line x1="56" y1="54" x2="70" y2="30"/></g><circle cx="50" cy="16" r="9" fill="#F4BFD3"/><circle cx="50" cy="16" r="3.5" fill="#FFE27A"/><circle cx="28" cy="26" r="8" fill="#FFE27A"/><circle cx="28" cy="26" r="3" fill="#EE8F66"/><circle cx="72" cy="26" r="8" fill="#CDBBFA"/><circle cx="72" cy="26" r="3" fill="#FFE27A"/>` },
  { id: 'plant_pot', name: 'Happy Plant', cat: 'soft', price: 30, w: 13, y: 74,
    art: `<path d="M50 60 Q20 50 18 20 Q46 22 50 60Z" fill="#7BD0A0" stroke="#4BAF7A" stroke-width="2"/><path d="M50 60 Q80 50 82 20 Q54 22 50 60Z" fill="#9FE0B8" stroke="#4BAF7A" stroke-width="2"/><path d="M50 60 Q42 36 50 8 Q58 36 50 60Z" fill="#7BD0A0" stroke="#4BAF7A" stroke-width="2"/><path d="M28 60 L72 60 L66 94 L34 94Z" fill="#FFD2B9" stroke="#EE8F66" stroke-width="3" stroke-linejoin="round"/><circle cx="44" cy="76" r="2.5" fill="#4a3340"/><circle cx="56" cy="76" r="2.5" fill="#4a3340"/><path d="M47 83 q3 3 6 0" stroke="#4a3340" stroke-width="1.8" fill="none" stroke-linecap="round"/>` },
]

export const roomItemById = (id: string) => ROOM_ITEMS.find(i => i.id === id)
export const ROOM_CATS: Array<{ id: RoomCat; label: string }> = [
  { id: 'furniture', label: 'Furniture' },
  { id: 'toys', label: 'Toys' },
  { id: 'soft', label: 'Cozy' },
  { id: 'wall', label: 'Wall' },
  { id: 'window', label: 'Windows' },
  { id: 'sky', label: 'Sky' },
]

export interface Paint { id: string; name: string; price: number; css: string }
export const WALLS: Paint[] = [
  { id: 'wall_blush', name: 'Blush Hearts', price: 0, css: 'radial-gradient(circle at 20px 20px,#fff8 3px,transparent 4px) 0 0/40px 40px,linear-gradient(#FDE3EC,#F8CFDE)' },
  { id: 'wall_cream', name: 'Cream Dots', price: 0, css: 'radial-gradient(circle at 20px 20px,#F4BFD355 4px,transparent 5px) 0 0/40px 40px,linear-gradient(#FFF8EF,#FFF1DE)' },
  { id: 'wall_sky', name: 'Sky Stripes', price: 40, css: 'repeating-linear-gradient(90deg,#fff6 0 18px,transparent 18px 36px),linear-gradient(#DCEEFF,#C4E0F8)' },
  { id: 'wall_lavender', name: 'Lavender Stars', price: 50, css: 'radial-gradient(circle at 25px 25px,#fffa 2.5px,transparent 3.5px) 0 0/50px 50px,linear-gradient(#EDE5FF,#D9CBFA)' },
  { id: 'wall_peach', name: 'Peach Glow', price: 50, css: 'linear-gradient(#FFEBDD,#FFD3BA)' },
  { id: 'wall_mint', name: 'Mint Meadow', price: 60, css: 'repeating-linear-gradient(0deg,#fff5 0 2px,transparent 2px 24px),linear-gradient(#E4F8EC,#C7EBD5)' },
  { id: 'wall_night', name: 'Dreamy Night', price: 90, css: 'radial-gradient(circle at 18px 18px,#FFF3B8 1.6px,transparent 2.4px) 0 0/36px 36px,linear-gradient(#6C63B0,#4B4380)' },
]
export const FLOORS: Paint[] = [
  { id: 'floor_wood', name: 'Light Wood', price: 0, css: 'repeating-linear-gradient(90deg,#0000 0 58px,#C98F5C33 58px 60px),linear-gradient(#F0CFA6,#E5B986)' },
  { id: 'floor_pink', name: 'Pink Carpet', price: 30, css: 'linear-gradient(#F9D3E1,#F2B8CE)' },
  { id: 'floor_blue', name: 'Blue Check', price: 40, css: 'conic-gradient(#CBE4F8 25%,#E6F3FC 0 50%,#CBE4F8 0 75%,#E6F3FC 0) 0 0/48px 48px' },
  { id: 'floor_grass', name: 'Soft Grass', price: 50, css: 'linear-gradient(#BEEAD0,#9FD9B8)' },
]
export const wallById = (id: string) => WALLS.find(w => w.id === id) ?? WALLS[0]!
export const floorById = (id: string) => FLOORS.find(w => w.id === id) ?? FLOORS[0]!

/** Categories a nursery needs to count as "complete". */
export const ROOM_COMPLETE_REQUIREMENTS: Array<{ label: string; ids: string[] }> = [
  { label: 'A crib', ids: ['crib_classic', 'crib_cloud'] },
  { label: 'A lamp', ids: ['lamp_night', 'lamp_star'] },
  { label: 'A rug', ids: ['rug_round', 'rug_heart', 'rug_star'] },
  { label: 'Curtains', ids: ['curtains_pink', 'curtains_blue'] },
  { label: 'A window', ids: ['window_day', 'window_night'] },
  { label: 'A cuddly toy', ids: ['teddy', 'teddy_big', 'teddy_golden', 'bunny'] },
  { label: 'Wall decoration', ids: ['frame_bear', 'frame_heart', 'garland', 'bunting', 'rainbow', 'moon', 'mobile'] },
]
