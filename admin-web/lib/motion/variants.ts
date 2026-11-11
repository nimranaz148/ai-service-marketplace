import type { Variants } from "framer-motion";

/**
 * The only framer-motion variants used on application surfaces.
 * Ad-hoc `animate`/`transition` props elsewhere are a review failure.
 * Nothing here loops or implies ongoing activity.
 */
export const variants = {
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.18 } },
  },
  staggerList: {
    hidden: {},
    show: { transition: { staggerChildren: 0.04 } },
  },
  listItem: {
    hidden: { opacity: 0, y: 4 },
    show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  },
  routeTransition: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.18 } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  },
} satisfies Record<string, Variants>;
