import type { RouteProp } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, SegmentedButtons, Switch, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePreferences } from "../hooks/usePreferences";
import type { AuthStackParamList } from "../navigation/types";
import type { SessionAccessMode } from "../services/AppSessionService";
import { PreferencesService } from "../services/PreferencesService";
import {
	colors,
	components,
	getAccentColors,
	spacing,
	typography,
} from "../theme";
import { type AlertIntensity, DEFAULT_PREFERENCES } from "../types";

interface PreferencesScreenProps {
	onComplete?: (accessMode: SessionAccessMode) => void;
}

export const PreferencesScreen = ({ onComplete }: PreferencesScreenProps) => {
	const insets = useSafeAreaInsets();
	const { data: prefs } = usePreferences();
	const route = useRoute<RouteProp<AuthStackParamList, "Preferences">>();
	const accessMode = route.params?.accessMode ?? "guest";

	const [mobilityFriendly, setMobilityFriendly] = useState(
		DEFAULT_PREFERENCES.mobilityFriendly,
	);
	const [lowStimulation, setLowStimulation] = useState(
		DEFAULT_PREFERENCES.lowStimulation,
	);
	const [alertIntensity, setAlertIntensity] = useState<AlertIntensity>(
		DEFAULT_PREFERENCES.alertIntensity,
	);
	const [didHydratePrefs, setDidHydratePrefs] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const accent = getAccentColors(lowStimulation);

	useEffect(() => {
		if (!prefs || didHydratePrefs) return;
		setMobilityFriendly(prefs.mobilityFriendly);
		setLowStimulation(prefs.lowStimulation);
		setAlertIntensity(prefs.alertIntensity);
		setDidHydratePrefs(true);
	}, [prefs, didHydratePrefs]);

	const handleContinue = async () => {
		setIsSaving(true);
		await PreferencesService.savePreferences({
			mobilityFriendly,
			lowStimulation,
			alertIntensity,
		});
		setIsSaving(false);
		onComplete?.(accessMode);
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
						color={accent.primary}
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
						color={accent.primary}
					/>
				</View>

				{/* Alert intensity */}
				<View style={styles.segmentSection}>
					<View style={styles.rowText}>
						<Text style={styles.label}>Alert intensity</Text>
						<Text style={styles.hint}>
							Low hides unconfirmed flares. High shows all reported activity.
						</Text>
					</View>
					<SegmentedButtons
						value={alertIntensity}
						onValueChange={(value) =>
							setAlertIntensity(value as AlertIntensity)
						}
						buttons={[
							{ value: "low", label: "Low" },
							{ value: "high", label: "High" },
						]}
						style={styles.segmented}
					/>
				</View>
			</View>

			<View style={styles.footer}>
				<Button
					mode="contained"
					onPress={handleContinue}
					buttonColor={accent.primary}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					loading={isSaving}
					disabled={isSaving}
				>
					Continue
				</Button>
				<Button
					mode="text"
					onPress={() => onComplete?.(accessMode)}
					textColor={colors.textSecondary}
					labelStyle={styles.skipLabel}
					disabled={isSaving}
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
