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

	return (
		<View style={styles.container}>
			{/* Progress indicator */}
			<View style={styles.progressRow}>
				<Text style={styles.progressText}>
					Step {currentStep + 1} of {steps.length}
				</Text>
				<View style={styles.dots}>
					{steps.map((s, i) => (
						<View
							key={s.instruction}
							style={[
								styles.dot,
								completed.has(i) && styles.dotComplete,
								i === currentStep && styles.dotCurrent,
							]}
						/>
					))}
				</View>
			</View>

			{/* Steps list */}
			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.stepsContainer}
			>
				{steps.map((step, i) => {
					const isComplete = completed.has(i);
					const isCurrent = i === currentStep;
					const isFuture = i > currentStep && !isComplete;

					return (
						<View
							key={step.instruction}
							style={[
								styles.stepCard,
								isCurrent && styles.stepCurrent,
								isComplete && styles.stepComplete,
								isFuture && styles.stepFuture,
							]}
						>
							<View style={styles.stepHeader}>
								<View
									style={[
										styles.badge,
										isComplete && styles.badgeComplete,
										isCurrent && styles.badgeCurrent,
									]}
								>
									<Text
										style={[
											styles.badgeText,
											(isComplete || isCurrent) && styles.badgeTextLight,
										]}
									>
										{isComplete ? "✓" : i + 1}
									</Text>
								</View>
								<Text
									style={[
										styles.instruction,
										isComplete && styles.instructionComplete,
										isFuture && styles.instructionFuture,
									]}
								>
									{step.instruction}
								</Text>
							</View>
							{(isCurrent || isComplete) && (
								<Text
									style={[styles.detail, isComplete && styles.detailComplete]}
								>
									{step.detail}
								</Text>
							)}
						</View>
					);
				})}
			</ScrollView>

			{/* Navigation buttons */}
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
						Back
					</Button>
				)}
				{!allDone && (
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
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	progressRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.sm,
	},
	progressText: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
		color: colors.textSecondary,
	},
	dots: { flexDirection: "row", gap: 6 },
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: colors.border,
	},
	dotComplete: { backgroundColor: colors.statusSafe },
	dotCurrent: {
		backgroundColor: colors.burgundy,
		width: 14,
		height: 14,
		borderRadius: 7,
	},

	scrollArea: { flex: 1 },
	stepsContainer: { gap: spacing.sm, paddingBottom: spacing.md },

	stepCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.xs,
	},
	stepCurrent: {
		borderColor: colors.burgundy,
		borderWidth: 2,
		backgroundColor: "#FFF8F0",
	},
	stepComplete: { opacity: 0.55 },
	stepFuture: { opacity: 0.35 },

	stepHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
	badge: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	badgeComplete: { backgroundColor: colors.statusSafe },
	badgeCurrent: { backgroundColor: colors.burgundy },
	badgeText: { fontSize: 14, fontWeight: "700", color: colors.textSecondary },
	badgeTextLight: { color: "#FFFFFF" },

	instruction: {
		flex: 1,
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	instructionComplete: { textDecorationLine: "line-through" },
	instructionFuture: { color: colors.textSecondary },

	detail: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
		marginLeft: 36,
	},
	detailComplete: { textDecorationLine: "line-through" },

	navRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
	navButton: { borderRadius: components.cardRadius, flex: 1 },
	navContent: { minHeight: components.touchTarget },
	navLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
