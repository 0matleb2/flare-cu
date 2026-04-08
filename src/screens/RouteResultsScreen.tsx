import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFlares } from "../hooks/useFlares";
import { usePreferences } from "../hooks/usePreferences";
import type {
	RouteResultsNavProp,
	RouteStackParamList,
} from "../navigation/types";
import {
	getRouteInstructions,
	mapFlaresToActiveFlares,
	resolveBuildingId,
} from "../routing/routeHelpers";
import {
	colors,
	components,
	getAccentColors,
	spacing,
	typography,
} from "../theme";
import type { RouteLabel, RouteStep } from "../types";
import { ROUTE_LABEL_DISPLAY } from "../types";

type ResultsRoute = RouteProp<RouteStackParamList, "RouteResults">;

interface MockRoute {
	id: string;
	label: RouteLabel;
	steps: RouteStep[];
	edgeIds: string[];
}

function normalizeEdgeId(edgeId: string) {
	return edgeId.endsWith("_rev") ? edgeId.slice(0, -4) : edgeId;
}

function edgeSignature(edgeIds: string[]) {
	return edgeIds.map(normalizeEdgeId).join("|");
}

function buildRouteVariant({
	label,
	startId,
	endId,
	activeFlares,
	preferences,
	discourageFrom = [],
}: {
	label: RouteLabel;
	startId: string;
	endId: string;
	activeFlares: ReturnType<typeof mapFlaresToActiveFlares>;
	preferences: Parameters<typeof getRouteInstructions>[0]["preferences"];
	discourageFrom?: MockRoute[];
}): MockRoute {
	const baseRoute = getRouteInstructions({
		startId,
		endId,
		activeFlares,
		preferences,
	});

	const fallback: MockRoute = {
		id: `r-${label}`,
		label,
		steps: [
			{
				instruction: `Cannot calculate ${ROUTE_LABEL_DISPLAY[label].toLowerCase()} route.`,
			},
		],
		edgeIds: [],
	};

	if (!baseRoute.ok || !baseRoute.route) {
		return fallback;
	}

	const conflictingSignatures = new Set(
		discourageFrom
			.filter((route) => route.edgeIds.length > 0)
			.map((route) => edgeSignature(route.edgeIds)),
	);

	const mapRoute = (
		routeResponse: NonNullable<typeof baseRoute.route>,
	): MockRoute => ({
		id: `r-${label}`,
		label,
		steps: routeResponse.steps.map((s) => ({
			instruction: s.text,
			detail: s.indoor ? "Indoor path" : "Outdoor path",
			distance: `${s.distance} units`,
			warning: s.warning,
			flareId: s.flareId,
		})),
		edgeIds: routeResponse.edgeIds,
	});

	const baseMockRoute = mapRoute(baseRoute.route);
	if (!conflictingSignatures.has(edgeSignature(baseMockRoute.edgeIds))) {
		return baseMockRoute;
	}

	const discouragedEdgeIds = discourageFrom.flatMap((route) => route.edgeIds);
	const alternateRoute = getRouteInstructions({
		startId,
		endId,
		activeFlares,
		preferences,
		discouragedEdgeIds,
	});

	if (!alternateRoute.ok || !alternateRoute.route) {
		return baseMockRoute;
	}

	const alternateMockRoute = mapRoute(alternateRoute.route);
	return conflictingSignatures.has(edgeSignature(alternateMockRoute.edgeIds))
		? baseMockRoute
		: alternateMockRoute;
}

function orderRoutes(
	routes: MockRoute[],
	prefs: { mobilityFriendly: boolean; lowStimulation: boolean },
): MockRoute[] {
	const sorted = [...routes];
	sorted.sort((a, b) => {
		// If mobility-friendly, prioritize accessible
		if (prefs.mobilityFriendly) {
			if (a.label === "accessible") return -1;
			if (b.label === "accessible") return 1;
		}
		// If low stimulation, prioritize safest (fewest warnings)
		if (prefs.lowStimulation) {
			if (a.label === "safest") return -1;
			if (b.label === "safest") return 1;
		}
		return 0;
	});
	return sorted;
}

export const RouteResultsScreen = () => {
	const navigation = useNavigation<RouteResultsNavProp>();
	const route = useRoute<ResultsRoute>();
	const insets = useSafeAreaInsets();
	const { data: flares = [] } = useFlares();
	const { data: prefs } = usePreferences();
	const accent = getAccentColors(prefs?.lowStimulation ?? false);

	const activeFlares = mapFlaresToActiveFlares(flares);
	const startId = resolveBuildingId(route.params.from || "guy_concordia_metro");
	const endId = resolveBuildingId(route.params.to || "H");

	const fastestRoute = buildRouteVariant({
		label: "fastest_safe",
		startId,
		endId,
		activeFlares,
		preferences: ["shortest"],
	});
	const accessibleRoute = buildRouteVariant({
		label: "accessible",
		startId,
		endId,
		activeFlares,
		preferences: ["accessibleOnly", "preferIndoor", "shortest"],
		discourageFrom: [fastestRoute],
	});
	const safestRoute = buildRouteVariant({
		label: "safest",
		startId,
		endId,
		activeFlares,
		preferences: ["avoidCrowds", "preferIndoor", "shortest"],
		discourageFrom: [fastestRoute, accessibleRoute],
	});

	const dynamicRoutes = [fastestRoute, safestRoute, accessibleRoute];

	const orderedRoutes = orderRoutes(dynamicRoutes, {
		mobilityFriendly: route.params.mobilityFriendly,
		lowStimulation: prefs?.lowStimulation || false,
	});

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

			<Text style={styles.title}>Routes to {route.params.to}</Text>
			<Text style={styles.hint}>
				Best match for your preferences is shown first.
			</Text>

			<ScrollView contentContainerStyle={styles.list}>
				{orderedRoutes.map((r, routeIndex) => (
					<View key={r.id} style={styles.card}>
						<View style={styles.labelRow}>
							<Text style={[styles.routeLabel, { color: accent.primary }]}>
								{ROUTE_LABEL_DISPLAY[r.label]}
							</Text>
							{routeIndex === 0 && (
								<Text style={styles.bestMatch}>Best match</Text>
							)}
						</View>

						{r.steps.map((step, i) => (
							<View key={`${r.id}-${i}`} style={styles.stepRow}>
								<Text style={styles.stepNumber}>{i + 1}.</Text>
								<View style={styles.stepContent}>
									<Text style={styles.stepInstruction}>{step.instruction}</Text>
								</View>
							</View>
						))}

						<Button
							mode="contained"
							buttonColor={accent.primary}
							textColor="#FFFFFF"
							labelStyle={styles.buttonLabel}
							contentStyle={styles.buttonContent}
							style={styles.startButton}
							onPress={() =>
								navigation.navigate("RouteActionPlan", {
									planId: r.id,
									building: route.params.to,
									fromBuilding: route.params.from,
									zonePromptEnabled: route.params.zonePromptEnabled,
									steps: r.steps,
								})
							}
						>
							Start plan
						</Button>
					</View>
				))}
			</ScrollView>
		</View>
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
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
		paddingHorizontal: components.screenPaddingH,
	},
	hint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		paddingHorizontal: components.screenPaddingH,
		marginBottom: spacing.md,
	},
	list: {
		paddingHorizontal: components.screenPaddingH,
		paddingBottom: spacing.xl,
		gap: components.cardGap,
	},
	card: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	labelRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	routeLabel: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
	},
	bestMatch: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
		color: colors.statusSafe,
	},
	stepRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	stepNumber: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textSecondary,
		width: 20,
	},
	stepContent: {
		flex: 1,
		gap: 2,
	},
	stepInstruction: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
	stepWarning: {
		fontSize: typography.caption.fontSize,
		color: colors.statusCaution,
	},
	startButton: {
		borderRadius: components.cardRadius,
		marginTop: spacing.xs,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
