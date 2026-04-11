import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useAccentColors } from "../hooks/useAccentColors";
import { colors, components, spacing, typography } from "../theme";

interface EmptyStateProps {
	title?: string;
	message?: string;
	hint?: string;
	actionLabel?: string;
	onAction?: () => void;
	compact?: boolean;
}

export const EmptyState = ({
	title = "Nothing to show right now",
	message = "No active flares on campus.",
	hint,
	actionLabel,
	onAction,
	compact = false,
}: EmptyStateProps) => {
	const accent = useAccentColors();

	return (
		<View style={[styles.container, compact && styles.containerCompact]}>
			<Text style={styles.title}>{title}</Text>
			<Text style={styles.text}>{message}</Text>
			{!!hint && <Text style={styles.hint}>{hint}</Text>}
			{actionLabel && onAction && (
				<Button
					mode="outlined"
					onPress={onAction}
					textColor={accent.primary}
					style={[styles.button, { borderColor: accent.primaryOutline }]}
					contentStyle={styles.buttonContent}
					labelStyle={styles.buttonLabel}
				>
					{actionLabel}
				</Button>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.xl,
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.xs,
	},
	containerCompact: {
		padding: spacing.lg,
	},
	title: {
		textAlign: "center",
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	text: {
		textAlign: "center",
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
	hint: {
		textAlign: "center",
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
		lineHeight: 18,
	},
	button: {
		marginTop: spacing.sm,
		borderRadius: components.cardRadius,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
