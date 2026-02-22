import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RouteSetupNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

export const RouteSetupScreen = () => {
	const navigation = useNavigation<RouteSetupNavProp>();
	const insets = useSafeAreaInsets();

	const [destination, setDestination] = useState("");
	const [avoidHighTension, setAvoidHighTension] = useState(true);
	const [mobilityFriendly, setMobilityFriendly] = useState(false);
	const [lowStimulation, setLowStimulation] = useState(false);

	const handleFindRoutes = () => {
		if (!destination) return;
		navigation.navigate("RouteResults", {
			to: destination,
			avoidHighTension,
			mobilityFriendly,
			lowStimulation,
		});
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Route</Text>

			<View style={styles.fields}>
				<TextInput
					mode="outlined"
					label="From"
					value="Current location"
					editable={false}
					style={styles.input}
					outlineColor={colors.border}
				/>
				<TextInput
					mode="outlined"
					label="To — building or entrance"
					value={destination}
					onChangeText={setDestination}
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={colors.burgundy}
				/>
			</View>

			<View style={styles.toggles}>
				<View style={styles.row}>
					<Text style={styles.label}>Avoid high tension</Text>
					<Switch
						value={avoidHighTension}
						onValueChange={setAvoidHighTension}
						color={colors.burgundy}
					/>
				</View>
				<View style={styles.row}>
					<Text style={styles.label}>Mobility-friendly</Text>
					<Switch
						value={mobilityFriendly}
						onValueChange={setMobilityFriendly}
						color={colors.burgundy}
					/>
				</View>
				<View style={styles.row}>
					<Text style={styles.label}>Low stimulation</Text>
					<Switch
						value={lowStimulation}
						onValueChange={setLowStimulation}
						color={colors.burgundy}
					/>
				</View>
			</View>

			<Button
				mode="contained"
				onPress={handleFindRoutes}
				buttonColor={colors.burgundy}
				textColor="#FFFFFF"
				labelStyle={styles.buttonLabel}
				contentStyle={styles.buttonContent}
				style={styles.button}
				disabled={!destination}
			>
				Find routes
			</Button>
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
	fields: {
		gap: spacing.md,
		marginBottom: spacing.lg,
	},
	input: {
		backgroundColor: colors.surface,
	},
	toggles: {
		gap: spacing.base,
		marginBottom: spacing.lg,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		minHeight: components.touchTarget,
	},
	label: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	button: {
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
