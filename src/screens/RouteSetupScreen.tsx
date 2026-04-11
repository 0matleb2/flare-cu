import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Switch, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	ROUTE_QUICK_BUILDINGS,
	SGW_BUILDING_NAMES,
} from "../data/sgwBuildings";
import { useAccentColors } from "../hooks/useAccentColors";
import { useCampusLocation } from "../hooks/useCampusLocation";
import { usePreferences } from "../hooks/usePreferences";
import type { RouteSetupNavProp } from "../navigation/types";
import { DEFAULT_CAMPUS_BUILDING } from "../services/CampusLocationService";
import { colors, components, spacing, typography } from "../theme";

const TOUCH_TARGET_EXPANSION = {
	top: 8,
	right: 8,
	bottom: 8,
	left: 8,
} as const;

export const RouteSetupScreen = () => {
	const navigation = useNavigation<RouteSetupNavProp>();
	const insets = useSafeAreaInsets();
	const { isDetecting, location } = useCampusLocation();
	const { data: prefs } = usePreferences();
	const accent = useAccentColors();

	const [from, setFrom] = useState("");
	const [destination, setDestination] = useState("");
	const [avoidHighTension, setAvoidHighTension] = useState(true);
	const [mobilityFriendly, setMobilityFriendly] = useState(false);
	const [zonePromptEnabled, setZonePromptEnabled] = useState(false);

	// Sync local toggle with global preference when it loads
	useEffect(() => {
		if (prefs?.mobilityFriendly !== undefined) {
			setMobilityFriendly(prefs.mobilityFriendly);
		}
	}, [prefs?.mobilityFriendly]);
	const [showFromSuggestions, setShowFromSuggestions] = useState(false);
	const [showDestinationSuggestions, setShowDestinationSuggestions] =
		useState(false);
	const [didEditFrom, setDidEditFrom] = useState(false);
	const [didSelectDestination, setDidSelectDestination] = useState(false);
	const detectedBuilding =
		location?.building.name ?? DEFAULT_CAMPUS_BUILDING.name;

	useEffect(() => {
		if (!didEditFrom && !from) {
			setFrom(detectedBuilding);
		}
	}, [detectedBuilding, didEditFrom, from]);

	const fromBuilding = from || detectedBuilding;
	const quickDestinations = ROUTE_QUICK_BUILDINGS.filter(
		(building) => building.name !== fromBuilding,
	);
	const filteredFromBuildings = SGW_BUILDING_NAMES.filter((buildingName) =>
		buildingName.toLowerCase().includes(from.toLowerCase()),
	);
	const filteredDestinationBuildings = SGW_BUILDING_NAMES.filter(
		(buildingName) =>
			buildingName.toLowerCase().includes(destination.toLowerCase()),
	);

	const handleFindRoutes = (dest?: string) => {
		const to = dest ?? destination;
		if (!to) return;
		navigation.navigate("RouteResults", {
			from: fromBuilding,
			to,
			avoidHighTension,
			mobilityFriendly,
			zonePromptEnabled,
		});
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Route</Text>

			<ScrollView
				contentContainerStyle={styles.scrollContent}
				keyboardShouldPersistTaps="handled"
			>
				{/* ── Search fields ── */}
				<View style={styles.fields}>
					<View>
						<TextInput
							mode="outlined"
							label="From"
							value={from}
							onChangeText={(text) => {
								setDidEditFrom(true);
								setFrom(text);
								setShowFromSuggestions(text.length > 0);
							}}
							onFocus={() => setShowFromSuggestions(from.length > 0)}
							onBlur={() =>
								setTimeout(() => setShowFromSuggestions(false), 200)
							}
							style={styles.input}
							outlineColor={colors.border}
							activeOutlineColor={accent.primary}
							placeholder="e.g. MB Building"
						/>
						<Text style={styles.locationHint}>
							{isDetecting && !didEditFrom
								? "Checking location permission and matching you to the nearest SGW building."
								: (location?.message ??
									"Campus location ready. You can keep MB Building or edit it.")}
						</Text>
						{showFromSuggestions && filteredFromBuildings.length > 0 && (
							<View style={styles.suggestions}>
								{filteredFromBuildings.map((buildingName) => (
									<TouchableOpacity
										key={buildingName}
										style={styles.suggestionItem}
										onPress={() => {
											setDidEditFrom(true);
											setFrom(buildingName);
											setShowFromSuggestions(false);
										}}
										hitSlop={TOUCH_TARGET_EXPANSION}
										accessibilityRole="button"
										accessibilityLabel={`Set starting building to ${buildingName}`}
									>
										<Text style={styles.suggestionText}>{buildingName}</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
					</View>
					<TextInput
						mode="outlined"
						label="To — building or entrance"
						value={destination}
						onChangeText={(text) => {
							setDestination(text);
							setDidSelectDestination(false);
							setShowDestinationSuggestions(text.length > 0);
						}}
						onFocus={() =>
							setShowDestinationSuggestions(destination.length > 0)
						}
						onBlur={() =>
							setTimeout(() => setShowDestinationSuggestions(false), 200)
						}
						placeholder="e.g. H Building, EV, LB"
						style={styles.input}
						outlineColor={colors.border}
						activeOutlineColor={accent.primary}
					/>
					{showDestinationSuggestions &&
						filteredDestinationBuildings.length > 0 && (
							<View style={styles.suggestions}>
								{filteredDestinationBuildings.map((buildingName) => (
									<TouchableOpacity
										key={`to-${buildingName}`}
										style={styles.suggestionItem}
										onPress={() => {
											setDestination(buildingName);
											setDidSelectDestination(true);
											setShowDestinationSuggestions(false);
										}}
										hitSlop={TOUCH_TARGET_EXPANSION}
										accessibilityRole="button"
										accessibilityLabel={`Set destination to ${buildingName}`}
									>
										<Text style={styles.suggestionText}>{buildingName}</Text>
									</TouchableOpacity>
								))}
							</View>
						)}
				</View>

				{/* ── Route preferences ── */}
				<View style={styles.toggles}>
					<View style={styles.row}>
						<View style={styles.rowText}>
							<Text style={styles.label}>Avoid high tension</Text>
							<Text style={styles.preferenceHint}>
								Reroutes away from active crowding, blocked entrances, and
								restrictions
							</Text>
						</View>
						<Switch
							value={avoidHighTension}
							onValueChange={setAvoidHighTension}
							color={accent.primary}
						/>
					</View>
					<View style={styles.row}>
						<View style={styles.rowText}>
							<Text style={styles.label}>Mobility-friendly</Text>
							<Text style={styles.preferenceHint}>
								Prefers ramps, curb cuts, elevators, and accessible entrances
							</Text>
						</View>
						<Switch
							value={mobilityFriendly}
							onValueChange={setMobilityFriendly}
							color={accent.primary}
						/>
					</View>
					<View style={styles.row}>
						<View style={styles.rowText}>
							<Text style={styles.label}>Zone of interest prompts</Text>
							<Text style={styles.preferenceHint}>
								Show in-route alerts when you approach an active flare on this
								trip
							</Text>
						</View>
						<Switch
							value={zonePromptEnabled}
							onValueChange={setZonePromptEnabled}
							color={accent.primary}
						/>
					</View>
				</View>

				<Button
					mode="contained"
					onPress={() => handleFindRoutes()}
					buttonColor={accent.primary}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					disabled={!destination || !didSelectDestination}
				>
					Find routes
				</Button>

				{/* ── Quick routes ── */}
				<View style={styles.quickSection}>
					<Text style={styles.quickTitle}>Popular destinations</Text>
					<Text style={styles.quickHint}>One tap from {fromBuilding}</Text>

					<View style={styles.quickGrid}>
						{quickDestinations.map((bldg) => (
							<TouchableOpacity
								key={bldg.code}
								style={styles.quickCard}
								activeOpacity={0.7}
								onPress={() => handleFindRoutes(bldg.name)}
								hitSlop={TOUCH_TARGET_EXPANSION}
								accessibilityRole="button"
								accessibilityLabel={`${bldg.name}, popular destination`}
								accessibilityHint={`Find routes from ${fromBuilding} to ${bldg.name}.`}
							>
								<Text style={[styles.quickCode, { color: accent.primary }]}>
									{bldg.code}
								</Text>
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
	suggestions: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: components.cardRadius,
		marginTop: spacing.xs,
		overflow: "hidden",
	},
	suggestionItem: {
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	suggestionText: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
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
		gap: spacing.md,
	},
	rowText: {
		flex: 1,
		gap: 2,
	},
	label: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	preferenceHint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		lineHeight: 16,
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
