import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CreateAccountScreenNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

export const CreateAccountScreen = () => {
	const navigation = useNavigation<CreateAccountScreenNavProp>();
	const insets = useSafeAreaInsets();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");

	const validateEmail = (value: string) => {
		if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			setEmailError("Enter a valid email.");
		} else {
			setEmailError("");
		}
	};

	const isFormValid = !!email && !emailError;

	const handleCreate = () => {
		if (!isFormValid) return;
		navigation.navigate("Preferences");
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Button
				mode="text"
				onPress={() => navigation.goBack()}
				textColor={colors.burgundy}
				labelStyle={styles.backLabel}
				contentStyle={styles.backContent}
				style={styles.backButton}
				icon="arrow-left"
			>
				Back
			</Button>

			<Text style={styles.title}>Create account</Text>

			{/* Form → CTA → cross-link → guest: single top-to-bottom flow */}
			<View style={styles.form}>
				<TextInput
					mode="outlined"
					label="Email"
					value={email}
					onChangeText={(v) => {
						setEmail(v);
						validateEmail(v);
					}}
					keyboardType="email-address"
					autoCapitalize="none"
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={colors.burgundy}
				/>
				{!!emailError && (
					<HelperText type="error" visible>
						{emailError}
					</HelperText>
				)}

				<TextInput
					mode="outlined"
					label="Password"
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={colors.burgundy}
				/>

				{/* Primary CTA — immediately after last input */}
				<Button
					mode="contained"
					onPress={handleCreate}
					buttonColor={isFormValid ? colors.burgundy : "#C4A0B0"}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.primaryButton}
				>
					Create account
				</Button>

				{/* Auth-switch — secondary action right below CTA */}
				<View style={styles.crossLink}>
					<Text style={styles.crossLinkText}>Already have an account?</Text>
					<Button
						mode="text"
						onPress={() => navigation.navigate("Login")}
						textColor={colors.burgundy}
						labelStyle={styles.crossLinkLabel}
						compact
					>
						Login
					</Button>
				</View>

				{/* Guest — tertiary, lowest priority, doesn't interrupt flow */}
				<Button
					mode="text"
					onPress={() => navigation.navigate("Preferences")}
					textColor={colors.textSecondary}
					labelStyle={styles.guestLabel}
					compact
				>
					Continue as guest
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: components.screenPaddingH,
	},
	backButton: {
		alignSelf: "flex-start",
		marginBottom: spacing.sm,
	},
	backContent: {
		flexDirection: "row-reverse",
	},
	backLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.lg,
	},
	form: {
		gap: spacing.sm,
	},
	input: {
		backgroundColor: colors.surface,
	},
	primaryButton: {
		borderRadius: components.cardRadius,
		marginTop: spacing.xs,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	crossLink: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.xs,
	},
	crossLinkText: {
		fontSize: typography.body.fontSize,
		color: "#4B5563",
	},
	crossLinkLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	guestLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: "500",
		textDecorationLine: "underline",
	},
});
