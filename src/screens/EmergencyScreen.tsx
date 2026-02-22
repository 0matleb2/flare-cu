import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, FAB, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CredibilityChip } from "../components/CredibilityChip";
import { useFlares } from "../hooks/useFlares";
import type {
	EmergencyUXNavProp,
	NearbyStackParamList,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

type EmergencyRoute = RouteProp<NearbyStackParamList, "EmergencyUX">;

// Simple direction steps for emergency guidance
const EMERGENCY_STEPS = [
	"Exit the building using the nearest safe exit.",
	"Move away from the disruption area.",
	"Head towards a well-lit, populated area.",
	"If needed, contact campus security: 514-848-3717.",
];

function timeAgo(ms: number): string {
	const diff = Date.now() - ms;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins} min ago`;
	return `${Math.floor(mins / 60)}h ago`;
}

export const EmergencyScreen = () => {
	const route = useRoute<EmergencyRoute>();
	const navigation = useNavigation<EmergencyUXNavProp>();
	const insets = useSafeAreaInsets();
	const { data: flares = [] } = useFlares();

	const flare = route.params?.flareId
		? flares.find((f) => f.id === route.params.flareId)
		: undefined;

	const [currentStep, setCurrentStep] = useState(0);

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			{/* Header */}
			<View style={styles.headerSection}>
				<Text style={styles.title}>Emergency mode</Text>
				<Text style={styles.subtitle}>Follow these steps to stay safe</Text>

				{flare && (
					<View style={styles.meta}>
						<CredibilityChip level={flare.credibility} />
						<Text style={styles.timestamp}>{timeAgo(flare.lastUpdated)}</Text>
					</View>
				)}
			</View>

			{/* Step-by-step directions */}
			<View style={styles.stepsSection}>
				{EMERGENCY_STEPS.map((step, i) => (
					<View
						key={step}
						style={[
							styles.stepCard,
							i === currentStep && styles.stepCardActive,
							i < currentStep && styles.stepCardDone,
						]}
					>
						<Text
							style={[
								styles.stepNumber,
								i === currentStep && styles.stepNumberActive,
							]}
						>
							{i + 1}
						</Text>
						<Text
							style={[styles.stepText, i < currentStep && styles.stepTextDone]}
						>
							{step}
						</Text>
					</View>
				))}
			</View>

			{/* Actions */}
			<View style={styles.actions}>
				{currentStep < EMERGENCY_STEPS.length - 1 ? (
					<Button
						mode="contained"
						onPress={() => setCurrentStep((p) => p + 1)}
						buttonColor={colors.burgundy}
						textColor="#FFFFFF"
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						style={styles.button}
					>
						Next step
					</Button>
				) : (
					<Button
						mode="contained"
						onPress={() => navigation.goBack()}
						buttonColor={colors.statusSafe}
						textColor="#FFFFFF"
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						style={styles.button}
					>
						I'm safe
					</Button>
				)}

				<Button
					mode="text"
					textColor={colors.textSecondary}
					onPress={() => navigation.goBack()}
					labelStyle={styles.exitLabel}
				>
					Exit emergency mode
				</Button>
			</View>

			{/* Report FAB during emergency */}
			<FAB
				icon="alert-circle-outline"
				label="Report"
				style={styles.fab}
				color="#FFFFFF"
				onPress={() => navigation.navigate("ReportStep1")}
				customSize={44}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: components.screenPaddingH,
	},
	headerSection: {
		gap: spacing.xs,
		marginBottom: spacing.lg,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	subtitle: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	meta: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		marginTop: spacing.xs,
	},
	timestamp: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	stepsSection: {
		flex: 1,
		gap: spacing.sm,
	},
	stepCard: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.md,
	},
	stepCardActive: {
		borderColor: colors.burgundy,
		borderWidth: 2,
	},
	stepCardDone: {
		opacity: 0.5,
	},
	stepNumber: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.textSecondary,
		width: 28,
		textAlign: "center",
	},
	stepNumberActive: {
		color: colors.burgundy,
	},
	stepText: {
		flex: 1,
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
	stepTextDone: {
		textDecorationLine: "line-through",
	},
	actions: {
		gap: spacing.sm,
		paddingBottom: spacing.xl,
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
	exitLabel: {
		fontSize: typography.caption.fontSize,
	},
	fab: {
		position: "absolute",
		left: components.screenPaddingH,
		bottom: spacing.xl + 60,
		backgroundColor: colors.statusCaution,
		borderRadius: components.cardRadius,
	},
});
