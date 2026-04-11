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

function hexToRgb(hex: string) {
	const normalized = hex.replace("#", "");
	const value =
		normalized.length === 3
			? normalized
					.split("")
					.map((char) => `${char}${char}`)
					.join("")
			: normalized;

	const int = Number.parseInt(value, 16);

	return {
		r: (int >> 16) & 255,
		g: (int >> 8) & 255,
		b: int & 255,
	};
}

function channelToHex(value: number) {
	return Math.round(value).toString(16).padStart(2, "0");
}

function blendHex(foreground: string, background: string, amount: number) {
	const clampedAmount = Math.max(0, Math.min(1, amount));
	const fg = hexToRgb(foreground);
	const bg = hexToRgb(background);

	return `#${channelToHex(fg.r + (bg.r - fg.r) * clampedAmount)}${channelToHex(
		fg.g + (bg.g - fg.g) * clampedAmount,
	)}${channelToHex(fg.b + (bg.b - fg.b) * clampedAmount)}`;
}

export function withAlpha(hex: string, alphaHex: string) {
	return `${hex}${alphaHex}`;
}

export function getAccentColors(lowStim = false) {
	if (!lowStim) {
		return {
			primary: colors.burgundy,
			primaryDark: colors.burgundyDark,
			primarySoft: colors.burgundyLight,
			primaryOutline: colors.burgundy,
		};
	}

	return {
		primary: blendHex(colors.burgundy, colors.surface, 0.35),
		primaryDark: blendHex(colors.burgundyDark, colors.surface, 0.4),
		primarySoft: blendHex(colors.burgundyLight, colors.surface, 0.4),
		primaryOutline: blendHex(colors.burgundy, colors.border, 0.45),
	};
}

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
export function getPaperTheme(lowStim = false) {
	const accent = getAccentColors(lowStim);

	return {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			primary: accent.primary,
			onPrimary: "#FFFFFF",
			secondary: colors.statusInfo,
			onSecondary: "#FFFFFF",
			background: colors.background,
			surface: colors.surface,
			onSurface: colors.textPrimary,
			onSurfaceVariant: colors.textSecondary,
			error: colors.statusHighTension,
			onError: "#FFFFFF",
			outline: colors.border,
			outlineVariant: colors.border,
			surfaceVariant: accent.primarySoft,
			surfaceDisabled: colors.background,
		},
	};
}

export const theme = getPaperTheme(false);
