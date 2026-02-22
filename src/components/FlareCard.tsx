import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";
import type { Flare } from "../types";
import { CATEGORY_LABELS } from "../types";
import { CredibilityChip } from "./CredibilityChip";

interface FlareCardProps {
	flare: Flare;
	onPress: () => void;
	lowStim?: boolean;
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

export const FlareCard = ({ flare, onPress, lowStim }: FlareCardProps) => {
	return (
		<TouchableOpacity
			style={styles.card}
			onPress={onPress}
			activeOpacity={0.7}
			accessibilityRole="button"
			accessibilityLabel={`${CATEGORY_LABELS[flare.category]} at ${flare.location}`}
		>
			{/* Category + credibility row */}
			<View style={styles.topRow}>
				<Text style={styles.category}>{CATEGORY_LABELS[flare.category]}</Text>
				<CredibilityChip level={flare.credibility} lowStim={lowStim} />
			</View>

			{/* Summary */}
			<Text style={styles.summary} numberOfLines={2}>
				{flare.summary}
			</Text>

			{/* Location + time */}
			<View style={styles.bottomRow}>
				<Text style={styles.location} numberOfLines={1}>
					{flare.location}
				</Text>
				<Text style={styles.timestamp}>{timeAgo(flare.lastUpdated)}</Text>
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
		gap: spacing.xs,
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
	summary: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
	bottomRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: spacing.xs,
	},
	location: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
		flex: 1,
		marginRight: spacing.sm,
	},
	timestamp: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
	},
});
