export interface ToastMsg { id: number; text: string; kind: 'ok' | 'warn' }
let seq = 0

export function useToast() {
  const toasts = useState<ToastMsg[]>('toasts', () => [])
  function show(text: string, kind: ToastMsg['kind'] = 'ok', ms = 2200) {
    const id = ++seq
    toasts.value.push({ id, text, kind })
    setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, ms)
  }
  return { toasts, show }
}
