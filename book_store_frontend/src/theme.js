//
// Ocean Professional Theme tokens and helpers
//

// PUBLIC_INTERFACE
export const theme = {
  name: "Ocean Professional",
  colors: {
    primary: "#2563EB", // blue
    secondary: "#F59E0B", // amber (also used for success accent)
    success: "#F59E0B",
    error: "#EF4444",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    mutedText: "#4B5563",
    border: "#E5E7EB",
    shadow: "rgba(17, 24, 39, 0.08)"
  },
  radii: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "20px",
    pill: "9999px"
  },
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.04)",
    md: "0 6px 16px rgba(0,0,0,0.08)",
    lg: "0 16px 32px rgba(0,0,0,0.12)"
  },
  transitions: {
    base: "all 200ms ease",
    slow: "all 320ms ease"
  },
};

// PUBLIC_INTERFACE
export const applyThemeCssVars = () => {
  const root = document.documentElement;
  const c = theme.colors;
  const r = theme.radii;
  const s = theme.shadows;
  root.style.setProperty("--color-primary", c.primary);
  root.style.setProperty("--color-secondary", c.secondary);
  root.style.setProperty("--color-success", c.success);
  root.style.setProperty("--color-error", c.error);
  root.style.setProperty("--color-bg", c.background);
  root.style.setProperty("--color-surface", c.surface);
  root.style.setProperty("--color-text", c.text);
  root.style.setProperty("--color-muted", c.mutedText);
  root.style.setProperty("--color-border", c.border);
  root.style.setProperty("--shadow-sm", s.sm);
  root.style.setProperty("--shadow-md", s.md);
  root.style.setProperty("--shadow-lg", s.lg);
  root.style.setProperty("--radius-sm", r.sm);
  root.style.setProperty("--radius-md", r.md);
  root.style.setProperty("--radius-lg", r.lg);
  root.style.setProperty("--radius-xl", r.xl);
  root.style.setProperty("--radius-pill", r.pill);
  root.style.setProperty("--transition-base", theme.transitions.base);
  root.style.setProperty("--transition-slow", theme.transitions.slow);
};
