import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { colors, spacing, typography } from "../theme";

interface EmptyStateProps {
	message?: string;
}

export const EmptyState = ({
	message = "No active flares nearby.",
}: EmptyStateProps) => {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>{message}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: spacing.xl,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		textAlign: "center",
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
});
