import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, SegmentedButtons, Switch, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components, spacing, typography } from "../theme";

interface PreferencesScreenProps {
	onComplete?: () => void;
}

export const PreferencesScreen = ({ onComplete }: PreferencesScreenProps) => {
	const insets = useSafeAreaInsets();

	const [mobilityFriendly, setMobilityFriendly] = useState(false);
	const [lowStimulation, setLowStimulation] = useState(false);
	const [alertIntensity, setAlertIntensity] = useState<string>("medium");

	const handleContinue = () => {
		// In a real app, save preferences here via PreferencesService
		onComplete?.();
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Quick setup</Text>
			<Text style={styles.subtitle}>
				Customize your experience. You can change these anytime in Settings.
			</Text>

			<View style={styles.settings}>
				{/* Mobility-friendly guidance */}
				<View style={styles.row}>
					<View style={styles.rowText}>
						<Text style={styles.label}>Mobility-friendly guidance</Text>
						<Text style={styles.hint}>
							Prioritizes ramps and elevator routes
						</Text>
					</View>
					<Switch
						value={mobilityFriendly}
						onValueChange={setMobilityFriendly}
						color={colors.burgundy}
					/>
				</View>

				{/* Low stimulation mode */}
				<View style={styles.row}>
					<View style={styles.rowText}>
						<Text style={styles.label}>Low stimulation mode</Text>
						<Text style={styles.hint}>
							Reduces motion and simplifies alerts
						</Text>
					</View>
					<Switch
						value={lowStimulation}
						onValueChange={setLowStimulation}
						color={colors.burgundy}
					/>
				</View>

				{/* Alert intensity */}
				<View style={styles.segmentSection}>
					<Text style={styles.label}>Alerts intensity</Text>
					<Text style={styles.hint}>
						Low: fewer alerts · Medium: all relevant alerts
					</Text>
					<SegmentedButtons
						value={alertIntensity}
						onValueChange={setAlertIntensity}
						buttons={[
							{ value: "low", label: "Low" },
							{ value: "medium", label: "Medium" },
						]}
						style={styles.segmented}
					/>
				</View>
			</View>

			<View style={styles.footer}>
				<Button
					mode="contained"
					onPress={handleContinue}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
				>
					Continue
				</Button>
				<Button
					mode="text"
					onPress={handleContinue}
					textColor={colors.textSecondary}
					labelStyle={styles.skipLabel}
				>
					Skip for now
				</Button>
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
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	subtitle: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.lg,
	},
	settings: {
		flex: 1,
		gap: spacing.lg,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		minHeight: components.touchTarget,
	},
	rowText: {
		flex: 1,
		marginRight: spacing.base,
		gap: 2,
	},
	label: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	hint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	segmentSection: {
		gap: spacing.xs,
	},
	segmented: {
		alignSelf: "flex-start",
		marginTop: spacing.xs,
	},
	footer: {
		paddingBottom: spacing.xl,
		gap: spacing.sm,
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
	skipLabel: {
		fontSize: typography.body.fontSize,
	},
});
