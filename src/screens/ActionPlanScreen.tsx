import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Checkbox, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components, spacing, typography } from "../theme";

interface Step {
	id: string;
	instruction: string;
	completed: boolean;
}

const MOCK_STEPS: Step[] = [
	{ id: "1", instruction: "Exit through the rear door.", completed: false },
	{ id: "2", instruction: "Walk south along Mackay Street.", completed: false },
	{
		id: "3",
		instruction: "Enter JMSB via the main entrance.",
		completed: false,
	},
];

export const ActionPlanScreen = () => {
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();

	const [steps, setSteps] = useState<Step[]>(MOCK_STEPS);

	const currentStep = steps.findIndex((s) => !s.completed);
	const allDone = currentStep === -1;

	const handleComplete = (id: string) => {
		setSteps((prev) =>
			prev.map((s) => (s.id === id ? { ...s, completed: true } : s)),
		);
	};

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
				<Text style={styles.progress}>
					{allDone
						? "All steps complete"
						: `Step ${currentStep + 1} of ${steps.length}`}
				</Text>

				<View style={styles.stepsList}>
					{steps.map((step) => (
						<View key={step.id} style={styles.stepRow}>
							<Checkbox
								status={step.completed ? "checked" : "unchecked"}
								onPress={() => handleComplete(step.id)}
								color={colors.burgundy}
							/>
							<Text
								style={[
									styles.stepText,
									step.completed && styles.stepCompleted,
								]}
							>
								{step.instruction}
							</Text>
						</View>
					))}
				</View>

				{!allDone && currentStep >= 0 && (
					<Button
						mode="contained"
						onPress={() => handleComplete(steps[currentStep].id)}
						buttonColor={colors.burgundy}
						textColor="#FFFFFF"
						labelStyle={styles.buttonLabel}
						contentStyle={styles.buttonContent}
						style={styles.button}
					>
						Mark step complete
					</Button>
				)}

				{allDone && (
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
				)}
			</View>
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
	content: {
		paddingHorizontal: components.screenPaddingH,
		gap: spacing.md,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	progress: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	stepsList: {
		gap: spacing.sm,
	},
	stepRow: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		paddingVertical: spacing.sm,
		paddingRight: spacing.md,
		minHeight: components.touchTarget,
	},
	stepText: {
		flex: 1,
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
	stepCompleted: {
		textDecorationLine: "line-through",
		color: colors.textSecondary,
	},
	button: {
		borderRadius: components.cardRadius,
		marginTop: spacing.sm,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
