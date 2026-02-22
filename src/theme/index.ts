import { MD3LightTheme as DefaultTheme } from "react-native-paper";

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

// ── Extended color palette ──────────────────────────────────
export const colors = {
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

// ── React Native Paper theme override ───────────────────────
export const theme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		// Primary brand
		primary: colors.burgundy,
		onPrimary: "#FFFFFF",

		// Secondary (use info blue as secondary accent)
		secondary: colors.statusInfo,
		onSecondary: "#FFFFFF",

		// Backgrounds & surfaces
		background: colors.background,
		surface: colors.surface,
		onSurface: colors.textPrimary,
		onSurfaceVariant: colors.textSecondary,

		// Error
		error: colors.statusHighTension,
		onError: "#FFFFFF",

		// Outlines
		outline: colors.border,
		outlineVariant: colors.border,

		// Elevation / surface variants
		surfaceVariant: colors.burgundyLight,
		surfaceDisabled: colors.background,
	},
};
