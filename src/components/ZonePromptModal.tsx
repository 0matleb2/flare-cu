import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";
import type { Flare } from "../types";
import { getRecommendedAction } from "../utils/recommendations";

interface ZonePromptModalProps {
	visible: boolean;
	flare: Flare | null;
	onViewGuidance: () => void;
	onDismiss: () => void;
	onRemindLater?: () => void;
}

export const ZonePromptModal = ({
	visible,
	flare,
	onViewGuidance,
	onDismiss,
	onRemindLater,
}: ZonePromptModalProps) => {
	if (!flare) return null;

	const recommendation = getRecommendedAction(
		flare.category,
		flare.severity ?? "medium",
	);

	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={onDismiss}
				contentContainerStyle={styles.container}
			>
				<View style={styles.header}>
					<Text style={styles.title}>Reported issue nearby</Text>
					{flare.severity === "high" && (
						<View style={styles.priorityBadge}>
							<Text style={styles.priorityText}>High Severity</Text>
						</View>
					)}
				</View>

				<Text style={styles.body}>{flare.summary}</Text>

				<View style={styles.recommendationBox}>
					<Text style={styles.recommendationLabel}>Recommendation:</Text>
					<Text style={styles.recommendationText}>{recommendation}</Text>
				</View>

				<View style={styles.actions}>
					<Button
						mode="contained"
						onPress={onViewGuidance}
						buttonColor={colors.burgundy}
						textColor="#FFFFFF"
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						style={styles.button}
					>
						View details
					</Button>
					<Button
						mode="outlined"
						onPress={onDismiss}
						textColor={colors.burgundy}
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						style={[styles.button, styles.outlineButton]}
					>
						Dismiss
					</Button>
					{onRemindLater && (
						<Button
							mode="text"
							onPress={onRemindLater}
							textColor={colors.textSecondary}
							labelStyle={styles.remindLabel}
						>
							Remind me later
						</Button>
					)}
				</View>
			</Modal>
		</Portal>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		padding: spacing.lg,
		marginHorizontal: spacing.lg,
		gap: spacing.md,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-start",
	},
	title: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
		flex: 1,
	},
	priorityBadge: {
		backgroundColor: `${colors.burgundy}15`,
		paddingHorizontal: spacing.sm,
		paddingVertical: 2,
		borderRadius: 4,
	},
	priorityText: {
		fontSize: 10,
		fontWeight: "700",
		color: colors.burgundy,
		textTransform: "uppercase",
	},
	body: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
	recommendationBox: {
		backgroundColor: colors.background,
		padding: spacing.md,
		borderRadius: spacing.sm,
		borderLeftWidth: 3,
		borderLeftColor: colors.burgundy,
	},
	recommendationLabel: {
		fontSize: 11,
		fontWeight: "700",
		color: colors.textSecondary,
		textTransform: "uppercase",
		marginBottom: 4,
	},
	recommendationText: {
		fontSize: typography.body.fontSize,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	actions: {
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
	button: {
		borderRadius: components.cardRadius,
	},
	outlineButton: {
		borderColor: colors.burgundy,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	remindLabel: {
		fontSize: typography.caption.fontSize,
	},
});
