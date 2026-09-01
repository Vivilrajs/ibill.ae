/**
 * Structural metadata for marketing sections - icon names and ordering only.
 * All display copy lives in `src/locales/{en,ar}/*.json` and is read with
 * `useTranslation()` in the pages/components.
 */

export const VALUE_PILLAR_ICONS = ["Award", "Lightbulb", "TrendingUp"] as const;

export const HOME_WHY_CHOOSE_ICONS = [
  "Award",
  "GraduationCap",
  "MessagesSquare",
] as const;

export const HOME_PROCESS_ICONS = [
  "MessagesSquare",
  "Puzzle",
  "BadgeCheck",
] as const;
