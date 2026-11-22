/** Go back in history, or to a fallback route when the page was opened directly. */
export function useGoBack(fallback = '/') {
  const router = useRouter()
  return () => {
    if (window.history.state?.back) router.back()
    else void router.push(fallback)
  }
}
