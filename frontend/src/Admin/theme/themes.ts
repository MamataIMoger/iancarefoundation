// frontend/src/Admin/theme/themes.ts
export type ThemeName = 'light' | 'dark';

/** Theme Labels & Icons (for toggle UI) */
export const THEMES: Record<ThemeName, { label: string; emoji: string }> = {
  light: { label: 'Light', emoji: '🌞' },
  dark:  { label: 'Dark',  emoji: '🌙' },
};

/** Default Theme & Storage Key */
export const DEFAULT_THEME: ThemeName = 'light';
export const THEME_STORAGE_KEY = 'iancare.admin.theme';

/** Theme Color Tokens — ensure WCAG AA contrast */
export const THEME_TOKENS: Record<ThemeName, Record<string, string>> = {
  light: {
    '--accent': '#2563eb',      // Blue
    '--accent-2': '#38bdf8',    // Sky Blue
    '--text': '#111827',        // Very dark text
    '--subtle': '#4b5563',      // Secondary text
    '--surface': '#ffffff',     // Card surfaces
    '--card': '#f9fafb',
    '--border': '#e5e7eb',
  },
  dark: {
    '--accent': '#60a5fa',      // Bright Blue
    '--accent-2': '#7dd3fc',    // Soft Blue
    '--text': '#f9fafb',        // Light text
    '--subtle': '#cbd5e1',      // Muted gray
    '--surface': '#1e293b',     // Deep surface
    '--card': '#0f172a',        // Card bg
    '--border': '#334155',
  },
};
