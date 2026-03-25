import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { LoginScreenNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

export const LoginScreen = () => {
	const navigation = useNavigation<LoginScreenNavProp>();
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

	const handleLogin = () => {
		if (!email || emailError) return;
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
			<Text style={styles.title}>Login</Text>

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

				<Button
					mode="contained"
					onPress={handleLogin}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					disabled={!email || !!emailError}
				>
					Login
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
		gap: spacing.md,
	},
	input: {
		backgroundColor: colors.surface,
	},
	button: {
		borderRadius: components.cardRadius,
		marginTop: spacing.sm,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
