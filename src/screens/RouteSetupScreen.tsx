import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { RouteSetupNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

// SGW campus buildings for quick routes
const SGW_BUILDINGS = [
	{ code: "H", name: "Hall Building", address: "1455 de Maisonneuve W" },
	{ code: "EV", name: "EV Building", address: "1515 Ste-Catherine W" },
	{ code: "LB", name: "LB Building", address: "1400 de Maisonneuve W" },
	{ code: "GM", name: "GM Building", address: "1550 de Maisonneuve W" },
	{ code: "MB", name: "MB Building", address: "1450 Guy St" },
	{ code: "CL", name: "CL Building", address: "1665 Ste-Catherine W" },
	{ code: "ER", name: "ER Building", address: "2155 Guy St" },
	{ code: "FG", name: "FG Building", address: "1616 Ste-Catherine W" },
];

export const RouteSetupScreen = () => {
	const navigation = useNavigation<RouteSetupNavProp>();
	const insets = useSafeAreaInsets();

	const [destination, setDestination] = useState("");
	const [avoidHighTension, setAvoidHighTension] = useState(true);
	const [mobilityFriendly, setMobilityFriendly] = useState(false);
	const [lowStimulation, setLowStimulation] = useState(false);

	const handleFindRoutes = (dest?: string) => {
		const to = dest ?? destination;
		if (!to) return;
		navigation.navigate("RouteResults", {
			to,
			avoidHighTension,
			mobilityFriendly,
			lowStimulation,
		});
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Route</Text>

			<ScrollView contentContainerStyle={styles.scrollContent}>
				{/* ── Search fields ── */}
				<View style={styles.fields}>
					<View>
						<TextInput
							mode="outlined"
							label="From"
							value="📍 Current location"
							editable={false}
							style={styles.input}
							outlineColor={colors.border}
						/>
						<Text style={styles.locationHint}>
							SGW Campus — near Hall Building
						</Text>
					</View>
					<TextInput
						mode="outlined"
						label="To — building or entrance"
						value={destination}
						onChangeText={setDestination}
						placeholder="e.g. H Building, EV, LB"
						style={styles.input}
						outlineColor={colors.border}
						activeOutlineColor={colors.burgundy}
					/>
				</View>

				{/* ── Route preferences ── */}
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
					onPress={() => handleFindRoutes()}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					disabled={!destination}
				>
					Find routes
				</Button>

				{/* ── Quick routes ── */}
				<View style={styles.quickSection}>
					<Text style={styles.quickTitle}>Quick routes</Text>
					<Text style={styles.quickHint}>
						One tap from your current location
					</Text>

					<View style={styles.quickGrid}>
						{SGW_BUILDINGS.map((bldg) => (
							<TouchableOpacity
								key={bldg.code}
								style={styles.quickCard}
								activeOpacity={0.7}
								onPress={() => handleFindRoutes(bldg.name)}
							>
								<Text style={styles.quickCode}>{bldg.code}</Text>
								<Text style={styles.quickName} numberOfLines={1}>
									{bldg.name}
								</Text>
								<Text style={styles.quickAddress} numberOfLines={1}>
									{bldg.address}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			</ScrollView>
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
	scrollContent: {
		paddingBottom: spacing.xl,
	},
	fields: {
		gap: spacing.md,
		marginBottom: spacing.lg,
	},
	input: {
		backgroundColor: colors.surface,
	},
	locationHint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		marginTop: 4,
		marginLeft: spacing.xs,
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
		marginBottom: spacing.xl,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},

	// Quick routes
	quickSection: {
		gap: spacing.sm,
	},
	quickTitle: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	quickHint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.xs,
	},
	quickGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.sm,
	},
	quickCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		width: "47%",
		gap: 2,
	},
	quickCode: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.burgundy,
	},
	quickName: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
		color: colors.textPrimary,
	},
	quickAddress: {
		fontSize: 11,
		color: colors.textDisabled,
	},
});
