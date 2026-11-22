export interface MemoryTheme { id: string; name: string; emoji: string; faces: string[] }
export type Difficulty = 'easy' | 'medium' | 'hard'

const bear = (fur: string, ear: string, extra: string) =>
  `svg:<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="26" r="13" fill="${fur}"/><circle cx="76" cy="26" r="13" fill="${fur}"/><circle cx="24" cy="26" r="7" fill="${ear}"/><circle cx="76" cy="26" r="7" fill="${ear}"/><circle cx="50" cy="54" r="36" fill="${fur}"/><ellipse cx="50" cy="66" rx="15" ry="11" fill="${ear}"/><ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#6b4553"/><circle cx="36" cy="48" r="4" fill="#4a3340"/><circle cx="64" cy="48" r="4" fill="#4a3340"/><circle cx="31" cy="58" r="5" fill="#ffb3c6" opacity=".7"/><circle cx="69" cy="58" r="5" fill="#ffb3c6" opacity=".7"/><path d="M44 70 Q50 75 56 70" stroke="#6b4553" stroke-width="2" fill="none" stroke-linecap="round"/>${extra}</svg>`

export const MEMORY_THEMES: MemoryTheme[] = [
  { id: 'animals', name: 'Cute Animals', emoji: '🐰', faces: ['🐶', '🐱', '🐰', '🐼', '🐥', '🐸', '🦊', '🐷', '🐨', '🦁', '🐮', '🐻'] },
  { id: 'toys', name: 'Baby Toys', emoji: '🧸', faces: ['🧸', '🎈', '🚂', '🪁', '🎠', '🚗', '🧩', '🎨', '🥁', '🎺'] },
  { id: 'fruits', name: 'Sweet Fruits', emoji: '🍓', faces: ['🍎', '🍓', '🍌', '🍇', '🍑', '🍒', '🍉', '🍊', '🍍', '🥝'] },
  { id: 'flowers', name: 'Pretty Flowers', emoji: '🌷', faces: ['🌸', '🌷', '🌻', '🌹', '🌼', '💐', '🌺', '🍀'] },
  {
    id: 'teddies', name: 'Teddy Bears', emoji: '🧸',
    faces: [
      bear('#E7B98A', '#F6DDC0', '<path d="M38 82 L50 76 L62 82 L50 88Z" fill="#E27AA3"/>'),
      bear('#F6DDC0', '#FFF3E4', '<path d="M30 14 L50 4 L70 14Z" fill="#9A82E0"/>'),
      bear('#D9B8F5', '#EFE0FF', '<path d="M50 20 l4 9 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1z" fill="#F6C453"/>'),
      bear('#BFE0F8', '#E8F5FF', '<path d="M32 82 Q50 94 68 82" stroke="#E27AA3" stroke-width="7" fill="none" stroke-linecap="round"/>'),
      bear('#F7C4D6', '#FFE6EE', '<circle cx="62" cy="20" r="6" fill="#fff"/><circle cx="72" cy="26" r="6" fill="#fff"/><circle cx="67" cy="26" r="3" fill="#F6C453"/>'),
      bear('#C9EBD5', '#EAFBF1', '<path d="M50 84 q-14-10 -8-17 q6-5 8 3 q2-8 8-3 q6 7 -8 17z" fill="#E27AA3"/>'),
      bear('#FFD9A8', '#FFEBCF', '<rect x="30" y="38" width="40" height="12" rx="6" fill="none" stroke="#604C59" stroke-width="2.5"/>'),
      bear('#E0D0C0', '#F3E9DD', '<path d="M28 16 L38 4 L50 14 L62 4 L72 16Z" fill="#F6C453"/>'),
    ],
  },
  { id: 'accessories', name: 'Baby Things', emoji: '🍼', faces: ['🍼', '🧦', '👒', '🎀', '👕', '👟', '🧷', '👶'] },
]

export const themeById = (id: string) => MEMORY_THEMES.find(t => t.id === id) ?? MEMORY_THEMES[0]!

export const CARD_BACKS = [
  { id: 'hearts', name: 'Hearts', from: '#F4BFD3', to: '#E27AA3', mark: '♥' },
  { id: 'stars', name: 'Stars', from: '#CDBBFA', to: '#9A82E0', mark: '★' },
  { id: 'clouds', name: 'Clouds', from: '#BFE0F8', to: '#5FA3D9', mark: '☁' },
  { id: 'sunny', name: 'Sunny', from: '#FFD2B9', to: '#EE8F66', mark: '✿' },
]

export const DIFFICULTIES: Record<Difficulty, { pairs: number; label: string; cols: number; coins: number; bonus: number }> = {
  easy: { pairs: 4, label: 'Easy', cols: 4, coins: 15, bonus: 5 },
  medium: { pairs: 6, label: 'Medium', cols: 4, coins: 30, bonus: 10 },
  hard: { pairs: 8, label: 'Hard', cols: 4, coins: 50, bonus: 15 },
}
