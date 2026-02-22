import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { colors, spacing } from "../theme";
import type { CredibilityLevel } from "../types";
import { CREDIBILITY_LABELS, CREDIBILITY_STEPS } from "../types";

interface ProgressBarProps {
	currentLevel: CredibilityLevel;
	/** If true, show labels under each step */
	showLabels?: boolean;
}

export const ProgressBar = ({
	currentLevel,
	showLabels = false,
}: ProgressBarProps) => {
	const currentIndex = CREDIBILITY_STEPS.indexOf(currentLevel);

	return (
		<View style={styles.container}>
			<View style={styles.barRow}>
				{CREDIBILITY_STEPS.map((step, index) => {
					const isFilled = index <= currentIndex;
					const isLast = index === CREDIBILITY_STEPS.length - 1;

					return (
						<View
							key={step}
							style={[styles.stepContainer, !isLast && styles.stepFlex]}
						>
							{/* Dot */}
							<View
								style={[
									styles.dot,
									{
										backgroundColor: isFilled ? colors.burgundy : colors.border,
									},
								]}
							/>
							{/* Connector line */}
							{!isLast && (
								<View
									style={[
										styles.line,
										{
											backgroundColor:
												index < currentIndex ? colors.burgundy : colors.border,
										},
									]}
								/>
							)}
						</View>
					);
				})}
			</View>

			{showLabels && (
				<View style={styles.labelRow}>
					{CREDIBILITY_STEPS.map((step) => (
						<Text key={step} style={styles.label} numberOfLines={1}>
							{CREDIBILITY_LABELS[step]}
						</Text>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: "100%",
	},
	barRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	stepContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	stepFlex: {
		flex: 1,
	},
	dot: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	line: {
		flex: 1,
		height: 2,
		marginHorizontal: 2,
	},
	labelRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: spacing.xs,
	},
	label: {
		fontSize: 10,
		color: colors.textSecondary,
		textAlign: "center",
		flex: 1,
	},
});
