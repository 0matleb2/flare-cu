import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";
import type { Flare } from "../types";
import { CATEGORY_LABELS } from "../types";
import { CredibilityChip } from "./CredibilityChip";
import { ProgressBar } from "./ProgressBar";

interface FlareCardProps {
	flare: Flare;
	onPress: () => void;
}

function timeAgo(ms: number): string {
	const diff = Date.now() - ms;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}

export const FlareCard = ({ flare, onPress }: FlareCardProps) => {
	return (
		<TouchableOpacity
			style={styles.card}
			onPress={onPress}
			activeOpacity={0.7}
			accessibilityRole="button"
			accessibilityLabel={`${CATEGORY_LABELS[flare.category]} at ${flare.location}`}
		>
			{/* Top row: category + timestamp */}
			<View style={styles.topRow}>
				<Text style={styles.category}>{CATEGORY_LABELS[flare.category]}</Text>
				<Text style={styles.timestamp}>{timeAgo(flare.lastUpdated)}</Text>
			</View>

			{/* Location */}
			<Text style={styles.location} numberOfLines={1}>
				{flare.location}
			</Text>

			{/* Bottom row: credibility + mini progress */}
			<View style={styles.bottomRow}>
				<CredibilityChip level={flare.credibility} />
				<View style={styles.progressWrap}>
					<ProgressBar currentLevel={flare.credibility} />
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		marginBottom: components.cardGap,
		gap: spacing.sm,
		minHeight: components.touchTarget,
	},
	topRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	category: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	timestamp: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	location: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	bottomRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	progressWrap: {
		flex: 1,
	},
});
