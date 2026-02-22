import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components, spacing, typography } from "../theme";

interface Step {
	id: string;
	number: number;
	instruction: string;
	detail?: string;
}

const MOCK_STEPS: Step[] = [
	{
		id: "1",
		number: 1,
		instruction: "Exit through the rear door",
		detail: "Use the Hall Building rear exit on Mackay Street.",
	},
	{
		id: "2",
		number: 2,
		instruction: "Walk south along Mackay Street",
		detail: "Stay on the west sidewalk. Watch for construction signage.",
	},
	{
		id: "3",
		number: 3,
		instruction: "Enter the destination building",
		detail: "Use the main entrance. Look for the accessible ramp on the right.",
	},
];

export const ActionPlanScreen = () => {
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();

	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const allDone = currentStepIndex >= MOCK_STEPS.length;

	const handleNext = () => {
		setCurrentStepIndex((prev) => prev + 1);
	};

	const handleBack = () => {
		setCurrentStepIndex((prev) => Math.max(0, prev - 1));
	};

	if (allDone) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
				<View style={styles.doneContent}>
					<Text style={styles.doneTitle}>You've arrived</Text>
					<Text style={styles.doneBody}>All steps complete. Stay safe.</Text>
				</View>
				<Button
					mode="contained"
					onPress={() => navigation.goBack()}
					buttonColor={colors.statusSafe}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
				>
					Done
				</Button>
			</View>
		);
	}

	const step = MOCK_STEPS[currentStepIndex];

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

			<View style={styles.content}>
				<Text style={styles.title}>Action plan</Text>

				{/* Progress dots */}
				<View style={styles.dotsRow}>
					{MOCK_STEPS.map((s, i) => (
						<View
							key={s.id}
							style={[
								styles.dot,
								i < currentStepIndex && styles.dotCompleted,
								i === currentStepIndex && styles.dotActive,
							]}
						/>
					))}
				</View>

				<Text style={styles.stepLabel}>
					Step {step.number} of {MOCK_STEPS.length}
				</Text>

				{/* Current step card */}
				<View style={styles.stepCard}>
					<Text style={styles.stepNumber}>{step.number}</Text>
					<Text style={styles.stepInstruction}>{step.instruction}</Text>
					{step.detail && <Text style={styles.stepDetail}>{step.detail}</Text>}
				</View>

				{/* Navigation buttons */}
				<View style={styles.navRow}>
					{currentStepIndex > 0 && (
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
						{currentStepIndex < MOCK_STEPS.length - 1
							? "Next step"
							: "Complete"}
					</Button>
				</View>
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
		flex: 1,
		gap: spacing.md,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	dotsRow: {
		flexDirection: "row",
		gap: spacing.sm,
		alignItems: "center",
	},
	dot: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: colors.border,
	},
	dotCompleted: {
		backgroundColor: colors.statusSafe,
	},
	dotActive: {
		backgroundColor: colors.burgundy,
		width: 16,
		height: 16,
		borderRadius: 8,
	},
	stepLabel: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	stepCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		borderColor: colors.burgundy,
		padding: spacing.lg,
		gap: spacing.sm,
	},
	stepNumber: {
		fontSize: 32,
		fontWeight: "700",
		color: colors.burgundy,
	},
	stepInstruction: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	stepDetail: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
	navRow: {
		flexDirection: "row",
		gap: spacing.md,
		marginTop: spacing.md,
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
	doneContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.md,
	},
	doneTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.statusSafe,
	},
	doneBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	button: {
		borderRadius: components.cardRadius,
		marginBottom: spacing.xl,
	},
});
