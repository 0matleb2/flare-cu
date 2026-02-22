import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useEmergency } from "../../context/EmergencyContext";
import { usePreferences } from "../../hooks/usePreferences";
import { colors, components, spacing, typography } from "../../theme";

// Emergency-constraint safe routes (pre-built, no user configuration)
interface SafeRoute {
	id: string;
	label: string;
	description: string;
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
		description: "General evacuation route — open, well-lit path",
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
	const selectedRoute = routes.find((r) => r.id === activeRoute);

	return (
		<View style={styles.container}>
			{!selectedRoute ? (
				<ScrollView contentContainerStyle={styles.routesList}>
					<Text style={styles.heading}>Choose a safe route</Text>
					<Text style={styles.hint}>
						Routes use emergency constraints automatically.
						{mobilityFriendly && " Accessible routes prioritized."}
					</Text>

					{routes.map((route) => (
						<View key={route.id} style={styles.routeCard}>
							<Text style={styles.routeLabel}>{route.label}</Text>
							<Text style={styles.routeDesc}>{route.description}</Text>
							<Button
								mode="contained"
								onPress={() => setActiveRoute(route.id)}
								buttonColor={colors.burgundy}
								textColor="#FFFFFF"
								style={styles.startButton}
								labelStyle={styles.buttonLabel}
								contentStyle={styles.buttonContent}
							>
								Start route
							</Button>
						</View>
					))}
				</ScrollView>
			) : (
				<ScrollView contentContainerStyle={styles.activeRouteContainer}>
					<Text style={styles.heading}>{selectedRoute.label}</Text>
					<Text style={styles.hint}>{selectedRoute.description}</Text>

					{selectedRoute.steps.map((step) => (
						<View key={step} style={styles.stepRow}>
							<View style={styles.stepBadge}>
								<Text style={styles.stepBadgeText}>
									{selectedRoute.steps.indexOf(step) + 1}
								</Text>
							</View>
							<Text style={styles.stepText}>{step}</Text>
						</View>
					))}

					<Button
						mode="outlined"
						onPress={() => setActiveRoute(null)}
						textColor={colors.textSecondary}
						style={styles.backButton}
						labelStyle={styles.buttonLabel}
					>
						Choose different route
					</Button>
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	routesList: { gap: spacing.md, paddingBottom: spacing.md },
	heading: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	hint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.xs,
	},
	routeCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	routeLabel: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	routeDesc: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	startButton: { borderRadius: components.cardRadius },
	buttonContent: { minHeight: components.touchTarget },
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},

	activeRouteContainer: { gap: spacing.md, paddingBottom: spacing.md },
	stepRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
	},
	stepBadge: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: colors.burgundy,
		justifyContent: "center",
		alignItems: "center",
	},
	stepBadgeText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
	stepText: {
		flex: 1,
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
		lineHeight: 20,
	},
	backButton: {
		borderRadius: components.cardRadius,
		borderColor: colors.border,
	},
});
