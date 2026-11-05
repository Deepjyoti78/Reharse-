/**
 * Instantly snaps viewport scroll position to the top with zero animation delay or upward gliding.
 */
export const instantScrollToTop = () => {
  try {
    if (typeof document !== 'undefined') {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  } catch {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }
};
