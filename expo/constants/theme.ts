/**
 * CDL Inspection Coach design system.
 * Professional trucking theme: deep steel-blue base with safety-amber accents.
 */

export const theme = {
  colors: {
    background: "#0E1726",
    surface: "#172234",
    surfaceAlt: "#1E2C42",
    surfaceRaised: "#243450",
    border: "#2C3D58",
    text: "#F4F7FB",
    textMuted: "#9DABC2",
    textFaint: "#6C7C97",
    amber: "#F5A623",
    amberDark: "#D98B0E",
    amberSoft: "#3A2E15",
    green: "#3DD27E",
    greenSoft: "#15301F",
    red: "#FF5C5C",
    redSoft: "#33181C",
    blue: "#3B8AE0",
    blueSoft: "#152235",
    white: "#FFFFFF",
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    pill: 999,
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 30,
  },
  fontSize: {
    caption: 12,
    label: 13,
    body: 15,
    bodyLarge: 16,
    heading: 18,
    title: 22,
    hero: 30,
  },
} as const;

export type Theme = typeof theme;
