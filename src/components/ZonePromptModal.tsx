import { StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";

interface ZonePromptModalProps {
	visible: boolean;
	onViewGuidance: () => void;
	onDismiss: () => void;
	onRemindLater?: () => void;
}

export const ZonePromptModal = ({
	visible,
	onViewGuidance,
	onDismiss,
	onRemindLater,
}: ZonePromptModalProps) => {
	return (
		<Portal>
			<Modal
				visible={visible}
				onDismiss={onDismiss}
				contentContainerStyle={styles.container}
			>
				<Text style={styles.title}>Approaching affected area</Text>
				<Text style={styles.body}>
					A disruption has been reported nearby. Review guidance to stay safe.
				</Text>

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
						View guidance
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
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	body: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
	actions: {
		gap: spacing.md,
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
