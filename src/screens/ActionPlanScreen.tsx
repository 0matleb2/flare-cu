import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFlares } from "../hooks/useFlares";
import type { NearbyStackParamList } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import { CATEGORY_LABELS } from "../types";

type ActionPlanRoute = RouteProp<NearbyStackParamList, "ActionPlan">;

interface DirectionStep {
	instruction: string;
	detail: string;
	distance?: string;
	warning?: string;
}

// Generate practical walking directions based on flare context
function getDirections(building?: string, entrance?: string): DirectionStep[] {
	if (building === "Hall Building") {
		return [
			{
				instruction: "Start at your current location",
				detail:
					"Face Hall Building (the large building with the glass facade on de Maisonneuve Blvd).",
			},
			{
				instruction: "Walk toward Mackay Street",
				detail:
					"Head west along de Maisonneuve Blvd. The Mackay side entrance is on your left.",
				distance: "~1 min",
			},
			{
				instruction: `Enter via ${entrance ?? "the side entrance"}`,
				detail:
					"Look for the double doors. Accessible entrance with ramp is 10m further along Mackay St.",
			},
			{
				instruction: "Inside: head to the main lobby",
				detail:
					"Take the corridor straight ahead. Elevators are on the right, stairs on the left. Security desk is in the lobby.",
			},
		];
	}

	if (building === "EV Building") {
		return [
			{
				instruction: "Start at your current location",
				detail:
					"Face EV Building on de Maisonneuve Blvd, east of Hall Building.",
			},
			{
				instruction: "Walk east on de Maisonneuve",
				detail:
					"Cross Guy Street at the lights. EV Building entrance is ahead on the south side.",
				distance: "~2 min",
			},
			{
				instruction: `Enter via ${entrance ?? "the main entrance"}`,
				detail:
					"Use the revolving doors or the accessible door to the right. The atrium is straight ahead.",
			},
			{
				instruction: "Inside: the atrium connects all wings",
				detail:
					"Elevators are to the left. The sky-bridge to Hall Building is on floor 2. Security is at the ground-floor desk.",
			},
		];
	}

	if (building === "LB Building") {
		return [
			{
				instruction: "Start at your current location",
				detail:
					"LB Building (Webster Library) is on de Maisonneuve Blvd, west of Guy Street.",
			},
			{
				instruction: "Walk west on de Maisonneuve",
				detail:
					"Pass the GM Building on your right. LB Building is the large building ahead.",
				distance: "~3 min",
			},
			{
				instruction: `Enter via ${entrance ?? "the main entrance"}`,
				detail:
					"The main entrance faces de Maisonneuve. Webster Library is on floors 2–4.",
			},
			{
				instruction: "Inside: lobby and library access",
				detail:
					"Elevators and stairs are to the right of the entrance. Study spaces on floors 2–4.",
			},
		];
	}

	if (building === "GM Building") {
		return [
			{
				instruction: "Start at your current location",
				detail:
					"GM Building is on de Maisonneuve Blvd, near the corner of Guy Street.",
			},
			{
				instruction: "Walk toward Guy Street",
				detail:
					"Head toward the intersection of Guy and de Maisonneuve. GM Building is on the south side.",
				distance: "~2 min",
			},
			{
				instruction: `Enter via ${entrance ?? "the main entrance"}`,
				detail:
					"The main entrance faces de Maisonneuve. There is a secondary entrance on Guy Street.",
			},
			{
				instruction: "Inside: find your destination",
				detail:
					"Check the directory in the lobby. Elevators are straight ahead past the entrance.",
			},
		];
	}

	// Generic fallback
	return [
		{
			instruction: "Start at your current location",
			detail: "Face the direction of your destination building.",
		},
		{
			instruction: "Walk toward your destination",
			detail:
				"Stay on well-lit, populated routes. Use de Maisonneuve Blvd or Ste-Catherine as your main corridor.",
			distance: "~3–5 min",
		},
		{
			instruction: "Enter the building",
			detail:
				"Use the main entrance. Look for accessibility signs if needed. Check for posted notices.",
		},
		{
			instruction: "Find your destination inside",
			detail:
				"Check the lobby directory. If unsure, ask at the security or reception desk.",
		},
	];
}

export const ActionPlanScreen = () => {
	const navigation = useNavigation();
	const route = useRoute<ActionPlanRoute>();
	const insets = useSafeAreaInsets();
	const { data: flares = [] } = useFlares();

	const flare = flares.find((f) => f.id === route.params.planId);
	const directions = getDirections(flare?.building, flare?.entrance);

	const [currentStep, setCurrentStep] = useState(0);
	const [completed, setCompleted] = useState<Set<number>>(new Set());
	const allDone = currentStep >= directions.length;

	const handleNext = () => {
		setCompleted((prev) => new Set(prev).add(currentStep));
		setCurrentStep((p) => p + 1);
	};

	const handleBack = () => {
		if (currentStep > 0) setCurrentStep((p) => p - 1);
	};

	if (allDone) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
				<View style={styles.doneContent}>
					<Text style={styles.doneEmoji}>✓</Text>
					<Text style={styles.doneTitle}>You've arrived</Text>
					<Text style={styles.doneBody}>
						All steps complete. Stay safe, and check the feed for updates.
					</Text>
				</View>
				<Button
					mode="contained"
					onPress={() => navigation.goBack()}
					buttonColor={colors.burgundy}
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

	const step = directions[currentStep];

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

				{/* Progress bar */}
				<View style={styles.progressRow}>
					{directions.map((d, i) => (
						<View
							key={`p-${d.instruction}`}
							style={[
								styles.progressSegment,
								completed.has(i) && styles.progressComplete,
								i === currentStep && styles.progressCurrent,
							]}
						/>
					))}
				</View>

				<Text style={styles.stepLabel}>
					Step {currentStep + 1} of {directions.length}
					{step.distance && ` · ${step.distance}`}
				</Text>

				{/* Current direction card */}
				<View style={styles.directionCard}>
					<Text style={styles.directionInstruction}>{step.instruction}</Text>
					<Text style={styles.directionDetail}>{step.detail}</Text>
					{step.warning && (
						<View style={styles.warningBox}>
							<Text style={styles.warningText}>⚠️ {step.warning}</Text>
						</View>
					)}
				</View>

				{/* All steps overview */}
				<View style={styles.overviewSection}>
					<Text style={styles.overviewTitle}>All steps</Text>
					{directions.map((d, i) => (
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
									completed.has(i) && styles.overviewBadgeDone,
									i === currentStep && styles.overviewBadgeCurrent,
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
						textColor={colors.burgundy}
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						style={[styles.navButton, styles.outlineButton]}
					>
						Previous
					</Button>
				)}
				<Button
					mode="contained"
					onPress={handleNext}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.navButton}
				>
					{currentStep < directions.length - 1 ? "Next step" : "Complete"}
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

	stepLabel: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},

	// Direction card
	directionCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		borderColor: colors.burgundy,
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
	},
	warningText: {
		fontSize: typography.caption.fontSize,
		color: colors.statusCaution,
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
