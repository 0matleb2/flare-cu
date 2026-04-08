import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Linking,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CredibilityChip } from "../components/CredibilityChip";
import { useEmergency } from "../context/EmergencyContext";
import { getLocationDetails } from "../data/locations";
import { useAccentColors } from "../hooks/useAccentColors";
import { useCreateFlare, useFlares } from "../hooks/useFlares";
import { resolveBuildingId } from "../routing/routeHelpers";
import { DEFAULT_CAMPUS_BUILDING } from "../services/CampusLocationService";
import { colors, components, spacing, typography } from "../theme";
import type { Flare, FlareCategory } from "../types";
import { CATEGORY_LABELS } from "../types";
import { getFlareGraphDistance } from "../utils/flareDistance";
import { EmergencySafeRouteTab } from "./emergency/EmergencySafeRouteTab";
import { EmergencyStepsTab } from "./emergency/EmergencyStepsTab";
import { EmergencyUpdatesTab } from "./emergency/EmergencyUpdatesTab";

const CAMPUS_SECURITY = "514-848-3717";

const Tab = createMaterialTopTabNavigator();

// Quick report categories
const QUICK_CATS: { value: FlareCategory; label: string }[] = [
	{ value: "blocked_entrance", label: "Blocked entrance" },
	{ value: "dense_crowd", label: "Dense crowd" },
	{ value: "access_restriction", label: "Access restriction" },
	{ value: "construction", label: "Construction" },
	{ value: "other", label: "Other" },
];

export const EmergencyShell = () => {
	const insets = useSafeAreaInsets();
	const {
		trigger,
		deactivate,
		updateTrigger,
		isExitPromptVisible,
		requestExitPrompt,
		dismissExitPrompt,
	} = useEmergency();
	const createFlare = useCreateFlare();
	const { data: flares = [] } = useFlares();
	const accent = useAccentColors();

	// Quick report state
	const [reportVisible, setReportVisible] = useState(false);
	const [reportCat, setReportCat] = useState<FlareCategory>("other");
	const [reportOtherText, setReportOtherText] = useState("");
	const [reportNote, setReportNote] = useState("");
	const [reportDone, setReportDone] = useState(false);
	const [reportQueued, setReportQueued] = useState(false);

	const currentBuilding = trigger?.building ?? DEFAULT_CAMPUS_BUILDING.name;
	const currentBuildingId = resolveBuildingId(currentBuilding);
	const activeFlares = useMemo(
		() => flares.filter((flare) => flare.credibility !== "resolved"),
		[flares],
	);
	const sameBuildingFlares = useMemo(
		() =>
			activeFlares
				.filter((flare) => {
					const flareBuildingCode = flare.locationId
						? getLocationDetails(flare.locationId).buildingCode
						: undefined;
					return (
						flareBuildingCode === currentBuildingId ||
						resolveBuildingId(flare.building) === currentBuildingId
					);
				})
				.sort((a, b) => b.lastUpdated - a.lastUpdated),
		[activeFlares, currentBuildingId],
	);
	const rankedNearbyFlares = useMemo(
		() =>
			[...activeFlares]
				.sort((a, b) => {
					const distanceDiff =
						getFlareGraphDistance(currentBuildingId, a) -
						getFlareGraphDistance(currentBuildingId, b);
					if (distanceDiff !== 0) {
						return distanceDiff;
					}
					return b.lastUpdated - a.lastUpdated;
				})
				.slice(0, 4),
		[activeFlares, currentBuildingId],
	);
	const shouldPromptForManualFlareSelection =
		trigger?.source === "manual" &&
		!trigger.flare &&
		sameBuildingFlares.length > 1;

	useEffect(() => {
		if (!trigger || trigger.source !== "manual" || trigger.flare) {
			return;
		}

		const matchedFlare =
			sameBuildingFlares.length === 1
				? sameBuildingFlares[0]
				: sameBuildingFlares.length === 0
					? rankedNearbyFlares[0]
					: null;

		if (!matchedFlare) {
			return;
		}

		updateTrigger({
			source: "manual",
			flare: matchedFlare,
			category: matchedFlare.category,
			location: matchedFlare.location,
			building: currentBuilding,
		});
	}, [
		currentBuilding,
		rankedNearbyFlares,
		sameBuildingFlares,
		trigger,
		updateTrigger,
	]);

	const handleManualFlareSelection = (flare: Flare) => {
		updateTrigger({
			source: "manual",
			flare,
			category: flare.category,
			location: flare.location,
			building: currentBuilding,
		});
	};

	const handleCallSecurity = () => {
		const url = `tel:${CAMPUS_SECURITY}`;
		Linking.canOpenURL(url).then((ok) => {
			if (ok) {
				Linking.openURL(url);
			} else {
				Alert.alert(
					"Campus Security",
					`Call ${CAMPUS_SECURITY}\n\nIf calling is unavailable, go to the nearest security desk in Hall, EV, or LB Building.`,
				);
			}
		});
	};

	const handleCall911 = () => {
		const url = "tel:911";
		Linking.canOpenURL(url).then((ok) => {
			if (ok) {
				Linking.openURL(url);
			} else {
				Alert.alert("Emergency", "Call 911 from the nearest phone.");
			}
		});
	};

	const handleQuickReport = () => {
		createFlare.mutate(
			{
				category: reportCat,
				locationId: trigger?.flare?.locationId,
				building: trigger?.building ?? trigger?.flare?.building ?? "SGW Campus",
				entrance: trigger?.flare?.entrance,
				otherText:
					reportCat === "other"
						? reportOtherText.trim() || undefined
						: undefined,
				note: reportNote || undefined,
			},
			{
				onSuccess: (newFlare) => {
					setReportQueued(newFlare.syncStatus === "queued");
					setReportDone(true);
				},
			},
		);
	};

	const handleExit = () => {
		requestExitPrompt();
	};

	return (
		<View style={[styles.shell, { paddingTop: insets.top }]}>
			{/* ═══ Persistent top banner ═══ */}
			<View style={styles.banner}>
				<View style={styles.bannerLeft}>
					<View style={styles.emergencyDot} />
					<Text style={styles.bannerTitle}>Emergency mode</Text>
				</View>
				<Button
					mode="text"
					onPress={handleExit}
					textColor="#FFFFFF"
					compact
					labelStyle={styles.exitLabel}
				>
					Exit ✕
				</Button>
			</View>

			{/* Flare context strip (if triggered from flare) */}
			{trigger?.flare && (
				<View style={styles.contextStrip}>
					<CredibilityChip level={trigger.flare.credibility} />
					<Text style={styles.contextText} numberOfLines={1}>
						{trigger.flare.summary}
					</Text>
				</View>
			)}

			{/* ═══ Emergency tab navigator / manual flare picker ═══ */}
			{shouldPromptForManualFlareSelection ? (
				<View style={styles.tabContent}>
					<View style={styles.manualPickerCard}>
						<Text style={styles.manualPickerEyebrow}>Current location</Text>
						<Text style={styles.manualPickerTitle}>{currentBuilding}</Text>
						<Text style={styles.manualPickerBody}>
							We found multiple active flares close to you. Pick the one you
							want guidance for.
						</Text>

						{sameBuildingFlares.slice(0, 4).map((flare) => (
							<TouchableOpacity
								key={flare.id}
								style={styles.manualPickerOption}
								activeOpacity={0.8}
								onPress={() => handleManualFlareSelection(flare)}
							>
								<View style={styles.manualPickerOptionTop}>
									<Text style={styles.manualPickerOptionCategory}>
										{CATEGORY_LABELS[flare.category]}
									</Text>
									<CredibilityChip level={flare.credibility} />
								</View>
								<Text style={styles.manualPickerOptionSummary}>
									{flare.summary}
								</Text>
								<Text style={styles.manualPickerOptionLocation}>
									{flare.location}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</View>
			) : (
				<Tab.Navigator
					screenOptions={{
						tabBarStyle: styles.tabBar,
						tabBarLabelStyle: styles.tabLabel,
						tabBarActiveTintColor: accent.primary,
						tabBarInactiveTintColor: colors.textSecondary,
						tabBarIndicatorStyle: [
							styles.tabIndicator,
							{ backgroundColor: accent.primary },
						],
					}}
				>
					<Tab.Screen name="Steps">
						{() => (
							<View style={styles.tabContent}>
								<EmergencyStepsTab />
							</View>
						)}
					</Tab.Screen>
					<Tab.Screen name="Safe route">
						{() => (
							<View style={styles.tabContent}>
								<EmergencySafeRouteTab />
							</View>
						)}
					</Tab.Screen>
					<Tab.Screen name="Updates">
						{() => (
							<View style={styles.tabContent}>
								<EmergencyUpdatesTab />
							</View>
						)}
					</Tab.Screen>
				</Tab.Navigator>
			)}

			{/* ═══ Persistent bottom call bar ═══ */}
			<View
				style={[
					styles.bottomBar,
					{ paddingBottom: insets.bottom + spacing.sm },
				]}
			>
				<Text style={styles.actionSectionTitle}>Emergency help</Text>
				<View style={styles.callRow}>
					<View style={styles.actionGroup}>
						<Button
							mode="outlined"
							onPress={handleCallSecurity}
							textColor={accent.primary}
							icon="phone"
							style={[
								styles.callButton,
								{ borderColor: accent.primaryOutline },
							]}
							labelStyle={styles.callLabel}
							contentStyle={styles.callContent}
						>
							Campus security
						</Button>
					</View>
					<View style={styles.actionGroup}>
						<Button
							mode="outlined"
							onPress={handleCall911}
							textColor={accent.primary}
							icon="phone"
							style={[
								styles.callButton,
								{ borderColor: accent.primaryOutline },
							]}
							labelStyle={styles.callLabel}
							contentStyle={styles.callContent}
						>
							911
						</Button>
					</View>
				</View>
				<View style={styles.reportActionGroup}>
					<Button
						mode="outlined"
						onPress={() => {
							setReportDone(false);
							setReportQueued(false);
							setReportOtherText("");
							setReportNote("");
							setReportVisible(true);
						}}
						textColor={accent.primary}
						icon="flag-outline"
						style={[
							styles.callButton,
							styles.reportActionButton,
							{ borderColor: accent.primaryOutline },
						]}
						labelStyle={styles.callLabel}
						contentStyle={styles.callContent}
					>
						Raise a flare
					</Button>
				</View>
			</View>

			{/* ═══ "I'm safe" confirmation modal ═══ */}
			<Portal>
				<Modal
					visible={isExitPromptVisible}
					onDismiss={dismissExitPrompt}
					contentContainerStyle={styles.modalContainer}
				>
					<Text style={styles.modalTitle}>Are you safe?</Text>
					<Text style={styles.modalBody}>
						Exiting emergency mode will return you to the main app.
					</Text>
					<Button
						mode="contained"
						onPress={() => {
							dismissExitPrompt();
							deactivate();
						}}
						buttonColor={colors.burgundy}
						textColor="#FFFFFF"
						style={styles.modalButton}
						labelStyle={styles.modalButtonLabel}
						contentStyle={styles.modalButtonContent}
					>
						I'm safe — exit
					</Button>
					<Button
						mode="text"
						onPress={dismissExitPrompt}
						textColor={colors.textSecondary}
						labelStyle={styles.modalCancelLabel}
					>
						Stay in emergency mode
					</Button>
				</Modal>
			</Portal>

			{/* ═══ Quick Report modal ═══ */}
			<Portal>
				<Modal
					visible={reportVisible}
					onDismiss={() => setReportVisible(false)}
					contentContainerStyle={styles.modalContainer}
				>
					{reportDone ? (
						<View style={styles.reportDone}>
							<Text style={styles.reportDoneEmoji}>✓</Text>
							<Text style={styles.reportDoneTitle}>
								{reportQueued ? "Saved offline" : "Flare raised"}
							</Text>
							<Text style={styles.reportDoneBody}>
								{reportQueued
									? "Your report was saved on this device and will sync automatically when you return to live mode."
									: "Thank you. Your report helps others stay safe."}
							</Text>
							<Button
								mode="contained"
								onPress={() => setReportVisible(false)}
								buttonColor={colors.burgundy}
								textColor="#FFFFFF"
								style={styles.modalButton}
								labelStyle={styles.modalButtonLabel}
								contentStyle={styles.modalButtonContent}
							>
								Back to emergency
							</Button>
						</View>
					) : (
						<>
							<Text style={styles.modalTitle}>Raise a flare</Text>

							<View style={styles.reportLocationCard}>
								<Text style={styles.reportLocationLabel}>Location</Text>
								<Text style={styles.reportLocationValue}>
									{trigger?.location ??
										trigger?.flare?.location ??
										"SGW Campus (auto-detected)"}
								</Text>
							</View>

							<Text style={styles.reportSectionLabel}>Category</Text>
							<View style={styles.categoryGrid}>
								{QUICK_CATS.map((c) => (
									<Button
										key={c.value}
										mode={reportCat === c.value ? "contained" : "outlined"}
										onPress={() => setReportCat(c.value)}
										buttonColor={
											reportCat === c.value ? colors.burgundy : undefined
										}
										textColor={
											reportCat === c.value ? "#FFFFFF" : colors.textPrimary
										}
										compact
										style={styles.catChip}
										labelStyle={styles.catLabel}
									>
										{c.label}
									</Button>
								))}
							</View>

							{reportCat === "other" && (
								<TextInput
									mode="outlined"
									label="What's happening?"
									value={reportOtherText}
									onChangeText={(text) =>
										setReportOtherText(text.slice(0, 140))
									}
									style={styles.noteInput}
									outlineColor={colors.border}
									activeOutlineColor={colors.burgundy}
									multiline
									numberOfLines={3}
									placeholder="Describe what's affecting campus access..."
									right={
										<TextInput.Affix text={`${reportOtherText.length}/140`} />
									}
								/>
							)}

							<TextInput
								mode="outlined"
								label="Note (optional)"
								value={reportNote}
								onChangeText={(t) => setReportNote(t.slice(0, 140))}
								style={styles.noteInput}
								outlineColor={colors.border}
								activeOutlineColor={colors.burgundy}
								multiline
								right={<TextInput.Affix text={`${reportNote.length}/140`} />}
							/>

							<Button
								mode="contained"
								icon="fire"
								onPress={handleQuickReport}
								buttonColor={colors.burgundy}
								textColor="#FFFFFF"
								loading={createFlare.isPending}
								disabled={
									createFlare.isPending ||
									(reportCat === "other" && !reportOtherText.trim())
								}
								style={styles.modalButton}
								labelStyle={styles.modalButtonLabel}
								contentStyle={styles.modalButtonContent}
							>
								Raise flare
							</Button>
						</>
					)}
				</Modal>
			</Portal>
		</View>
	);
};

const styles = StyleSheet.create({
	shell: {
		flex: 1,
		backgroundColor: colors.background,
	},

	// Banner
	banner: {
		backgroundColor: "#B71C1C",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: components.screenPaddingH,
		paddingVertical: spacing.sm,
	},
	bannerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	emergencyDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#FFFFFF",
	},
	bannerTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	exitLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},

	// Context strip
	contextStrip: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: colors.surface,
		paddingHorizontal: components.screenPaddingH,
		paddingVertical: spacing.xs,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	contextText: {
		flex: 1,
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},

	// Tab bar
	tabBar: {
		backgroundColor: colors.surface,
		elevation: 0,
		shadowOpacity: 0,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	tabLabel: {
		fontSize: 12,
		fontWeight: "500",
		textTransform: "none",
	},
	tabIndicator: {
		height: 2,
	},

	// Tab content
	tabContent: {
		flex: 1,
		backgroundColor: colors.background,
		padding: components.screenPaddingH,
		paddingTop: spacing.md,
	},
	manualPickerCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.md,
	},
	manualPickerEyebrow: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	manualPickerTitle: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	manualPickerBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 22,
	},
	manualPickerOption: {
		backgroundColor: colors.background,
		borderRadius: components.cardRadius,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.xs,
	},
	manualPickerOptionTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: spacing.sm,
	},
	manualPickerOptionCategory: {
		fontSize: typography.caption.fontSize,
		fontWeight: "700",
		color: colors.burgundy,
		textTransform: "uppercase",
	},
	manualPickerOptionSummary: {
		fontSize: typography.body.fontSize,
		fontWeight: "600",
		color: colors.textPrimary,
		lineHeight: 20,
	},
	manualPickerOptionLocation: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	tabScrollContent: {
		flex: 1,
		backgroundColor: colors.background,
	},
	tabScrollInner: {
		padding: components.screenPaddingH,
		paddingTop: spacing.md,
		paddingBottom: spacing.lg,
	},

	// Bottom bar
	bottomBar: {
		backgroundColor: colors.surface,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingHorizontal: components.screenPaddingH,
		paddingTop: spacing.sm,
		gap: spacing.sm,
	},
	actionSectionTitle: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	callRow: {
		flexDirection: "row",
		gap: spacing.sm,
		alignItems: "flex-start",
	},
	actionGroup: {
		flex: 1,
		gap: spacing.xs,
	},
	callButton: {
		borderRadius: components.cardRadius,
	},
	callContent: {
		minHeight: components.touchTarget,
	},
	callLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	reportActionGroup: {
		gap: spacing.xs,
	},
	reportActionButton: {
		width: "100%",
	},

	// Modals
	modalContainer: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		padding: spacing.lg,
		marginHorizontal: spacing.lg,
		gap: spacing.md,
	},
	modalTitle: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	modalBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	modalButton: {
		borderRadius: components.cardRadius,
	},
	modalButtonContent: {
		minHeight: components.touchTarget,
	},
	modalButtonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	modalCancelLabel: {
		fontSize: typography.caption.fontSize,
	},

	// Quick report
	reportLocationCard: {
		backgroundColor: colors.background,
		borderRadius: 8,
		padding: spacing.sm,
		gap: 2,
	},
	reportLocationLabel: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	reportLocationValue: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
	reportSectionLabel: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	categoryGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.xs,
	},
	catChip: {
		borderRadius: components.cardRadius,
		borderColor: colors.border,
	},
	catLabel: {
		fontSize: typography.caption.fontSize,
	},
	noteInput: {
		backgroundColor: colors.surface,
	},
	reportDone: {
		alignItems: "center",
		gap: spacing.md,
	},
	reportDoneEmoji: {
		fontSize: 40,
		color: colors.burgundy,
	},
	reportDoneTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.burgundy,
	},
	reportDoneBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
	},
});
