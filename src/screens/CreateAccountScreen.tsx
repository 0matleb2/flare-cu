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

	const handleCreate = () => {
		if (!email || emailError) return;
		navigation.navigate("Preferences");
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Create account</Text>

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
					onPress={handleCreate}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					disabled={!email || !!emailError}
				>
					Create account
				</Button>

				<Button
					mode="text"
					onPress={() => navigation.navigate("Preferences")}
					textColor={colors.burgundy}
					labelStyle={styles.secondaryLabel}
				>
					Skip for now
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
	secondaryLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
