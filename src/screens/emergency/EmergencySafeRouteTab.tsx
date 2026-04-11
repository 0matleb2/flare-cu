import { useNavigation } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useEmergency } from "../../context/EmergencyContext";
import { getLocationDetails } from "../../data/locations";
import { useAccentColors } from "../../hooks/useAccentColors";
import { useFlares } from "../../hooks/useFlares";
import { usePreferences } from "../../hooks/usePreferences";
import {
	getRouteInstructions,
	mapFlaresToActiveFlares,
	resolveBuildingId,
} from "../../routing/routeHelpers";
import { DEFAULT_CAMPUS_BUILDING } from "../../services/CampusLocationService";
import {
	colors,
	components,
	spacing,
	typography,
	withAlpha,
} from "../../theme";
import { EmergencyCompletionCard } from "./EmergencyCompletionCard";

const TOUCH_TARGET_EXPANSION = {
	top: 8,
	right: 8,
	bottom: 8,
	left: 8,
} as const;

const STAFFED_SAFE_DESTINATIONS = [
	{
		id: "H",
		label: "Hall Building lobby",
		description: "Closest staffed lobby with campus security nearby",
	},
	{
		id: "EV",
		label: "EV Building lobby",
		description: "Large staffed indoor lobby with multiple exit options",
	},
	{
		id: "LB",
		label: "Library Building lobby",
		description: "Alternative indoor lobby with staff presence",
	},
] as const;

interface SafeRouteOption {
	id: string;
	label: string;
	description: string;
	steps: string[];
	stepWarnings: Array<string | undefined>;
	edgeIds: string[];
	destinationId: string;
	totalDistance: number;
}

function sumStepDistance(steps: Array<{ distance: number }>) {
	return steps.reduce((total, step) => total + step.distance, 0);
}

function normalizeEdgeId(edgeId: string) {
	return edgeId.endsWith("_rev") ? edgeId.slice(0, -4) : edgeId;
}

function edgeSignature(edgeIds: string[]) {
	return edgeIds.map(normalizeEdgeId).sort().join("|");
}

export const EmergencySafeRouteTab = () => {
	const navigation = useNavigation();
	const { trigger, requestExitPrompt } = useEmergency();
	const { data: prefs } = usePreferences();
	const { data: flares = [] } = useFlares();
	const accent = useAccentColors();
	const mobilityFriendly = prefs?.mobilityFriendly ?? false;
	const currentBuilding =
		trigger?.building ??
		trigger?.flare?.building ??
		DEFAULT_CAMPUS_BUILDING.name;
	const currentBuildingId = resolveBuildingId(currentBuilding);
	const activeFlares = useMemo(() => mapFlaresToActiveFlares(flares), [flares]);
	const affectedBuildingCode = trigger?.flare?.locationId
		? getLocationDetails(trigger.flare.locationId).buildingCode
		: trigger?.flare?.building
			? resolveBuildingId(trigger.flare.building)
			: undefined;
	const routePreferences = useMemo(
		() =>
			[
				...(mobilityFriendly ? (["accessibleOnly"] as const) : []),
				"avoidCrowds",
				"preferIndoor",
				"shortest",
			] as const,
		[mobilityFriendly],
	);

	const routeOptions = useMemo(() => {
		const candidates = STAFFED_SAFE_DESTINATIONS.filter(
			(destination) =>
				destination.id !== currentBuildingId &&
				destination.id !== affectedBuildingCode,
		);

		const options: SafeRouteOption[] = candidates
			.flatMap((destination) => {
				const response = getRouteInstructions({
					startId: currentBuildingId,
					endId: destination.id,
					preferences: [...routePreferences],
					activeFlares,
				});

				if (!response.ok || !response.route) {
					return [];
				}

				return [
					{
						id: destination.id,
						label: destination.label,
						description: destination.description,
						steps: response.route.steps.map((step) => step.text),
						stepWarnings: response.route.steps.map((step) => step.warning),
						edgeIds: response.route.edgeIds,
						destinationId: destination.id,
						totalDistance: sumStepDistance(response.route.steps),
					},
				];
			})
			.sort((a, b) => a.totalDistance - b.totalDistance);

		const chosen: SafeRouteOption[] = [];
		const seenSignatures = new Set<string>();

		for (const option of options) {
			const signature = edgeSignature(option.edgeIds);
			if (seenSignatures.has(signature)) {
				continue;
			}
			chosen.push(option);
			seenSignatures.add(signature);
			if (chosen.length === 2) {
				break;
			}
		}

		return chosen.map((option, index) => ({
			...option,
			id: index === 0 ? "recommended" : "alternative",
			label:
				index === 0
					? mobilityFriendly
						? "Accessible"
						: "Fast route"
					: "Alternative route",
		}));
	}, [
		activeFlares,
		affectedBuildingCode,
		currentBuildingId,
		mobilityFriendly,
		routePreferences,
	]);

	const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const [completed, setCompleted] = useState<Set<number>>(new Set());
	const [isRouteComplete, setIsRouteComplete] = useState(false);
	const selectedRoute =
		routeOptions.find((route) => route.id === activeRouteId) ?? null;

	if (selectedRoute) {
		const isLastStep = currentStep >= selectedRoute.steps.length - 1;
		const currentWarning = selectedRoute.stepWarnings[currentStep];

		const handleNext = () => {
			setCompleted((prev) => new Set(prev).add(currentStep));
			if (isLastStep) {
				setIsRouteComplete(true);
			} else {
				setCurrentStep((step) => step + 1);
			}
		};

		const handlePrev = () => {
			if (currentStep > 0) {
				setCurrentStep((step) => step - 1);
				return;
			}

			setActiveRouteId(null);
			setCurrentStep(0);
			setCompleted(new Set());
			setIsRouteComplete(false);
		};

		const handleReviewRoute = () => {
			setIsRouteComplete(false);
			setCompleted(new Set());
			setCurrentStep(0);
		};

		if (isRouteComplete) {
			return (
				<View style={styles.container}>
					<View style={styles.content}>
						<EmergencyCompletionCard
							title="Route complete"
							body="You have completed this route. Stay aware of nearby updates and only exit emergency mode when you are safe."
							reviewLabel="Review route"
							onViewUpdates={() => navigation.navigate("Updates" as never)}
							onReview={handleReviewRoute}
							onExit={requestExitPrompt}
						/>
					</View>
				</View>
			);
		}

		return (
			<View style={styles.container}>
				<View style={styles.content}>
					<ScrollView contentContainerStyle={styles.scrollContent}>
						<View
							style={[
								styles.directionCard,
								{ borderColor: accent.primaryOutline },
							]}
						>
							<Text style={styles.currentEyebrow}>Do this now</Text>
							<Text style={styles.stepInstruction}>
								{selectedRoute.steps[currentStep]}
							</Text>
							<Text style={styles.directionDetail}>
								{selectedRoute.description}
							</Text>
							{currentWarning && (
								<View style={styles.warningBox}>
									<Text style={styles.warningText}>{currentWarning}</Text>
								</View>
							)}
						</View>

						<View style={styles.overviewSection}>
							<Text style={styles.overviewTitle}>All steps</Text>
							{selectedRoute.steps.map((step, index) => {
								const isDone = completed.has(index);
								const isCurrent = index === currentStep;

								return (
									<View
										key={`${selectedRoute.id}-${step}-overview`}
										style={[styles.overviewRow, isDone && styles.overviewDone]}
									>
										<View
											style={[
												styles.overviewBadge,
												isDone && { backgroundColor: accent.primary },
												isCurrent && {
													backgroundColor: withAlpha(accent.primary, "66"),
												},
											]}
										>
											<Text
												style={[
													styles.overviewBadgeText,
													(isDone || isCurrent) &&
														styles.overviewBadgeTextLight,
												]}
											>
												{isDone ? "✓" : index + 1}
											</Text>
										</View>
										<Text
											style={[
												styles.overviewText,
												isDone && styles.overviewTextDone,
												isCurrent && styles.overviewTextCurrent,
											]}
											numberOfLines={1}
										>
											{step}
										</Text>
									</View>
								);
							})}
						</View>
					</ScrollView>
				</View>

				<View style={styles.navRow}>
					<Button
						mode="outlined"
						onPress={handlePrev}
						textColor={accent.primary}
						style={[
							styles.navButton,
							styles.outlineButton,
							{ borderColor: accent.primaryOutline },
						]}
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
					>
						Previous
					</Button>
					<Button
						mode="contained"
						onPress={handleNext}
						buttonColor={accent.primary}
						textColor="#FFFFFF"
						style={styles.navButton}
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
					>
						{isLastStep ? "Mark complete" : "Next step"}
					</Button>
				</View>
			</View>
		);
	}

	if (routeOptions.length === 0) {
		return (
			<View style={styles.container}>
				<View style={styles.emptyCard}>
					<Text style={styles.emptyTitle}>No clear safe route right now</Text>
					<Text style={styles.emptyBody}>
						Stay inside your current building if possible, follow the Steps tab,
						and contact campus security before moving through the affected area.
					</Text>
				</View>
			</View>
		);
	}

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.selectionContent}
		>
			{routeOptions.map((route) => (
				<TouchableOpacity
					key={route.id}
					style={styles.routeCard}
					activeOpacity={0.7}
					onPress={() => {
						setActiveRouteId(route.id);
						setCurrentStep(0);
						setCompleted(new Set());
						setIsRouteComplete(false);
					}}
					hitSlop={TOUCH_TARGET_EXPANSION}
					accessibilityRole="button"
					accessibilityLabel={route.label}
					accessibilityHint={`${route.description}. Opens a ${route.steps.length}-step route.`}
				>
					<View style={styles.routeTextGroup}>
						<Text style={styles.routeLabel}>{route.label}</Text>
						<Text style={styles.routeDesc}>{route.description}</Text>
					</View>
					<View style={styles.routeBottom}>
						<Text style={styles.routeStepCount}>
							{route.steps.length} steps
						</Text>
						<Text style={[styles.routeArrow, { color: accent.primary }]}>
							→
						</Text>
					</View>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: colors.background },
	content: {
		flex: 1,
		gap: spacing.md,
		paddingBottom: spacing.lg,
	},

	selectionContent: {
		gap: spacing.md,
		paddingBottom: spacing.lg,
	},
	context: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		marginTop: -spacing.sm,
	},
	contextText: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	routeCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	routeTextGroup: {
		gap: spacing.xs,
	},
	routeLabel: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	routeDesc: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
	routeBottom: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	routeStepCount: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	routeArrow: {
		fontSize: 18,
		fontWeight: "700",
	},
	scrollContent: { gap: spacing.md, paddingBottom: spacing.md },
	directionCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		borderColor: colors.burgundy,
		padding: spacing.xl,
		gap: spacing.sm,
	},
	currentEyebrow: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 0.8,
	},
	stepInstruction: {
		fontSize: 22,
		fontWeight: "700",
		color: colors.textPrimary,
		lineHeight: 30,
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
	},
	warningText: {
		fontSize: typography.caption.fontSize,
		color: colors.statusCaution,
		lineHeight: 18,
	},
	overviewSection: {
		gap: spacing.xs,
	},
	overviewTitle: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.textDisabled,
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
	overviewDone: {
		opacity: 0.45,
	},
	overviewBadge: {
		width: 24,
		height: 24,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.border,
	},
	overviewBadgeDone: {
		backgroundColor: colors.burgundy,
	},
	overviewBadgeCurrent: {
		backgroundColor: `${colors.burgundy}66`,
	},
	overviewBadgeText: {
		fontSize: typography.caption.fontSize,
		fontWeight: "700",
		color: colors.textSecondary,
	},
	overviewBadgeTextLight: {
		color: "#FFFFFF",
	},
	overviewText: {
		flex: 1,
		fontSize: typography.body.fontSize,
		color: colors.textDisabled,
	},
	overviewTextDone: {
		textDecorationLine: "line-through",
	},
	overviewTextCurrent: {
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	navRow: {
		flexDirection: "row",
		gap: spacing.sm,
		paddingTop: spacing.sm,
	},
	navButton: {
		flex: 1,
		borderRadius: components.cardRadius,
	},
	outlineButton: {
		borderColor: colors.burgundy,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	emptyCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.lg,
		gap: spacing.md,
	},
	emptyTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	emptyBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 22,
	},
});
