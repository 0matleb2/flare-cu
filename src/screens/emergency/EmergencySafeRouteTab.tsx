import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useEmergency } from "../../context/EmergencyContext";
import { usePreferences } from "../../hooks/usePreferences";
import { colors, components, spacing, typography } from "../../theme";

// Emergency-constraint safe routes (pre-built, no user configuration)
interface SafeRoute {
	id: string;
	label: string;
	description: string;
	icon: string;
	steps: string[];
}

function getSafeRoutes(
	building: string | undefined,
	mobilityFriendly: boolean,
): SafeRoute[] {
	const routes: SafeRoute[] = [];

	if (building === "Hall Building" || building === "H Building") {
		routes.push({
			id: "nearest-safe",
			label: "Nearest safe building",
			description: "EV Building lobby — staffed security desk",
			icon: "🏢",
			steps: mobilityFriendly
				? [
						"Take the elevator to ground floor.",
						"Exit Hall via the accessible ramp on Mackay St.",
						"Walk east on de Maisonneuve Blvd (1 min).",
						"Enter EV Building — accessible entrance on the left.",
					]
				: [
						"Exit Hall Building through the Mackay St doors.",
						"Walk east on de Maisonneuve Blvd (1 min).",
						"Enter EV Building main entrance.",
					],
		});
	} else if (building === "EV Building") {
		routes.push({
			id: "nearest-safe",
			label: "Nearest safe building",
			description: "Hall Building lobby — staffed security desk",
			icon: "🏢",
			steps: mobilityFriendly
				? [
						"Take the elevator to ground floor.",
						"Exit EV via the accessible entrance on de Maisonneuve.",
						"Walk west on de Maisonneuve Blvd (1 min).",
						"Enter Hall Building — accessible entrance on Guy St side.",
					]
				: [
						"Exit EV Building through the main entrance.",
						"Walk west on de Maisonneuve Blvd (1 min).",
						"Enter Hall Building main entrance.",
					],
		});
	} else {
		routes.push({
			id: "nearest-safe",
			label: "Nearest safe building",
			description: "Hall or EV Building lobby — staffed security",
			icon: "🏢",
			steps: [
				"Identify the nearest large building (Hall, EV, or LB).",
				"Walk directly to the main entrance.",
				"Go to the ground-floor lobby and stay near the security desk.",
			],
		});
	}

	routes.push({
		id: "away",
		label: "Move away from area",
		description: "General evacuation — open, well-lit path",
		icon: "🚶",
		steps: [
			"Walk in the opposite direction of the disruption.",
			"Head toward a main boulevard (de Maisonneuve or Ste-Catherine).",
			"Stay on well-lit, populated sidewalks.",
			"Enter the first open building with a lobby.",
		],
	});

	return routes;
}

export const EmergencySafeRouteTab = () => {
	const { trigger } = useEmergency();
	const { data: prefs } = usePreferences();
	const mobilityFriendly = prefs?.mobilityFriendly ?? false;

	const building = trigger?.building ?? trigger?.flare?.building;
	const routes = getSafeRoutes(building, mobilityFriendly);

	const [activeRoute, setActiveRoute] = useState<string | null>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const selectedRoute = routes.find((r) => r.id === activeRoute);

	// ═══ Active route — step-by-step view ═══
	if (selectedRoute) {
		const totalSteps = selectedRoute.steps.length;
		const isLastStep = currentStep >= totalSteps - 1;

		return (
			<View style={styles.container}>
				<View style={styles.activeHeader}>
					<Text style={styles.activeLabel}>{selectedRoute.label}</Text>
					<Text style={styles.activeDesc}>{selectedRoute.description}</Text>
				</View>

				{/* Progress */}
				<View style={styles.progressRow}>
					{selectedRoute.steps.map((step, i) => (
						<View
							key={step}
							style={[
								styles.progressSegment,
								i <= currentStep && styles.progressDone,
							]}
						/>
					))}
				</View>

				{/* Current step card */}
				<View style={styles.stepCard}>
					<View style={styles.stepBadge}>
						<Text style={styles.stepBadgeText}>{currentStep + 1}</Text>
					</View>
					<Text style={styles.stepInstruction}>
						{selectedRoute.steps[currentStep]}
					</Text>
				</View>

				{/* All steps overview */}
				<View style={styles.allSteps}>
					{selectedRoute.steps.map((step, i) => (
						<View
							key={step}
							style={[
								styles.allStepRow,
								i === currentStep && styles.allStepActive,
							]}
						>
							<Text
								style={[
									styles.allStepNum,
									i <= currentStep && styles.allStepNumDone,
								]}
							>
								{i < currentStep ? "✓" : i + 1}
							</Text>
							<Text
								style={[
									styles.allStepText,
									i < currentStep && styles.allStepTextDone,
									i === currentStep && styles.allStepTextCurrent,
								]}
								numberOfLines={1}
							>
								{step}
							</Text>
						</View>
					))}
				</View>

				{/* Navigation */}
				<View style={styles.navRow}>
					<Button
						mode="outlined"
						onPress={() => {
							if (currentStep === 0) {
								setActiveRoute(null);
								setCurrentStep(0);
							} else {
								setCurrentStep((s) => s - 1);
							}
						}}
						textColor={colors.textSecondary}
						style={styles.navButton}
						labelStyle={styles.navLabel}
					>
						{currentStep === 0 ? "Back" : "Previous"}
					</Button>
					{!isLastStep && (
						<Button
							mode="contained"
							onPress={() => setCurrentStep((s) => s + 1)}
							buttonColor={colors.burgundy}
							textColor="#FFFFFF"
							style={styles.navButton}
							labelStyle={styles.navLabel}
						>
							Next step
						</Button>
					)}
					{isLastStep && (
						<Button
							mode="contained"
							onPress={() => {
								setActiveRoute(null);
								setCurrentStep(0);
							}}
							buttonColor={colors.statusSafe}
							textColor="#FFFFFF"
							style={styles.navButton}
							labelStyle={styles.navLabel}
						>
							Done
						</Button>
					)}
				</View>
			</View>
		);
	}

	// ═══ Route selection ═══
	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.selectionContent}
		>
			<Text style={styles.heading}>Safe routes</Text>
			{mobilityFriendly && (
				<View style={styles.accessibilityBadge}>
					<Text style={styles.accessibilityText}>
						♿ Accessible routes prioritized
					</Text>
				</View>
			)}

			{routes.map((route) => (
				<TouchableOpacity
					key={route.id}
					style={styles.routeCard}
					activeOpacity={0.7}
					onPress={() => {
						setActiveRoute(route.id);
						setCurrentStep(0);
					}}
				>
					<View style={styles.routeTop}>
						<Text style={styles.routeIcon}>{route.icon}</Text>
						<View style={styles.routeTextGroup}>
							<Text style={styles.routeLabel}>{route.label}</Text>
							<Text style={styles.routeDesc}>{route.description}</Text>
						</View>
					</View>
					<View style={styles.routeBottom}>
						<Text style={styles.routeStepCount}>
							{route.steps.length} steps
						</Text>
						<Text style={styles.routeArrow}>→</Text>
					</View>
				</TouchableOpacity>
			))}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },

	// ═══ Selection view ═══
	selectionContent: {
		gap: spacing.md,
		paddingBottom: spacing.lg,
	},
	heading: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	accessibilityBadge: {
		backgroundColor: `${colors.statusInfo}14`,
		borderRadius: components.cardRadius,
		padding: spacing.sm,
	},
	accessibilityText: {
		fontSize: typography.caption.fontSize,
		color: colors.statusInfo,
		fontWeight: "600",
	},

	// Route card
	routeCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		borderColor: colors.border,
		padding: spacing.lg,
		gap: spacing.md,
	},
	routeTop: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	routeIcon: {
		fontSize: 28,
	},
	routeTextGroup: {
		flex: 1,
		gap: 2,
	},
	routeLabel: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	routeDesc: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		lineHeight: 16,
	},
	routeBottom: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingTop: spacing.sm,
	},
	routeStepCount: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
	},
	routeArrow: {
		fontSize: 18,
		color: colors.burgundy,
		fontWeight: "700",
	},

	// ═══ Active route view ═══
	activeHeader: {
		gap: 2,
		marginBottom: spacing.sm,
	},
	activeLabel: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	activeDesc: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},

	// Progress
	progressRow: {
		flexDirection: "row",
		gap: 4,
		marginBottom: spacing.md,
	},
	progressSegment: {
		flex: 1,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.border,
	},
	progressDone: {
		backgroundColor: colors.burgundy,
	},

	// Current step
	stepCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		borderColor: colors.burgundy,
		padding: spacing.lg,
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.md,
	},
	stepBadge: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: colors.burgundy,
		justifyContent: "center",
		alignItems: "center",
	},
	stepBadgeText: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "700",
	},
	stepInstruction: {
		flex: 1,
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
		lineHeight: 22,
	},

	// All steps overview
	allSteps: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.sm,
		marginTop: spacing.sm,
		gap: 2,
	},
	allStepRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: 6,
		paddingHorizontal: spacing.xs,
		borderRadius: 8,
	},
	allStepActive: {
		backgroundColor: `${colors.burgundy}08`,
	},
	allStepNum: {
		width: 20,
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
		textAlign: "center",
		fontWeight: "600",
	},
	allStepNumDone: {
		color: colors.burgundy,
	},
	allStepText: {
		flex: 1,
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
	},
	allStepTextDone: {
		color: colors.textSecondary,
	},
	allStepTextCurrent: {
		color: colors.textPrimary,
		fontWeight: "600",
	},

	// Navigation
	navRow: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.md,
	},
	navButton: {
		flex: 1,
		borderRadius: components.cardRadius,
		borderColor: colors.border,
	},
	navLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
