import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useEmergency } from "../../context/EmergencyContext";
import { useAccentColors } from "../../hooks/useAccentColors";
import {
	colors,
	components,
	spacing,
	typography,
	withAlpha,
} from "../../theme";
import { EmergencyCompletionCard } from "./EmergencyCompletionCard";

export const EmergencyStepsTab = () => {
	const navigation = useNavigation();
	const { requestExitPrompt, steps } = useEmergency();
	const accent = useAccentColors();
	const [currentStep, setCurrentStep] = useState(0);
	const [completed, setCompleted] = useState<Set<number>>(new Set());

	const handleNext = () => {
		setCompleted((prev) => new Set(prev).add(currentStep));
		if (currentStep < steps.length - 1) {
			setCurrentStep((p) => p + 1);
		}
	};

	const handlePrev = () => {
		if (currentStep > 0) setCurrentStep((p) => p - 1);
	};

	const handleRestart = () => {
		setCompleted(new Set());
		setCurrentStep(0);
	};

	const allDone = steps.length > 0 && completed.size === steps.length;
	const step = steps[currentStep];

	if (allDone) {
		return (
			<View style={styles.container}>
				<EmergencyCompletionCard
					title="Checklist complete"
					body="You have completed the recommended emergency steps. Stay in your safe location, keep monitoring updates, and only exit emergency mode when you are safe."
					reviewLabel="Review steps"
					onViewUpdates={() => navigation.navigate("Updates" as never)}
					onReview={handleRestart}
					onExit={requestExitPrompt}
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<View style={styles.content}>
				<ScrollView
					style={styles.scrollArea}
					contentContainerStyle={styles.scrollContent}
				>
					{/* Current step card */}
					{step && (
						<View
							style={[styles.stepCard, { borderColor: accent.primaryOutline }]}
						>
							<Text style={styles.currentEyebrow}>Do this now</Text>
							<Text style={styles.stepInstruction}>{step.instruction}</Text>
							<Text style={styles.stepDetail}>{step.detail}</Text>
						</View>
					)}

					{/* All steps overview */}
					<View style={styles.overviewSection}>
						<Text style={styles.overviewTitle}>All steps</Text>
						{steps.map((s, i) => {
							const isDone = completed.has(i);
							const isCurrent = i === currentStep;

							return (
								<View
									key={s.instruction}
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
												(isDone || isCurrent) && styles.overviewBadgeTextLight,
											]}
										>
											{isDone ? "✓" : i + 1}
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
										{s.instruction}
									</Text>
								</View>
							);
						})}
					</View>
				</ScrollView>
			</View>

			{/* Navigation buttons */}
			{!allDone && (
				<View style={styles.navRow}>
					{currentStep > 0 && (
						<Button
							mode="outlined"
							onPress={handlePrev}
							textColor={accent.primary}
							style={[
								styles.navButton,
								styles.outlineButton,
								{ borderColor: accent.primaryOutline },
							]}
							labelStyle={styles.navLabel}
							contentStyle={styles.navContent}
						>
							Previous
						</Button>
					)}
					<Button
						mode="contained"
						onPress={handleNext}
						buttonColor={accent.primary}
						textColor="#FFFFFF"
						style={styles.navButton}
						labelStyle={styles.navLabel}
						contentStyle={styles.navContent}
					>
						{currentStep === steps.length - 1 ? "Mark complete" : "Next step"}
					</Button>
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	content: {
		flex: 1,
		gap: spacing.md,
		paddingBottom: spacing.lg,
	},

	scrollArea: { flex: 1 },
	scrollContent: { gap: spacing.md, paddingBottom: spacing.md },
	// Current step card (matches ActionPlan direction card)
	stepCard: {
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
	stepDetail: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 22,
	},

	// Overview (matches ActionPlan)
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
		color: colors.textDisabled,
	},
	overviewTextDone: {
		textDecorationLine: "line-through",
	},
	overviewTextCurrent: {
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},

	// Navigation (matches ActionPlan)
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
	navContent: { minHeight: components.touchTarget },
	navLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
