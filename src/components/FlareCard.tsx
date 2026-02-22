import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";
import type { Flare } from "../types";
import { CATEGORY_LABELS } from "../types";
import { CredibilityChip } from "./CredibilityChip";

interface FlareCardProps {
	flare: Flare;
	onPress: () => void;
	onUpvote?: (id: string) => void;
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

export const FlareCard = ({ flare, onPress, onUpvote }: FlareCardProps) => {
	const showUpvote = flare.credibility !== "resolved";

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
				<CredibilityChip level={flare.credibility} />
			</View>

			{/* Summary */}
			<Text style={styles.summary} numberOfLines={2}>
				{flare.summary}
			</Text>

			{/* Bottom row: location + time + upvote */}
			<View style={styles.bottomRow}>
				<View style={styles.metaGroup}>
					<Text style={styles.location} numberOfLines={1}>
						{flare.location}
					</Text>
					<Text style={styles.timestamp}>{timeAgo(flare.lastUpdated)}</Text>
				</View>

				{showUpvote && (
					<TouchableOpacity
						style={[
							styles.upvoteButton,
							flare.upvotedByUser && styles.upvoteActive,
						]}
						onPress={(e) => {
							e.stopPropagation();
							onUpvote?.(flare.id);
						}}
						activeOpacity={0.6}
						hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
					>
						<Text
							style={[
								styles.upvoteIcon,
								flare.upvotedByUser && styles.upvoteIconActive,
							]}
						>
							▲
						</Text>
						<Text
							style={[
								styles.upvoteCount,
								flare.upvotedByUser && styles.upvoteCountActive,
							]}
						>
							{flare.upvotes}
						</Text>
					</TouchableOpacity>
				)}
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
	metaGroup: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginRight: spacing.sm,
	},
	location: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
		flex: 1,
	},
	timestamp: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
	},

	// Upvote button
	upvoteButton: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingHorizontal: spacing.sm,
		paddingVertical: 4,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.background,
	},
	upvoteActive: {
		borderColor: colors.burgundy,
		backgroundColor: `${colors.burgundy}0F`,
	},
	upvoteIcon: {
		fontSize: 10,
		color: colors.textDisabled,
	},
	upvoteIconActive: {
		color: colors.burgundy,
	},
	upvoteCount: {
		fontSize: 13,
		fontWeight: "700",
		color: colors.textSecondary,
	},
	upvoteCountActive: {
		color: colors.burgundy,
	},
});
