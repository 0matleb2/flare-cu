import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";

interface ActionCardProps {
	message?: string;
	actionLabel?: string;
	onPress: () => void;
}

export const ActionCard = ({
	message = "What should I do now?",
	actionLabel = "View guidance",
	onPress,
}: ActionCardProps) => {
	return (
		<View style={styles.card}>
			<Text style={styles.message}>{message}</Text>
			<Button
				mode="contained"
				onPress={onPress}
				buttonColor={colors.burgundy}
				textColor="#FFFFFF"
				labelStyle={styles.buttonLabel}
				style={styles.button}
				contentStyle={styles.buttonContent}
			>
				{actionLabel}
			</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: colors.burgundyLight,
		borderRadius: components.cardRadius,
		padding: components.cardPadding,
		marginHorizontal: components.screenPaddingH,
		marginBottom: spacing.md,
		gap: spacing.md,
	},
	message: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	button: {
		alignSelf: "flex-start",
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
