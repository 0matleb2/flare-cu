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
import { colors, components, spacing, typography } from "../theme";

export const ForgotPasswordScreen = () => {
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();

	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState("");
	const [formError, setFormError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [sent, setSent] = useState(false);

	const validateEmail = (value: string) => {
		if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
			setEmailError("Enter a valid email.");
		} else {
			setEmailError("");
		}
	};

	const isFormValid = !!email.trim() && !emailError;

	const handleSend = async () => {
		if (isSubmitting) return;
		if (!email.trim()) {
			setEmailError("Enter your email.");
		}
		if (!isFormValid) {
			setFormError("Enter a valid email to continue.");
			return;
		}

		setFormError("");
		setIsSubmitting(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 700));
			setSent(true);
		} catch {
			setFormError("Couldn't send the reset link right now. Try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (sent) {
		return (
			<ScrollView
				contentContainerStyle={[
					styles.sentContent,
					{
						paddingTop: insets.top + spacing.lg,
						paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.lg,
					},
				]}
			>
				<Text style={styles.sentEmoji}>✉️</Text>
				<Text style={styles.sentTitle}>Check your email</Text>
				<Text style={styles.sentBody}>
					We've sent a password reset link to{"\n"}
					<Text style={styles.sentEmail}>{email}</Text>
				</Text>
				<Text style={styles.sentHint}>
					If you don't see it, check your spam folder.
				</Text>
				<Button
					mode="contained"
					onPress={() => navigation.goBack()}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
				>
					Back to login
				</Button>
			</ScrollView>
		);
	}

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

				<Text style={styles.title}>Forgot password</Text>
				<Text style={styles.subtitle}>
					Enter your email and we'll send you a link to reset your password.
				</Text>

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
						returnKeyType="done"
						onSubmitEditing={() => void handleSend()}
						style={styles.input}
						outlineColor={colors.border}
						activeOutlineColor={colors.burgundy}
						error={!!emailError}
						editable={!isSubmitting}
					/>
					{!!emailError && <HelperText type="error">{emailError}</HelperText>}
					{!!formError && (
						<HelperText type="error" style={styles.formHelper}>
							{formError}
						</HelperText>
					)}

					<Button
						mode="contained"
						onPress={() => void handleSend()}
						buttonColor={colors.burgundy}
						textColor="#FFFFFF"
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						style={styles.button}
						disabled={!isFormValid || isSubmitting}
						loading={isSubmitting}
					>
						Send reset link
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
		marginBottom: spacing.xs,
	},
	subtitle: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 22,
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
	button: {
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

	// Sent confirmation
	sentContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: components.screenPaddingH,
		gap: spacing.md,
	},
	sentEmoji: {
		fontSize: 48,
	},
	sentTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	sentBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
		lineHeight: 22,
	},
	sentEmail: {
		fontWeight: "600",
		color: colors.textPrimary,
	},
	sentHint: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
		textAlign: "center",
	},
});
