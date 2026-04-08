import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFlares } from "../hooks/useFlares";
import { usePreferences } from "../hooks/usePreferences";
import type {
	NearbyStackParamList,
	RouteStackParamList,
} from "../navigation/types";
import {
	getRouteInstructions,
	mapFlaresToActiveFlares,
	resolveBuildingId,
} from "../routing/routeHelpers";
import { DEFAULT_CAMPUS_BUILDING } from "../services/CampusLocationService";
import {
	colors,
	components,
	getAccentColors,
	spacing,
	typography,
} from "../theme";
import { CATEGORY_LABELS, type RouteStep } from "../types";
import { getRecommendedAction } from "../utils/recommendations";

type ActionPlanRoute =
	| RouteProp<NearbyStackParamList, "ActionPlan">
	| RouteProp<RouteStackParamList, "RouteActionPlan">;

export const ActionPlanScreen = () => {
	const navigation = useNavigation();
	const route = useRoute<ActionPlanRoute>();
	const insets = useSafeAreaInsets();
	const { data: flares = [] } = useFlares();
	const { data: prefs } = usePreferences();
	const accent = getAccentColors(prefs?.lowStimulation ?? false);

	const flare = flares.find((f) => f.id === route.params.planId);

	const routeParams = route.params as {
		building?: string;
		entrance?: string;
		fromBuilding?: string;
		zonePromptEnabled?: boolean;
		steps?: RouteStep[];
	};

	const building = flare?.building ?? routeParams.building;
	const _entrance = flare?.entrance ?? routeParams.entrance;
	const fromBuilding = routeParams.fromBuilding ?? DEFAULT_CAMPUS_BUILDING.name;

	const startId = resolveBuildingId(fromBuilding);
	const endId = resolveBuildingId(building || "H");

	const activeFlares = mapFlaresToActiveFlares(flares);

	const routeResponse = getRouteInstructions({
		startId,
		endId,
		activeFlares,
		preferences: ["shortest"],
	});

	let directions: RouteStep[] = [];
	if (routeParams.steps && routeParams.steps.length > 0) {
		directions = routeParams.steps;
	} else if (routeResponse.ok && routeResponse.route) {
		directions = routeResponse.route.steps.map((s) => ({
			instruction: s.text,
			detail: s.indoor ? "Indoor path" : "Outdoor path",
			distance: `${s.distance} units`,
			warning: s.warning,
			flareId: s.flareId,
		}));
	} else {
		directions = [
			{
				instruction: "No safe route available",
				detail: routeResponse.message,
			},
		];
	}
	const planSteps =
		directions.length > 0
			? directions
			: [
					{
						instruction: "No safe route available",
						detail:
							"Try another destination or check the latest campus updates.",
					},
				];

	const [currentStep, setCurrentStep] = useState(0);
	const [completed, setCompleted] = useState<Set<number>>(new Set());
	const [alertedZoneSteps, setAlertedZoneSteps] = useState<Set<number>>(
		new Set(),
	);
	const [zonePromptsDismissedForTrip, setZonePromptsDismissedForTrip] =
		useState(false);
	const allDone = currentStep >= planSteps.length;

	const handleNext = () => {
		const nextStep = currentStep + 1;
		setCompleted((prev) => new Set(prev).add(currentStep));
		setCurrentStep(nextStep);
	};

	const handleBack = () => {
		if (currentStep > 0) setCurrentStep((p) => p - 1);
	};

	const openFlareDetails = useCallback(
		(flareId: string) => {
			const parentNavigation = navigation.getParent();
			if (parentNavigation) {
				// biome-ignore lint/suspicious/noExplicitAny: nested tab navigation target
				(parentNavigation as any).navigate("NearbyTab", {
					screen: "FlareDetail",
					params: { flareId },
				});
				return;
			}

			// biome-ignore lint/suspicious/noExplicitAny: fallback when rendered inside Nearby stack directly
			(navigation as any).navigate("FlareDetail", { flareId });
		},
		[navigation],
	);

	const step = planSteps[Math.min(currentStep, planSteps.length - 1)];
	const zoneFlare = step.flareId
		? (flares.find((candidate) => candidate.id === step.flareId) ?? null)
		: null;
	const zoneRecommendation = zoneFlare
		? getRecommendedAction(
				zoneFlare.category,
				zoneFlare.severity ?? "medium",
				true,
			)
		: undefined;
	const shouldShowZoneAlert =
		routeParams.zonePromptEnabled === true &&
		prefs !== undefined &&
		prefs.lowStimulation !== true &&
		zonePromptsDismissedForTrip !== true &&
		!!zoneFlare &&
		!alertedZoneSteps.has(currentStep);

	useEffect(() => {
		if (!shouldShowZoneAlert || !zoneFlare) {
			return;
		}

		setAlertedZoneSteps((prev) => new Set(prev).add(currentStep));

		Alert.alert("Zone of interest", zoneFlare.summary, [
			{
				text: "View flare details",
				onPress: () => openFlareDetails(zoneFlare.id),
			},
			{
				text: "Dismiss for this trip",
				onPress: () => setZonePromptsDismissedForTrip(true),
			},
			{ text: "Continue", style: "cancel" },
		]);
	}, [currentStep, openFlareDetails, shouldShowZoneAlert, zoneFlare]);

	if (allDone) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
				<View style={styles.doneContent}>
					<Text style={[styles.doneEmoji, { color: accent.primary }]}>✓</Text>
					<Text style={[styles.doneTitle, { color: accent.primary }]}>
						You've arrived
					</Text>
					<Text style={styles.doneBody}>
						All steps complete. Stay safe, and check the feed for updates.
					</Text>
				</View>
				<Button
					mode="contained"
					onPress={() => navigation.goBack()}
					buttonColor={accent.primary}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.doneButton}
				>
					Done
				</Button>
			</View>
		);
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<View style={styles.header}>
				<Button
					icon="arrow-left"
					onPress={() => navigation.goBack()}
					textColor={colors.textPrimary}
					compact
				>
					Back
				</Button>
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				{/* Title + context */}
				<Text style={styles.title}>Action plan</Text>
				{flare && (
					<Text style={styles.context}>
						{CATEGORY_LABELS[flare.category]} · {flare.location}
					</Text>
				)}
				{!flare && building && (
					<Text style={styles.context}>
						{fromBuilding ? `${fromBuilding} → ` : ""}
						{building}
					</Text>
				)}

				{/* Progress bar */}
				<View style={styles.progressRow}>
					{planSteps.map((d, i) => (
						<View
							key={`p-${d.instruction}`}
							style={[
								styles.progressSegment,
								completed.has(i) && { backgroundColor: accent.primary },
								i === currentStep && {
									backgroundColor: accent.primary,
									opacity: 0.5,
								},
							]}
						/>
					))}
				</View>

				{/* Current direction card */}
				<View
					style={[styles.directionCard, { borderColor: accent.primaryOutline }]}
				>
					<Text style={styles.directionInstruction}>{step.instruction}</Text>
					{step.detail && (
						<Text style={styles.directionDetail}>{step.detail}</Text>
					)}
					{(step.warning || zoneRecommendation) && (
						<View style={styles.warningBox}>
							{step.warning && (
								<Text style={styles.warningText}>{step.warning}</Text>
							)}
							{zoneRecommendation && (
								<Text style={styles.recommendationText}>
									Recommended action: {zoneRecommendation}
								</Text>
							)}
						</View>
					)}
				</View>

				{/* All steps overview */}
				<View style={styles.overviewSection}>
					<Text style={styles.overviewTitle}>All steps</Text>
					{planSteps.map((d, i) => (
						<View
							key={d.instruction}
							style={[
								styles.overviewRow,
								completed.has(i) && styles.overviewComplete,
							]}
						>
							<View
								style={[
									styles.overviewBadge,
									completed.has(i) && {
										backgroundColor: accent.primary,
									},
									i === currentStep && {
										backgroundColor: accent.primary,
									},
								]}
							>
								<Text
									style={[
										styles.overviewBadgeText,
										(completed.has(i) || i === currentStep) &&
											styles.overviewBadgeTextLight,
									]}
								>
									{completed.has(i) ? "✓" : i + 1}
								</Text>
							</View>
							<Text
								style={[
									styles.overviewText,
									completed.has(i) && styles.overviewTextDone,
									i === currentStep && styles.overviewTextCurrent,
								]}
								numberOfLines={1}
							>
								{d.instruction}
							</Text>
						</View>
					))}
				</View>
			</ScrollView>

			{/* Navigation buttons */}
			<View
				style={[styles.navRow, { paddingBottom: insets.bottom + spacing.md }]}
			>
				{currentStep > 0 && (
					<Button
						mode="outlined"
						onPress={handleBack}
						textColor={accent.primary}
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						style={[
							styles.navButton,
							styles.outlineButton,
							{ borderColor: accent.primaryOutline },
						]}
					>
						Previous
					</Button>
				)}
				<Button
					mode="contained"
					onPress={handleNext}
					buttonColor={accent.primary}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.navButton}
				>
					{currentStep < planSteps.length - 1 ? "Next step" : "Complete"}
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
	header: {
		flexDirection: "row",
		marginHorizontal: -components.screenPaddingH,
		paddingHorizontal: spacing.xs,
		paddingVertical: spacing.xs,
	},
	content: {
		gap: spacing.md,
		paddingBottom: spacing.lg,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	context: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		marginTop: -spacing.sm,
	},

	// Progress bar
	progressRow: {
		flexDirection: "row",
		gap: 4,
	},
	progressSegment: {
		flex: 1,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.border,
	},
	progressComplete: {
		backgroundColor: colors.burgundy,
	},
	progressCurrent: {
		backgroundColor: colors.burgundy,
		opacity: 0.5,
	},

	// Direction card
	directionCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		padding: spacing.lg,
		gap: spacing.sm,
	},

	directionInstruction: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.textPrimary,
		lineHeight: 26,
	},
	directionDetail: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 22,
	},
	warningBox: {
		backgroundColor: "#FFF3E0",
		borderRadius: 8,
		padding: spacing.sm,
		marginTop: spacing.xs,
		gap: spacing.xs,
	},
	warningText: {
		fontSize: typography.caption.fontSize,
		color: colors.statusCaution,
	},
	recommendationText: {
		fontSize: typography.caption.fontSize,
		fontWeight: "600",
		color: colors.textPrimary,
	},

	// Overview
	overviewSection: {
		gap: spacing.xs,
	},
	overviewTitle: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
		marginBottom: spacing.xs,
	},
	overviewRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: spacing.xs,
	},
	overviewComplete: {
		opacity: 0.5,
	},
	overviewBadge: {
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	overviewBadgeDone: {
		backgroundColor: colors.burgundy,
	},
	overviewBadgeCurrent: {
		backgroundColor: colors.burgundy,
	},
	overviewBadgeText: {
		fontSize: 12,
		fontWeight: "700",
		color: colors.textSecondary,
	},
	overviewBadgeTextLight: {
		color: "#FFFFFF",
	},
	overviewText: {
		flex: 1,
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	overviewTextDone: {
		textDecorationLine: "line-through",
	},
	overviewTextCurrent: {
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},

	// Navigation
	navRow: {
		flexDirection: "row",
		gap: spacing.sm,
		paddingTop: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	navButton: {
		flex: 1,
		borderRadius: components.cardRadius,
	},
	outlineButton: {
		borderColor: colors.burgundy,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},

	// Done
	doneContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.md,
	},
	doneEmoji: {
		fontSize: 48,
		color: colors.burgundy,
	},
	doneTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.burgundy,
	},
	doneBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
		maxWidth: 280,
	},
	doneButton: {
		borderRadius: components.cardRadius,
		marginBottom: spacing.xl,
	},
});
