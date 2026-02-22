import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
	RouteResultsNavProp,
	RouteStackParamList,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { RouteLabel } from "../types";
import { ROUTE_LABEL_DISPLAY } from "../types";

type ResultsRoute = RouteProp<RouteStackParamList, "RouteResults">;

interface MockRoute {
	id: string;
	label: RouteLabel;
	steps: { instruction: string; warning?: string }[];
}

const MOCK_ROUTES: MockRoute[] = [
	{
		id: "r1",
		label: "safest",
		steps: [
			{ instruction: "Exit through the rear of Hall Building." },
			{ instruction: "Walk south on Mackay Street." },
			{ instruction: "Turn left on de Maisonneuve Blvd." },
			{
				instruction: "Pass the EV Building on your right.",
				warning: "Dense crowd reported near EV entrance.",
			},
			{ instruction: "Arrive at JMSB main entrance." },
		],
	},
	{
		id: "r2",
		label: "accessible",
		steps: [
			{ instruction: "Use the elevator to ground floor in Hall Building." },
			{ instruction: "Exit through the accessible ramp on Guy Street side." },
			{ instruction: "Follow the sidewalk south on Guy Street." },
			{ instruction: "Enter JMSB via the accessible entrance on Guy." },
		],
	},
	{
		id: "r3",
		label: "fastest_safe",
		steps: [
			{ instruction: "Exit Hall Building through the main entrance." },
			{ instruction: "Cross de Maisonneuve directly." },
			{ instruction: "Enter JMSB from the north side." },
		],
	},
];

export const RouteResultsScreen = () => {
	const navigation = useNavigation<RouteResultsNavProp>();
	const route = useRoute<ResultsRoute>();
	const insets = useSafeAreaInsets();

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

			<ScrollView contentContainerStyle={styles.list}>
				{MOCK_ROUTES.map((r) => (
					<View key={r.id} style={styles.card}>
						<Text style={styles.routeLabel}>
							{ROUTE_LABEL_DISPLAY[r.label]}
						</Text>

						{r.steps.map((step, i) => (
							<View key={`${r.id}-${i}`} style={styles.stepRow}>
								<Text style={styles.stepNumber}>{i + 1}.</Text>
								<View style={styles.stepContent}>
									<Text style={styles.stepInstruction}>{step.instruction}</Text>
									{step.warning && (
										<Text style={styles.stepWarning}>⚠ {step.warning}</Text>
									)}
								</View>
							</View>
						))}

						<Button
							mode="contained"
							buttonColor={colors.burgundy}
							textColor="#FFFFFF"
							labelStyle={styles.buttonLabel}
							contentStyle={styles.buttonContent}
							style={styles.startButton}
							onPress={() =>
								navigation.navigate("RouteActionPlan", { planId: r.id })
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
	routeLabel: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.burgundy,
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
