import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	type CampusLocationOption,
	getDefaultLocationIdForCategory,
	getLocationDetails,
	getLocationOptionsForCategory,
	getPopularLocationOptionsForCategory,
	groupLocationOptions,
} from "../data/locations";
import { useAccentColors } from "../hooks/useAccentColors";
import { useCampusLocation } from "../hooks/useCampusLocation";
import type {
	NearbyStackParamList,
	ReportStep2NavProp,
} from "../navigation/types";
import { colors, components, spacing, typography, withAlpha } from "../theme";

const TOUCH_TARGET_EXPANSION = {
	top: 8,
	right: 8,
	bottom: 8,
	left: 8,
} as const;

type Step2Route = RouteProp<NearbyStackParamList, "ReportStep2">;

function matchesQuery(option: CampusLocationOption, query: string) {
	return option.label.toLowerCase().includes(query.toLowerCase());
}

export const ReportStep2Screen = () => {
	const navigation = useNavigation<ReportStep2NavProp>();
	const route = useRoute<Step2Route>();
	const insets = useSafeAreaInsets();
	const { isDetecting, location } = useCampusLocation();
	const accent = useAccentColors();

	const [query, setQuery] = useState("");
	const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
		null,
	);
	const [didEditLocation, setDidEditLocation] = useState(false);

	const allOptions = useMemo(
		() => getLocationOptionsForCategory(route.params.category),
		[route.params.category],
	);
	const filteredOptions = useMemo(
		() => allOptions.filter((option) => matchesQuery(option, query)),
		[allOptions, query],
	);
	const popularOptions = useMemo(() => {
		if (query.trim()) {
			return [];
		}
		return getPopularLocationOptionsForCategory(route.params.category);
	}, [route.params.category, query]);
	const popularIds = new Set(popularOptions.map((option) => option.id));
	const groupedOptions = useMemo(
		() =>
			groupLocationOptions(
				filteredOptions.filter((option) => !popularIds.has(option.id)),
			),
		[filteredOptions, popularIds],
	);

	useEffect(() => {
		if (didEditLocation || selectedLocationId || !location?.building.code) {
			return;
		}

		const suggestedLocationId = getDefaultLocationIdForCategory(
			route.params.category,
			location.building.code,
		);

		if (!suggestedLocationId) {
			return;
		}

		setSelectedLocationId(suggestedLocationId);
	}, [
		didEditLocation,
		location?.building.code,
		route.params.category,
		selectedLocationId,
	]);

	const selectedDetails = selectedLocationId
		? getLocationDetails(selectedLocationId)
		: null;

	const handleSelectLocation = (option: CampusLocationOption) => {
		setSelectedLocationId(option.id);
		setQuery("");
		setDidEditLocation(true);
	};

	const handleNext = () => {
		if (!selectedLocationId || !selectedDetails?.buildingName) {
			return;
		}

		navigation.navigate("ReportStep3", {
			category: route.params.category,
			otherText: route.params.otherText,
			locationId: selectedLocationId,
			locationLabel: selectedDetails.label,
			building: selectedDetails.buildingName,
			entrance: selectedDetails.entranceName,
		});
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<View style={[styles.header, { paddingTop: insets.top }]}>
				<Button
					icon="arrow-left"
					onPress={() => navigation.goBack()}
					textColor={colors.textPrimary}
					compact
				>
					Back
				</Button>
			</View>

			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={[
					styles.content,
					{ paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.lg },
				]}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
			>
				<View style={styles.progressRow}>
					<View
						style={[
							styles.progressSegment,
							{ backgroundColor: accent.primary },
						]}
					/>
					<View
						style={[
							styles.progressSegment,
							{ backgroundColor: withAlpha(accent.primary, "40") },
						]}
					/>
					<View style={styles.progressSegment} />
				</View>

				<Text style={styles.title}>Confirm location</Text>

				<TextInput
					mode="outlined"
					label="Search SGW location"
					value={query}
					onChangeText={(text) => {
						setQuery(text);
						setSelectedLocationId(null);
						setDidEditLocation(true);
					}}
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={accent.primary}
					placeholder="Search entrances, intersections, streets, or buildings"
				/>
				<Text style={styles.locationHint}>
					{isDetecting && !didEditLocation
						? "Matching your nearest SGW location and filtering options for this flare type."
						: (location?.message ??
							"Choose from the allowed SGW route points for this category.")}
				</Text>

				{selectedDetails && (
					<View style={styles.selectionCard}>
						<Text style={styles.selectionLabel}>Selected</Text>
						<Text style={styles.selectionValue}>{selectedDetails.label}</Text>
					</View>
				)}

				{popularOptions.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Popular</Text>
						<View style={styles.optionList}>
							{popularOptions.map((option) => {
								const isSelected = selectedLocationId === option.id;
								return (
									<TouchableOpacity
										key={option.id}
										style={[
											styles.optionRow,
											isSelected && {
												backgroundColor: withAlpha(accent.primary, "08"),
											},
										]}
										onPress={() => handleSelectLocation(option)}
										hitSlop={TOUCH_TARGET_EXPANSION}
										accessibilityRole="radio"
										accessibilityLabel={option.label}
										accessibilityState={{ selected: isSelected }}
									>
										<View style={styles.optionTextGroup}>
											<Text
												style={[
													styles.optionLabel,
													isSelected && {
														fontWeight: "600",
														color: accent.primary,
													},
												]}
											>
												{option.label}
											</Text>
										</View>
										<View
											style={[
												styles.radio,
												isSelected && { borderColor: accent.primaryOutline },
											]}
										>
											{isSelected && (
												<View
													style={[
														styles.radioInner,
														{ backgroundColor: accent.primary },
													]}
												/>
											)}
										</View>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>
				)}

				{groupedOptions.map((group) => (
					<View key={group.type} style={styles.section}>
						<Text style={styles.sectionTitle}>{group.title}</Text>
						<View style={styles.optionList}>
							{group.options.map((option) => {
								const isSelected = selectedLocationId === option.id;
								return (
									<TouchableOpacity
										key={option.id}
										style={[
											styles.optionRow,
											isSelected && {
												backgroundColor: withAlpha(accent.primary, "08"),
											},
										]}
										onPress={() => handleSelectLocation(option)}
										hitSlop={TOUCH_TARGET_EXPANSION}
										accessibilityRole="radio"
										accessibilityLabel={option.label}
										accessibilityState={{ selected: isSelected }}
									>
										<View style={styles.optionTextGroup}>
											<Text
												style={[
													styles.optionLabel,
													isSelected && {
														fontWeight: "600",
														color: accent.primary,
													},
												]}
											>
												{option.label}
											</Text>
										</View>
										<View
											style={[
												styles.radio,
												isSelected && { borderColor: accent.primaryOutline },
											]}
										>
											{isSelected && (
												<View
													style={[
														styles.radioInner,
														{ backgroundColor: accent.primary },
													]}
												/>
											)}
										</View>
									</TouchableOpacity>
								);
							})}
						</View>
					</View>
				))}

				{filteredOptions.length === 0 && (
					<View style={styles.emptyState}>
						<Text style={styles.emptyTitle}>No matching SGW locations</Text>
						<Text style={styles.emptyHint}>
							Try a building name, entrance, or campus street segment.
						</Text>
					</View>
				)}
			</ScrollView>

			<View
				style={[
					styles.bottomBar,
					{ paddingBottom: insets.bottom + spacing.md },
				]}
			>
				<Button
					mode="contained"
					onPress={handleNext}
					buttonColor={accent.primary}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					disabled={!selectedLocationId}
				>
					Next
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: spacing.xs,
		paddingVertical: spacing.xs,
	},
	scrollArea: { flex: 1 },
	content: {
		paddingHorizontal: components.screenPaddingH,
		gap: spacing.md,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	progressRow: {
		flexDirection: "row",
		gap: 4,
	},
	progressSegment: {
		flex: 1,
		height: 6,
		borderRadius: 3,
		backgroundColor: colors.border,
	},
	progressDone: {},
	progressCurrent: {},
	input: {
		backgroundColor: colors.surface,
	},
	locationHint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		marginTop: -spacing.xs,
	},
	selectionCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		gap: 4,
	},
	selectionLabel: {
		fontSize: 12,
		fontWeight: "600",
		textTransform: "uppercase",
		letterSpacing: 0.8,
		color: colors.textSecondary,
	},
	selectionValue: {
		fontSize: typography.body.fontSize,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	section: {
		gap: spacing.sm,
	},
	sectionTitle: {
		fontSize: typography.caption.fontSize,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 0.8,
	},
	optionList: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		overflow: "hidden",
	},
	optionRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.md,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	optionRowSelected: {},
	optionTextGroup: {
		flex: 1,
	},
	optionLabel: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
	optionLabelSelected: {},
	radio: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: colors.border,
		alignItems: "center",
		justifyContent: "center",
	},
	radioSelected: {},
	radioInner: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.burgundy,
	},
	emptyState: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		gap: 2,
	},
	emptyTitle: {
		fontSize: typography.body.fontSize,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	emptyHint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	bottomBar: {
		paddingHorizontal: components.screenPaddingH,
		paddingTop: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border,
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
