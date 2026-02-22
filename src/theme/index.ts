import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// ── Spacing tokens (use only these values) ──────────────────
export const spacing = {
	xs: 4,
	sm: 8,
	md: 12,
	base: 16,
	lg: 24,
	xl: 32,
} as const;

// ── Typography scale ────────────────────────────────────────
export const typography = {
	h1: { fontSize: 20, fontWeight: "600" as const },
	h2: { fontSize: 16, fontWeight: "600" as const },
	body: { fontSize: 14, fontWeight: "400" as const },
	caption: { fontSize: 12, fontWeight: "400" as const },
	chip: { fontSize: 12, fontWeight: "600" as const },
	button: { fontSize: 14, fontWeight: "600" as const },
} as const;

// ── Component style constants ───────────────────────────────
export const components = {
	cardRadius: 12,
	cardBorderWidth: 1,
	chipRadius: 999,
	chipPaddingV: 6,
	chipPaddingH: 10,
	touchTarget: 44,
	screenPaddingH: 16,
	cardPadding: 12,
	cardGap: 12,
} as const;

// ── Color types ─────────────────────────────────────────────
export type AppColors = Record<keyof typeof lightColors, string>;

// ── Light palette ───────────────────────────────────────────
export const lightColors = {
	// Core neutrals
	background: "#F8F9FB",
	surface: "#FFFFFF",
	border: "#E5E7EB",
	textPrimary: "#111827",
	textSecondary: "#6B7280",
	textDisabled: "#9CA3AF",

	// Concordia accent
	burgundy: "#7A003C",
	burgundyDark: "#5B002D",
	burgundyLight: "#F3E6EC",

	// Status (calm, not alarmist)
	statusSafe: "#2E7D32",
	statusCaution: "#B26A00",
	statusHighTension: "#8B1E1E",
	statusInfo: "#1E5AA8",

	// Credibility chip colors
	credReported: "#B26A00",
	credConfirmed: "#1E5AA8",
	credVerified: "#2E7D32",
	credResolved: "#6B7280",

	// Offline banner
	offlineBg: "#FFF7ED",
	offlineText: "#7C2D12",
	offlineBorder: "#FED7AA",

	// Location off banner
	locationBg: "#EFF6FF",
	locationText: "#1E3A8A",
	locationBorder: "#BFDBFE",
} as const;

// ── Dark palette ────────────────────────────────────────────
export const darkColors: AppColors = {
	// Core neutrals
	background: "#0F1117",
	surface: "#1A1D27",
	border: "#2D3140",
	textPrimary: "#F3F4F6",
	textSecondary: "#9CA3AF",
	textDisabled: "#6B7280",

	// Concordia accent
	burgundy: "#C4497A",
	burgundyDark: "#7A003C",
	burgundyLight: "#2D1620",

	// Status (calm, not alarmist)
	statusSafe: "#66BB6A",
	statusCaution: "#FFB74D",
	statusHighTension: "#EF5350",
	statusInfo: "#64B5F6",

	// Credibility chip colors
	credReported: "#FFB74D",
	credConfirmed: "#64B5F6",
	credVerified: "#66BB6A",
	credResolved: "#6B7280",

	// Offline banner
	offlineBg: "#2D1A0F",
	offlineText: "#FFB74D",
	offlineBorder: "#5C3A1A",

	// Location off banner
	locationBg: "#0F1A2E",
	locationText: "#64B5F6",
	locationBorder: "#1A3050",
} as const;

// ── Default export (light, for backwards compat) ────────────
export const colors = lightColors;

// ── React Native Paper theme overrides ──────────────────────
function makeTheme(base: typeof MD3LightTheme, c: AppColors) {
	return {
		...base,
		colors: {
			...base.colors,
			primary: c.burgundy,
			onPrimary: "#FFFFFF",
			secondary: c.statusInfo,
			onSecondary: "#FFFFFF",
			background: c.background,
			surface: c.surface,
			onSurface: c.textPrimary,
			onSurfaceVariant: c.textSecondary,
			error: c.statusHighTension,
			onError: "#FFFFFF",
			outline: c.border,
			outlineVariant: c.border,
			surfaceVariant: c.burgundyLight,
			surfaceDisabled: c.background,
		},
	};
}

export const lightTheme = makeTheme(MD3LightTheme, lightColors);
export const darkTheme = makeTheme(MD3DarkTheme, darkColors);

// Legacy export
export const theme = lightTheme;
