import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { colors, components, typography } from "../theme";
import type { CredibilityLevel } from "../types";
import { CREDIBILITY_LABELS } from "../types";

const CHIP_COLORS: Record<CredibilityLevel, string> = {
	reported: colors.credReported,
	confirmed: colors.credConfirmed,
	verified: colors.credVerified,
	resolved: colors.credResolved,
};

// Low-stim: muted gray tones instead of colored
const CHIP_COLORS_MUTED: Record<CredibilityLevel, string> = {
	reported: colors.textDisabled,
	confirmed: colors.textSecondary,
	verified: colors.textSecondary,
	resolved: colors.textDisabled,
};

interface CredibilityChipProps {
	level: CredibilityLevel;
	lowStim?: boolean;
}

export const CredibilityChip = ({ level, lowStim }: CredibilityChipProps) => {
	const color = lowStim ? CHIP_COLORS_MUTED[level] : CHIP_COLORS[level];

	return (
		<View
			style={[
				styles.chip,
				{ backgroundColor: lowStim ? `${color}0A` : `${color}14` },
			]}
		>
			<View style={[styles.dot, { backgroundColor: color }]} />
			<Text style={[styles.label, { color }]}>{CREDIBILITY_LABELS[level]}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	chip: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: components.chipRadius,
		paddingVertical: components.chipPaddingV,
		paddingHorizontal: components.chipPaddingH,
		alignSelf: "flex-start",
		gap: 6,
	},
	dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
	},
	label: {
		fontSize: typography.chip.fontSize,
		fontWeight: typography.chip.fontWeight,
	},
});
