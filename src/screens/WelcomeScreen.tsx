import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { WelcomeScreenNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

export const WelcomeScreen = () => {
	const navigation = useNavigation<WelcomeScreenNavProp>();
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
			<View style={styles.hero}>
				<Text style={styles.title}>Flare CU</Text>
				<Text style={styles.subtitle}>Campus safety, community-driven.</Text>
			</View>

			<View style={styles.actions}>
				<Button
					mode="contained"
					onPress={() => navigation.navigate("CreateAccount")}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
				>
					Continue with email
				</Button>
				<Button
					mode="outlined"
					onPress={() => navigation.navigate("Preferences")}
					textColor={colors.burgundy}
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={[styles.button, styles.outlineButton]}
				>
					Continue as guest
				</Button>
				<Text style={styles.helper}>You can set preferences later</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: components.screenPaddingH,
		justifyContent: "space-between",
		paddingBottom: spacing.xl,
	},
	hero: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.sm,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: colors.burgundy,
	},
	subtitle: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	actions: {
		gap: spacing.md,
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
	helper: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
		marginTop: spacing.xs,
	},
});
