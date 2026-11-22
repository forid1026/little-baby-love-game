export type NoteKind = 'baby' | 'love' | 'quote'
export interface LoveNote { id: string; kind: NoteKind; text: string }

const baby = [
  "Mommy, I can't wait to meet you!",
  'You are my first home and my biggest love.',
  'Every heartbeat brings us closer.',
  'Thank you for loving me before we meet.',
  'I am growing a little more every day.',
  'One day, I will hold your finger with my tiny hands.',
  'I already know your voice, Mommy. It feels like home.',
  'I hope you can feel my little hello today.',
  'Thank you for every gentle hug you give me.',
  'Your lullabies are my favorite song.',
  'I promise to give you the sweetest cuddles.',
  'Mommy, you are my whole wide world.',
  'I am so lucky that you are my Mommy.',
  'Rest well today. I will be dreaming of you.',
  'When we meet, I will smile at you first.',
  'I love the way you talk to me. Keep telling me stories!',
  'Every day you make my little world warmer.',
  'I cannot wait to see your beautiful smile.',
  'You are already the best Mommy in the whole universe.',
  'I am wrapped in your love, and it is the coziest place.',
  'Thank you for being so brave and so kind.',
  'My tiny heart is dancing because of you.',
  'Soon I will say hello with a very small, very loud cry!',
  'You and Daddy are my favorite people already.',
]

const love = [
  'You are doing a wonderful job, Mommy. Be proud of yourself.',
  'Take a deep breath. You are loved more than you know.',
  'Today, it is okay to rest, to snack and to smile.',
  'Your love is already making a family.',
  'You are glowing, and the world is brighter with you in it.',
  'You are not alone. You are surrounded by love.',
  'Be gentle with yourself today. You are creating a miracle.',
  'Every little kick is a tiny high-five from baby.',
  'Your kindness will be the first lesson your baby learns.',
  'You deserve cozy blankets, warm tea and soft music today.',
  'A mother’s love begins long before the first hello.',
  'You are stronger, softer and more wonderful than you realise.',
  'Look how far you have come. Look how much love you carry.',
  'This season is precious. Enjoy every little moment.',
  'You are the heart of this family.',
  'A happy Mommy is the sweetest gift for a little baby.',
]

const quote = [
  'Small hands, big dreams, endless love.',
  'Babies are little angels who light up our lives.',
  'Home is wherever your little one is.',
  'The smallest feet leave the biggest footprints in our hearts.',
  'Love grows best in little hearts.',
  'A baby is something you carry inside you for nine months, in your arms for three years, and in your heart until you die.',
  'Every baby is a new beginning, a tiny hope wrapped in blankets.',
  'Make a wish on a star: a healthy, happy, loved little one.',
  'Life begins with a little love and a lot of cuddles.',
  'Little one, you are the answer to a prayer we whispered.',
  'Where there is a baby, there is love, and where there is love, there is joy.',
  'Sweet dreams are made of tiny toes and giggles.',
]

const make = (kind: NoteKind, list: string[]): LoveNote[] => list.map((text, i) => ({ id: `${kind}-${i}`, kind, text }))
export const LOVE_NOTES: LoveNote[] = [...make('baby', baby), ...make('love', love), ...make('quote', quote)]
export const noteById = (id: string) => LOVE_NOTES.find(n => n.id === id)
