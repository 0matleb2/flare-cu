import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";
import type { Flare } from "../types";
import { CATEGORY_LABELS } from "../types";
import { CredibilityChip } from "./CredibilityChip";
import { ProgressBar } from "./ProgressBar";

interface FlareCardProps {
	flare: Flare;
	onViewGuidance?: () => void;
	onDetails?: () => void;
}

function timeAgo(ms: number): string {
	const diff = Date.now() - ms;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "Just now";
	if (mins < 60) return `Updated ${mins} min ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `Updated ${hours}h ago`;
	return `Updated ${Math.floor(hours / 24)}d ago`;
}

export const FlareCard = ({
	flare,
	onViewGuidance,
	onDetails,
}: FlareCardProps) => {
	return (
		<View style={styles.card}>
			{/* Category title */}
			<Text style={styles.category}>{CATEGORY_LABELS[flare.category]}</Text>

			{/* Location */}
			<Text style={styles.location} numberOfLines={2}>
				{flare.location}
			</Text>

			{/* Credibility + timestamp row */}
			<View style={styles.metaRow}>
				<CredibilityChip level={flare.credibility} />
				<Text style={styles.timestamp}>{timeAgo(flare.lastUpdated)}</Text>
			</View>

			{/* Mini progress bar */}
			<View style={styles.progressContainer}>
				<ProgressBar currentLevel={flare.credibility} />
			</View>

			{/* Actions */}
			<View style={styles.actions}>
				<Button
					mode="contained"
					onPress={onViewGuidance}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.primaryButton}
					compact
				>
					View guidance
				</Button>
				<Button
					mode="text"
					onPress={onDetails}
					textColor={colors.burgundy}
					labelStyle={styles.secondaryLabel}
					contentStyle={styles.buttonContent}
					compact
				>
					Details
				</Button>
			</View>
		</View>
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
	},
	category: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	location: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.sm,
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.sm,
	},
	timestamp: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	progressContainer: {
		marginBottom: spacing.md,
	},
	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	primaryButton: {
		borderRadius: components.cardRadius,
	},
	buttonContent: {
		minHeight: 36,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	secondaryLabel: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
