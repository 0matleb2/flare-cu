import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

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
		padding: 32,
		alignItems: "center",
		justifyContent: "center",
	},
	text: {
		textAlign: "center",
		opacity: 0.6,
	},
});
