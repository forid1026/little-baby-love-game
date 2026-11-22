// A tiny LIFO of "back" handlers so the Android hardware back button closes the top-most
// dialog / pause menu first, and only then navigates. Each handler returns true if it consumed the press.
type Handler = () => boolean | void
const stack: Array<{ id: symbol; fn: Handler }> = []

export function pushBack(fn: Handler): () => void {
  const id = Symbol('back')
  stack.push({ id, fn })
  return () => {
    const i = stack.findIndex(s => s.id === id)
    if (i >= 0) stack.splice(i, 1)
  }
}

/** Returns true when something handled the back press. */
export function runBack(): boolean {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i]!.fn() !== false) return true
  }
  return false
}

/** Register a back handler while `active` is true (auto-removed on unmount). */
export function useBackHandler(active: Ref<boolean> | (() => boolean), fn: Handler) {
  let off: (() => void) | null = null
  const isActive = typeof active === 'function' ? active : () => active.value
  watch(isActive, (v) => {
    off?.()
    off = v ? pushBack(fn) : null
  }, { immediate: true })
  onBeforeUnmount(() => off?.())
}
