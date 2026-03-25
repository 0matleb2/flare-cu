import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { WelcomeScreenNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

interface WelcomeScreenProps {
	onGuestAccess?: () => void;
}

export const WelcomeScreen = ({ onGuestAccess }: WelcomeScreenProps) => {
	const navigation = useNavigation<WelcomeScreenNavProp>();
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
			{/* ── Hero: brand identity ─────────────────────────── */}
			<View style={styles.hero}>
				<Text style={styles.title}>Flare CU</Text>
				<Text style={styles.subtitle}>
					Real-time safety alerts and safe-route guidance for the Concordia
					community.
				</Text>
			</View>

			{/* ── Actions: clear hierarchy ────────────────────── */}
			<View style={styles.actions}>
				{/* Primary CTA */}
				<Button
					mode="contained"
					onPress={() => navigation.navigate("Login")}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
				>
					Login
				</Button>

				{/* Secondary CTA */}
				<Button
					mode="outlined"
					onPress={() => navigation.navigate("CreateAccount")}
					textColor={colors.burgundy}
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={[styles.button, styles.outlineButton]}
				>
					Create account
				</Button>

				{/* Tertiary: text-only button, visually distinct from above */}
				<View style={styles.guestSection}>
					<Button
						mode="text"
						onPress={() => {
							if (onGuestAccess) {
								onGuestAccess();
							} else {
								navigation.navigate("Preferences");
							}
						}}
						textColor={colors.textSecondary}
						labelStyle={styles.guestLabel}
						compact
					>
						Continue as guest
					</Button>
					<Text style={styles.helper}>
						Browse alerts without an account — you can sign up later
					</Text>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: components.screenPaddingH,
		justifyContent: "flex-end",
		paddingBottom: spacing.xl,
	},
	hero: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.sm,
		paddingHorizontal: spacing.base,
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: colors.burgundy,
	},
	subtitle: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
		lineHeight: 20,
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
	guestSection: {
		alignItems: "center",
		marginTop: -spacing.xs,
		gap: 2,
	},
	guestLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: "500",
		textDecorationLine: "underline",
	},
	helper: {
		fontSize: typography.caption.fontSize,
		color: "#4B5563",
		textAlign: "center",
	},
});
