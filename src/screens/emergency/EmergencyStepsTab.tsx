import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useEmergency } from "../../context/EmergencyContext";
import { colors, components, spacing, typography } from "../../theme";

export const EmergencyStepsTab = () => {
	const { steps } = useEmergency();
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

	const allDone = completed.size === steps.length;
	const step = steps[currentStep];

	return (
		<View style={styles.container}>
			{/* Progress bar segments */}
			<View style={styles.progressRow}>
				{steps.map((s, i) => (
					<View
						key={s.instruction}
						style={[
							styles.progressSegment,
							completed.has(i) && styles.progressComplete,
							i === currentStep && styles.progressCurrent,
						]}
					/>
				))}
			</View>

			<Text style={styles.stepLabel}>
				Step {currentStep + 1} of {steps.length}
			</Text>

			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.scrollContent}
			>
				{/* Current step card */}
				{step && (
					<View style={styles.stepCard}>
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
										isDone && styles.overviewBadgeDone,
										isCurrent && styles.overviewBadgeCurrent,
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

			{/* Navigation buttons */}
			{!allDone && (
				<View style={styles.navRow}>
					{currentStep > 0 && (
						<Button
							mode="outlined"
							onPress={handlePrev}
							textColor={colors.burgundy}
							style={styles.navButton}
							labelStyle={styles.navLabel}
							contentStyle={styles.navContent}
						>
							Previous
						</Button>
					)}
					<Button
						mode="contained"
						onPress={handleNext}
						buttonColor={colors.burgundy}
						textColor="#FFFFFF"
						style={[
							styles.navButton,
							{ flex: currentStep > 0 ? 1 : undefined },
						]}
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

	// Progress bar (matches ActionPlan)
	progressRow: {
		flexDirection: "row",
		gap: 4,
		marginBottom: spacing.xs,
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
		marginBottom: spacing.sm,
	},

	scrollArea: { flex: 1 },
	scrollContent: { gap: spacing.md, paddingBottom: spacing.md },

	// Current step card (matches ActionPlan direction card)
	stepCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		borderColor: colors.burgundy,
		padding: spacing.lg,
		gap: spacing.sm,
	},
	stepInstruction: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.textPrimary,
		lineHeight: 26,
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
	overviewDone: {
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

	// Navigation (matches ActionPlan)
	navRow: {
		flexDirection: "row",
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
	navButton: {
		flex: 1,
		borderRadius: components.cardRadius,
	},
	navContent: { minHeight: components.touchTarget },
	navLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
