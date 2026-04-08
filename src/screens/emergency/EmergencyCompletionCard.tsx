import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAccentColors } from "../../hooks/useAccentColors";
import { colors, components, spacing, typography } from "../../theme";

interface EmergencyCompletionCardProps {
	title: string;
	body: string;
	reviewLabel: string;
	onReview: () => void;
	onViewUpdates: () => void;
	onExit: () => void;
}

export const EmergencyCompletionCard = ({
	title,
	body,
	reviewLabel,
	onReview,
	onViewUpdates,
	onExit,
}: EmergencyCompletionCardProps) => {
	const accent = useAccentColors();

	return (
		<View style={styles.card}>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.body}>{body}</Text>

			<View style={styles.actions}>
				<Button
					mode="contained"
					onPress={onViewUpdates}
					buttonColor={accent.primary}
					textColor="#FFFFFF"
					style={styles.button}
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
				>
					View updates
				</Button>
				<Button
					mode="outlined"
					onPress={onReview}
					textColor={accent.primary}
					style={[styles.button, { borderColor: accent.primaryOutline }]}
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
				>
					{reviewLabel}
				</Button>
				<Button
					mode="text"
					onPress={onExit}
					textColor={colors.textSecondary}
					labelStyle={styles.exitLabel}
				>
					I'm safe — exit emergency mode
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
		padding: spacing.lg,
		gap: spacing.md,
		marginTop: spacing.sm,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	body: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 22,
	},
	actions: {
		gap: spacing.sm,
	},
	button: {
		borderRadius: components.cardRadius,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	exitLabel: {
		fontSize: typography.body.fontSize,
	},
});
