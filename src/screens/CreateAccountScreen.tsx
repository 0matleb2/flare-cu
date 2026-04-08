import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { CreateAccountScreenNavProp } from "../navigation/types";
import { AppSessionService } from "../services/AppSessionService";
import { AuthService } from "../services/AuthService";
import { colors, components, spacing, typography } from "../theme";

export const CreateAccountScreen = () => {
	const navigation = useNavigation<CreateAccountScreenNavProp>();
	const insets = useSafeAreaInsets();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [emailError, setEmailError] = useState("");
	const [formError, setFormError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validateEmail = (value: string) => {
		if (
			value &&
			!/^[^\s@]+@(concordia\.ca|live\.concordia\.ca|mail\.concordia\.ca)$/i.test(
				value,
			)
		) {
			setEmailError("Must use a valid Concordia email address.");
		} else {
			setEmailError("");
		}
	};

	const isFormValid = !!email.trim() && !emailError && !!password;

	const handleCreate = async () => {
		if (isSubmitting) return;
		if (!email.trim() || !password.trim()) {
			setFormError("Enter your email and password to continue.");
			return;
		}
		if (!isFormValid) {
			setFormError("Please fix the errors above.");
			return;
		}

		setFormError("");
		setIsSubmitting(true);

		try {
			await AuthService.register(email, password);
			await AppSessionService.saveSession({
				userEmail: email,
				accessMode: "account",
			});
			navigation.navigate("Preferences", { accessMode: "account" });
		} catch (error) {
			setFormError(
				error instanceof Error
					? error.message
					: "Couldn't create your account right now. Try again.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<ScrollView
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				contentContainerStyle={[
					styles.content,
					{
						paddingTop: insets.top + spacing.lg,
						paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.lg,
					},
				]}
			>
				<Button
					mode="text"
					onPress={() => navigation.goBack()}
					textColor={colors.burgundy}
					labelStyle={styles.backLabel}
					contentStyle={styles.backContent}
					style={styles.backButton}
					icon="arrow-left"
					disabled={isSubmitting}
				>
					Back
				</Button>

				<Text style={styles.title}>Create account</Text>

				<View style={styles.form}>
					<TextInput
						mode="outlined"
						label="Email"
						value={email}
						onChangeText={(v) => {
							setEmail(v);
							validateEmail(v);
							if (formError) setFormError("");
						}}
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
						autoComplete="email"
						textContentType="emailAddress"
						style={styles.input}
						outlineColor={colors.border}
						activeOutlineColor={colors.burgundy}
						error={!!emailError}
						editable={!isSubmitting}
					/>
					{!!emailError && <HelperText type="error">{emailError}</HelperText>}

					<TextInput
						mode="outlined"
						label="Password"
						value={password}
						onChangeText={(value) => {
							setPassword(value);
							if (formError) setFormError("");
						}}
						secureTextEntry
						autoCapitalize="none"
						autoCorrect={false}
						autoComplete="password-new"
						textContentType="newPassword"
						returnKeyType="done"
						onSubmitEditing={() => void handleCreate()}
						style={styles.input}
						outlineColor={colors.border}
						activeOutlineColor={colors.burgundy}
						editable={!isSubmitting}
					/>
					{!!formError && (
						<HelperText type="error" style={styles.formHelper}>
							{formError}
						</HelperText>
					)}

					<Button
						mode="contained"
						onPress={() => void handleCreate()}
						buttonColor={colors.burgundy}
						textColor="#FFFFFF"
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						style={styles.primaryButton}
						disabled={!isFormValid || isSubmitting}
						loading={isSubmitting}
					>
						Create account
					</Button>

					<View style={styles.crossLink}>
						<Text style={styles.crossLinkText}>Already have an account?</Text>
						<Button
							mode="text"
							onPress={() => navigation.navigate("Login")}
							textColor={colors.burgundy}
							labelStyle={styles.crossLinkLabel}
							compact
							disabled={isSubmitting}
						>
							Login
						</Button>
					</View>

					<Button
						mode="text"
						onPress={() =>
							navigation.navigate("Preferences", { accessMode: "guest" })
						}
						textColor={colors.textSecondary}
						labelStyle={styles.guestLabel}
						compact
						disabled={isSubmitting}
					>
						Continue as guest
					</Button>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	content: {
		flexGrow: 1,
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
	formHelper: {
		marginTop: -spacing.xs,
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
