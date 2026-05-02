export const design = {
  colors: {
    bg: '#F6F1EA',
    surface: '#FFFFFF',
    surfaceMuted: '#FBF8F4',
    text: '#1F2937',
    muted: '#6B7280',
    border: '#E5DED4',
    accent: '#8C5B2E',
    accentDark: '#5B3A1A',
    accentSoft: '#FFF3E7',
    success: '#1F7A4D',
    warning: '#A16207',
    danger: '#B42318',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 24,
  },
  radius: {
    md: 16,
    lg: 24,
    xl: 28,
  },
} as const;

export function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
