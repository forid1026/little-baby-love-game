// Dress-up catalogue. Artwork lives in the baby's own coordinate system (viewBox 0 0 240 320).
import type { Slot } from '~/types'

export interface DressItem {
  id: string
  slot: Slot
  name: string
  price: number
  color: string // default colour (user can recolour)
  layer?: 'back' | 'front'
  art: (c: string, d: string) => string
}

export const SKIN = '#FFD9C7'
export const SKIN_DARK = '#F2B9A3'
export const DRESS_COLORS = ['#F4BFD3', '#E27AA3', '#CDBBFA', '#BFE0F8', '#C9EBD5', '#FFE27A', '#FFD2B9', '#FFFFFF', '#F58E8E', '#7ED3C8']

export const SLOT_VIEWBOX: Record<Slot, string> = {
  outfit: '40 150 160 150',
  hat: '40 0 160 130',
  shoes: '50 245 140 70',
  acc: '10 60 220 240',
}
export const SLOT_LABEL: Record<Slot, string> = { outfit: 'Outfits', hat: 'Hats', shoes: 'Shoes', acc: 'Extras' }

const TORSO = 'M72 178 Q120 160 168 178 L176 252 Q120 274 64 252Z'
const sleeves = (c: string) =>
  `<ellipse cx="60" cy="212" rx="15" ry="27" transform="rotate(18 60 212)" fill="${c}"/><ellipse cx="180" cy="212" rx="15" ry="27" transform="rotate(-18 180 212)" fill="${c}"/>`
const base = (c: string, d: string, withSleeves = true) =>
  `<path d="${TORSO}" fill="${c}"/>${withSleeves ? sleeves(c) : ''}<path d="M66 247 Q120 269 174 247" stroke="${d}" stroke-width="5" fill="none" stroke-linecap="round"/>`
const star = (cx: number, cy: number, r: number, fill: string) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5
    const rr = i % 2 ? r * 0.45 : r
    return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`
  }).join(' ')
  return `<polygon points="${pts}" fill="${fill}" stroke-linejoin="round"/>`
}
const heart = (cx: number, cy: number, s: number, fill: string) =>
  `<path transform="translate(${cx} ${cy}) scale(${s})" d="M0 8 C-14 -2 -10 -14 0 -6 C10 -14 14 -2 0 8Z" fill="${fill}"/>`
const pair = (fn: (x: number, flip: number) => string) => fn(92, 1) + fn(148, -1)
const bowShape = (x: number, y: number, s: number, c: string, d: string) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 L-24 -14 Q-30 0 -24 14Z" fill="${c}"/><path d="M0 0 L24 -14 Q30 0 24 14Z" fill="${c}"/><circle r="6" fill="${d}"/></g>`

export const DRESS_ITEMS: DressItem[] = [
  // ---------------- Outfits (10) ----------------
  { id: 'outfit_onesie', slot: 'outfit', name: 'Cozy Onesie', price: 0, color: '#F4BFD3', art: (c, d) => base(c, d) + heart(120, 215, 1.5, '#fff') },
  { id: 'outfit_tutu', slot: 'outfit', name: 'Tutu Dress', price: 0, color: '#F4BFD3', art: (c, d) => base('#fff', d) + `<path d="M76 190 Q120 176 164 190 L170 218 L70 218Z" fill="${c}"/><path d="M64 214 L176 214 L204 276 Q120 298 36 276Z" fill="${c}"/><path d="M64 214 Q120 234 176 214" stroke="${d}" stroke-width="4" fill="none"/><path d="M52 262 Q120 288 188 262" stroke="#fff" stroke-width="4" fill="none" opacity=".7"/>${bowShape(120, 218, .7, '#fff', d)}` },
  { id: 'outfit_overalls', slot: 'outfit', name: 'Little Overalls', price: 30, color: '#BFE0F8', art: (c, d) => base('#FFF8EF', '#EBDDCB') + `<path d="M74 208 L166 208 L174 252 Q120 272 66 252Z" fill="${c}"/><rect x="88" y="168" width="14" height="44" fill="${c}"/><rect x="138" y="168" width="14" height="44" fill="${c}"/><circle cx="95" cy="214" r="4.5" fill="#F6C453"/><circle cx="145" cy="214" r="4.5" fill="#F6C453"/><rect x="104" y="226" width="32" height="20" rx="6" fill="${d}"/>${heart(120, 236, .9, '#fff')}` },
  { id: 'outfit_sailor', slot: 'outfit', name: 'Sailor Suit', price: 40, color: '#BFE0F8', art: (c, d) => base('#fff', '#DDE8F2') + `<path d="M84 172 L120 214 L156 172 L146 166 L120 188 L94 166Z" fill="${c}"/><path d="M120 214 L106 208 L120 224 L134 208Z" fill="#E27AA3"/><path d="M62 236 L70 224 M178 236 L170 224" stroke="${c}" stroke-width="5"/>` },
  { id: 'outfit_bear', slot: 'outfit', name: 'Teddy Suit', price: 50, color: '#E7B98A', art: (c, d) => base(c, d) + `<ellipse cx="120" cy="222" rx="30" ry="28" fill="#F6DDC0"/><circle cx="120" cy="216" r="5" fill="#6b4553" opacity=".5"/><circle cx="52" cy="232" r="6" fill="#F6DDC0"/><circle cx="188" cy="232" r="6" fill="#F6DDC0"/>` },
  { id: 'outfit_bunny', slot: 'outfit', name: 'Bunny Suit', price: 50, color: '#FFFFFF', art: (c, d) => base(c, '#E6D6DF') + `<ellipse cx="120" cy="224" rx="28" ry="26" fill="#F8C9DA"/><circle cx="196" cy="262" r="12" fill="#fff" stroke="#E6D6DF" stroke-width="2"/><circle cx="52" cy="232" r="6" fill="#F8C9DA"/><circle cx="188" cy="232" r="6" fill="#F8C9DA"/>` },
  { id: 'outfit_flower', slot: 'outfit', name: 'Flower Dress', price: 60, color: '#FFE27A', art: (c, d) => base(c, d) + `<path d="M66 224 L174 224 L196 272 Q120 292 44 272Z" fill="${c}"/>${[[84, 250], [120, 262], [156, 250], [100, 232], [142, 234]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#F4A0B9"/><circle cx="${x}" cy="${y}" r="2.4" fill="#fff"/>`).join('')}<path d="M66 224 Q120 242 174 224" stroke="${d}" stroke-width="4" fill="none"/>` },
  { id: 'outfit_stars', slot: 'outfit', name: 'Starry Pajamas', price: 70, color: '#CDBBFA', art: (c, d) => base(c, d) + [[90, 200], [150, 196], [120, 226], [96, 244], [146, 242], [52, 214], [188, 214]].map(([x, y]) => star(x!, y!, 8, '#FFF3B8')).join('') },
  { id: 'outfit_ladybug', slot: 'outfit', name: 'Ladybug Suit', price: 80, color: '#F58E8E', art: (c, d) => base(c, d) + `<line x1="120" y1="172" x2="120" y2="262" stroke="#4a3340" stroke-width="3"/>${[[96, 204], [146, 200], [100, 236], [142, 234]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#4a3340"/>`).join('')}` },
  { id: 'outfit_party', slot: 'outfit', name: 'Party Vest', price: 90, color: '#9A82E0', art: (c, d) => base('#fff', '#E8E0F2') + `<path d="M76 180 L120 196 L164 180 L170 250 Q120 270 70 250Z" fill="${c}"/><path d="M120 196 L106 186 L106 206Z M120 196 L134 186 L134 206Z" fill="#E27AA3"/><circle cx="120" cy="196" r="4" fill="#C45C86"/>${[222, 238].map(y => `<circle cx="120" cy="${y}" r="3.5" fill="#F6C453"/>`).join('')}` },

  // ---------------- Hats & head accessories (10) ----------------
  { id: 'hat_beanie', slot: 'hat', name: 'Knit Beanie', price: 0, color: '#F4BFD3', art: (c, d) => `<path d="M58 100 Q58 34 120 34 Q182 34 182 100Z" fill="${c}"/><rect x="54" y="86" width="132" height="18" rx="9" fill="${d}"/><circle cx="120" cy="30" r="12" fill="#fff"/>` },
  { id: 'hat_crown', slot: 'hat', name: 'Little Crown', price: 60, color: '#F6C453', art: (c, d) => `<path d="M80 70 L84 26 L102 48 L120 18 L138 48 L156 26 L160 70Z" fill="${c}" stroke="${d}" stroke-width="3" stroke-linejoin="round"/><circle cx="84" cy="26" r="5" fill="#E27AA3"/><circle cx="120" cy="18" r="5" fill="#8DBDE8"/><circle cx="156" cy="26" r="5" fill="#E27AA3"/>` },
  { id: 'hat_bunny', slot: 'hat', name: 'Bunny Ears', price: 30, color: '#FFFFFF', art: (c, d) => `<ellipse cx="92" cy="26" rx="15" ry="38" transform="rotate(-8 92 26)" fill="${c}" stroke="${d}" stroke-width="2"/><ellipse cx="148" cy="26" rx="15" ry="38" transform="rotate(8 148 26)" fill="${c}" stroke="${d}" stroke-width="2"/><ellipse cx="92" cy="30" rx="7" ry="26" transform="rotate(-8 92 30)" fill="#F8C9DA"/><ellipse cx="148" cy="30" rx="7" ry="26" transform="rotate(8 148 30)" fill="#F8C9DA"/>` },
  { id: 'hat_bear', slot: 'hat', name: 'Bear Ears', price: 30, color: '#E7B98A', art: (c) => `<circle cx="72" cy="62" r="22" fill="${c}"/><circle cx="168" cy="62" r="22" fill="${c}"/><circle cx="72" cy="62" r="12" fill="#F6DDC0"/><circle cx="168" cy="62" r="12" fill="#F6DDC0"/>` },
  { id: 'hat_bow', slot: 'hat', name: 'Big Bow', price: 20, color: '#E27AA3', art: (c, d) => bowShape(150, 62, 1.5, c, d) },
  { id: 'hat_sun', slot: 'hat', name: 'Sun Hat', price: 40, color: '#FFE27A', art: (c, d) => `<ellipse cx="120" cy="76" rx="98" ry="22" fill="${c}" stroke="${d}" stroke-width="3"/><path d="M70 76 Q70 26 120 26 Q170 26 170 76Z" fill="${c}" stroke="${d}" stroke-width="3"/><path d="M70 70 Q120 82 170 70 L170 62 Q120 74 70 62Z" fill="#E27AA3"/>` },
  { id: 'hat_flowers', slot: 'hat', name: 'Flower Crown', price: 45, color: '#F4A0B9', art: (c) => [[66, 84, c], [84, 62, '#FFE27A'], [106, 52, '#fff'], [134, 52, c], [156, 62, '#CDBBFA'], [174, 84, '#fff']].map(([x, y, f]) => `<circle cx="${x}" cy="${y}" r="11" fill="${f}"/><circle cx="${x}" cy="${y}" r="4" fill="#F6C453"/>`).join('') + `<path d="M62 88 Q120 38 178 88" stroke="#7BD0A0" stroke-width="3" fill="none" opacity=".8"/>` },
  { id: 'hat_party', slot: 'hat', name: 'Party Hat', price: 35, color: '#CDBBFA', art: (c, d) => `<path d="M120 -2 L82 74 Q120 84 158 74Z" fill="${c}"/><path d="M104 32 L136 32 M96 50 L144 50" stroke="#fff" stroke-width="5" opacity=".8"/><circle cx="120" cy="0" r="9" fill="#FFE27A"/><path d="M82 74 Q120 84 158 74" stroke="${d}" stroke-width="4" fill="none"/>` },
  { id: 'hat_sailor', slot: 'hat', name: 'Sailor Cap', price: 40, color: '#BFE0F8', art: (c, d) => `<path d="M62 90 Q64 42 120 40 Q176 42 178 90Z" fill="#fff" stroke="#E5E5E5" stroke-width="2"/><rect x="58" y="80" width="124" height="16" rx="8" fill="${c}" stroke="${d}" stroke-width="2"/>${star(120, 88, 7, '#fff')}` },
  { id: 'hat_halo', slot: 'hat', name: 'Angel Halo', price: 50, color: '#FFE27A', art: (c, d) => `<ellipse cx="120" cy="36" rx="42" ry="11" fill="none" stroke="${d}" stroke-width="9"/><ellipse cx="120" cy="36" rx="42" ry="11" fill="none" stroke="${c}" stroke-width="5"/>` },

  // ---------------- Shoes & socks (10) ----------------
  { id: 'shoes_sneakers', slot: 'shoes', name: 'Sneakers', price: 0, color: '#F4BFD3', art: (c, d) => pair(x => `<ellipse cx="${x}" cy="291" rx="22" ry="13" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M${x - 22} 296 L${x + 22} 296" stroke="#fff" stroke-width="5" stroke-linecap="round"/><ellipse cx="${x}" cy="283" rx="12" ry="6" fill="#fff" opacity=".6"/>`) },
  { id: 'shoes_socks', slot: 'shoes', name: 'Striped Socks', price: 0, color: '#BFE0F8', art: (c, d) => pair(x => `<path d="M${x - 14} 262 L${x + 14} 262 L${x + 15} 284 Q${x + 28} 290 ${x + 16} 302 L${x - 16} 302 Q${x - 26} 290 ${x - 15} 284Z" fill="${c}"/><rect x="${x - 15}" y="266" width="30" height="5" fill="#fff"/><rect x="${x - 15}" y="276" width="30" height="5" fill="#fff"/><path d="M${x - 14} 262 L${x + 14} 262" stroke="${d}" stroke-width="4"/>`) },
  { id: 'shoes_booties', slot: 'shoes', name: 'Knit Booties', price: 25, color: '#FFE27A', art: (c, d) => pair(x => `<path d="M${x - 17} 268 L${x + 17} 268 L${x + 17} 284 Q${x + 30} 292 ${x + 18} 302 L${x - 18} 302 Q${x - 30} 292 ${x - 17} 284Z" fill="${c}" stroke="${d}" stroke-width="2"/><rect x="${x - 18}" y="266" width="36" height="9" rx="4" fill="#fff"/><circle cx="${x}" cy="298" r="0"/><circle cx="${x}" cy="262" r="6" fill="#fff"/>`) },
  { id: 'shoes_maryjane', slot: 'shoes', name: 'Mary Janes', price: 30, color: '#E27AA3', art: (c, d) => pair(x => `<ellipse cx="${x}" cy="291" rx="22" ry="12" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M${x - 13} 282 Q${x} 272 ${x + 13} 282" stroke="${d}" stroke-width="4" fill="none"/><circle cx="${x}" cy="277" r="4" fill="#FFE27A"/>`) },
  { id: 'shoes_bunny', slot: 'shoes', name: 'Bunny Slippers', price: 45, color: '#FFFFFF', art: (c, d) => pair(x => `<ellipse cx="${x}" cy="292" rx="23" ry="13" fill="${c}" stroke="${d}" stroke-width="2"/><ellipse cx="${x - 8}" cy="270" rx="5" ry="13" fill="${c}" stroke="${d}" stroke-width="2"/><ellipse cx="${x + 8}" cy="270" rx="5" ry="13" fill="${c}" stroke="${d}" stroke-width="2"/><ellipse cx="${x - 8}" cy="272" rx="2.5" ry="8" fill="#F8C9DA"/><ellipse cx="${x + 8}" cy="272" rx="2.5" ry="8" fill="#F8C9DA"/><circle cx="${x}" cy="288" r="3" fill="#E27AA3"/>`) },
  { id: 'shoes_boots', slot: 'shoes', name: 'Little Boots', price: 40, color: '#E7B98A', art: (c, d) => pair(x => `<path d="M${x - 16} 262 L${x + 16} 262 L${x + 16} 286 Q${x + 34} 288 ${x + 24} 302 L${x - 22} 302 Q${x - 24} 288 ${x - 16} 284Z" fill="${c}" stroke="${d}" stroke-width="2"/><rect x="${x - 17}" y="260" width="34" height="8" rx="4" fill="#F6DDC0"/><path d="M${x - 22} 298 L${x + 24} 298" stroke="${d}" stroke-width="4"/>`) },
  { id: 'shoes_stars', slot: 'shoes', name: 'Star Shoes', price: 55, color: '#CDBBFA', art: (c, d) => pair(x => `<ellipse cx="${x}" cy="291" rx="22" ry="13" fill="${c}" stroke="${d}" stroke-width="2"/>${star(x, 288, 8, '#FFE27A')}`) },
  { id: 'shoes_sandals', slot: 'shoes', name: 'Summer Sandals', price: 35, color: '#FFD2B9', art: (c, d) => pair(x => `<ellipse cx="${x}" cy="296" rx="21" ry="8" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M${x - 12} 290 Q${x} 276 ${x + 12} 290" stroke="${d}" stroke-width="4" fill="none"/><circle cx="${x}" cy="282" r="4" fill="#F4A0B9"/>`) },
  { id: 'shoes_bear', slot: 'shoes', name: 'Teddy Slippers', price: 50, color: '#E7B98A', art: (c, d) => pair(x => `<ellipse cx="${x}" cy="292" rx="23" ry="13" fill="${c}" stroke="${d}" stroke-width="2"/><circle cx="${x - 14}" cy="278" r="7" fill="${c}"/><circle cx="${x + 14}" cy="278" r="7" fill="${c}"/><ellipse cx="${x}" cy="294" rx="10" ry="6" fill="#F6DDC0"/><circle cx="${x}" cy="291" r="2.5" fill="#6b4553"/>`) },
  { id: 'shoes_rain', slot: 'shoes', name: 'Rain Boots', price: 55, color: '#FFE27A', art: (c, d) => pair(x => `<path d="M${x - 17} 258 L${x + 17} 258 L${x + 17} 284 Q${x + 36} 286 ${x + 26} 304 L${x - 24} 304 Q${x - 26} 286 ${x - 17} 284Z" fill="${c}" stroke="${d}" stroke-width="2"/><rect x="${x - 18}" y="256" width="36" height="8" rx="4" fill="#fff" opacity=".7"/><ellipse cx="${x - 7}" cy="274" rx="3" ry="8" fill="#fff" opacity=".5"/>`) },

  // ---------------- Extras / accessories (10) ----------------
  { id: 'acc_bib', slot: 'acc', name: 'Drool Bib', price: 0, color: '#FFFFFF', art: (c, d) => `<path d="M80 168 Q120 190 160 168 L152 214 Q120 232 88 214Z" fill="${c}" stroke="${d}" stroke-width="2.5"/>${heart(120, 200, 1.3, '#F4BFD3')}` },
  { id: 'acc_pacifier', slot: 'acc', name: 'Pacifier', price: 0, color: '#8DBDE8', art: (c, d) => `<circle cx="120" cy="158" r="20" fill="none" stroke="${d}" stroke-width="4"/><ellipse cx="120" cy="150" rx="18" ry="11" fill="${c}" stroke="${d}" stroke-width="2.5"/><circle cx="120" cy="150" r="5" fill="#fff" opacity=".8"/>` },
  { id: 'acc_glasses', slot: 'acc', name: 'Round Glasses', price: 25, color: '#604C59', art: (c) => `<circle cx="96" cy="118" r="20" fill="#fff" fill-opacity=".25" stroke="${c}" stroke-width="4"/><circle cx="144" cy="118" r="20" fill="#fff" fill-opacity=".25" stroke="${c}" stroke-width="4"/><path d="M116 116 Q120 111 124 116" stroke="${c}" stroke-width="4" fill="none"/>` },
  { id: 'acc_wings', slot: 'acc', name: 'Angel Wings', price: 70, color: '#FFFFFF', layer: 'back', art: (c, d) => `<path d="M72 190 Q10 140 14 200 Q20 240 76 238Z" fill="${c}" stroke="${d}" stroke-width="3"/><path d="M168 190 Q230 140 226 200 Q220 240 164 238Z" fill="${c}" stroke="${d}" stroke-width="3"/>` },
  { id: 'acc_wand', slot: 'acc', name: 'Star Wand', price: 40, color: '#FFE27A', art: (c, d) => `<line x1="190" y1="244" x2="214" y2="168" stroke="#C45C86" stroke-width="5" stroke-linecap="round"/><g transform="translate(214 160)" stroke="${d}" stroke-width="2.5">${star(0, 0, 26, c)}</g><circle cx="188" cy="246" r="9" fill="${SKIN}"/>` },
  { id: 'acc_balloon', slot: 'acc', name: 'Balloon', price: 35, color: '#F58E8E', art: (c, d) => `<path d="M52 238 Q44 200 34 150" stroke="#8C7884" stroke-width="2" fill="none"/><ellipse cx="32" cy="124" rx="26" ry="32" fill="${c}" stroke="${d}" stroke-width="2.5"/><ellipse cx="22" cy="110" rx="6" ry="10" fill="#fff" opacity=".5"/><path d="M32 156 l-5 8 h10z" fill="${d}"/><circle cx="52" cy="240" r="9" fill="${SKIN}"/>` },
  { id: 'acc_scarf', slot: 'acc', name: 'Cozy Scarf', price: 30, color: '#E27AA3', art: (c, d) => `<path d="M76 172 Q120 196 164 172 L166 190 Q120 214 74 190Z" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M138 196 L150 238 L132 240 L124 202Z" fill="${c}" stroke="${d}" stroke-width="2"/><path d="M134 220 L148 218 M136 230 L150 228" stroke="#fff" stroke-width="3" opacity=".7"/>` },
  { id: 'acc_necklace', slot: 'acc', name: 'Flower Necklace', price: 35, color: '#F4A0B9', art: (c) => `<path d="M82 170 Q120 202 158 170" stroke="#7BD0A0" stroke-width="3" fill="none"/>` + [[88, 178], [102, 190], [120, 196], [138, 190], [152, 178]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7.5" fill="${i % 2 ? '#fff' : c}"/><circle cx="${x}" cy="${y}" r="2.5" fill="#F6C453"/>`).join('') },
  { id: 'acc_teddy', slot: 'acc', name: 'Teddy Friend', price: 45, color: '#E7B98A', art: (c) => `<g transform="translate(150 224)"><circle cx="-12" cy="-22" r="7" fill="${c}"/><circle cx="12" cy="-22" r="7" fill="${c}"/><ellipse cx="0" cy="12" rx="17" ry="20" fill="${c}"/><circle cx="0" cy="-8" r="16" fill="${c}"/><ellipse cx="0" cy="-3" rx="7" ry="5" fill="#F6DDC0"/><circle cx="-6" cy="-11" r="2" fill="#4a3340"/><circle cx="6" cy="-11" r="2" fill="#4a3340"/><circle cx="0" cy="-5" r="2" fill="#6b4553"/></g><circle cx="136" cy="246" r="8" fill="${SKIN}"/>` },
  { id: 'acc_bowtie', slot: 'acc', name: 'Bow Tie', price: 20, color: '#9A82E0', art: (c, d) => bowShape(120, 172, 1.1, c, d) },
]

export const dressItemById = (id: string) => DRESS_ITEMS.find(i => i.id === id)
export const itemsForSlot = (slot: Slot) => DRESS_ITEMS.filter(i => i.slot === slot)
export const FREE_DRESS_IDS = DRESS_ITEMS.filter(i => i.price === 0).map(i => i.id)
