import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
	Button,
	Divider,
	SegmentedButtons,
	Switch,
	Text,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	usePreferences,
	useResetPreferences,
	useUpdatePreferences,
} from "../hooks/usePreferences";
import { colors, components, spacing, typography } from "../theme";

export const SettingsScreen = () => {
	const insets = useSafeAreaInsets();
	const { data: prefs } = usePreferences();
	const updatePrefs = useUpdatePreferences();
	const resetPrefs = useResetPreferences();

	const [alertIntensity, setAlertIntensity] = useState("medium");
	const [notifRadius, setNotifRadius] = useState("near_me");
	const [mobilityFriendly, setMobilityFriendly] = useState(false);
	const [lowStimulation, setLowStimulation] = useState(false);
	const [offlineCaching, setOfflineCaching] = useState(true);

	// Sync local state from persisted preferences
	useEffect(() => {
		if (prefs) {
			setAlertIntensity(prefs.alertIntensity);
			setNotifRadius(prefs.notificationRadius);
			setMobilityFriendly(prefs.mobilityFriendly);
			setLowStimulation(prefs.lowStimulation);
			setOfflineCaching(prefs.offlineCaching);
		}
	}, [prefs]);

	const handleUpdate = (key: string, value: unknown) => {
		updatePrefs.mutate({ [key]: value });
	};

	const handleReset = () => {
		resetPrefs.mutate(undefined);
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Settings</Text>

			<ScrollView contentContainerStyle={styles.content}>
				{/* Alert intensity */}
				<View style={styles.section}>
					<Text style={styles.label}>Alert intensity</Text>
					<Text style={styles.hint}>Controls how many alerts you receive</Text>
					<SegmentedButtons
						value={alertIntensity}
						onValueChange={(v) => {
							setAlertIntensity(v);
							handleUpdate("alertIntensity", v);
						}}
						buttons={[
							{ value: "low", label: "Low" },
							{ value: "medium", label: "Medium" },
						]}
						style={styles.segmented}
					/>
				</View>

				<Divider style={styles.divider} />

				{/* Notification radius */}
				<View style={styles.section}>
					<Text style={styles.label}>Notification radius</Text>
					<Text style={styles.hint}>
						Near me: immediate area · SGW wide: full campus
					</Text>
					<SegmentedButtons
						value={notifRadius}
						onValueChange={(v) => {
							setNotifRadius(v);
							handleUpdate("notificationRadius", v);
						}}
						buttons={[
							{ value: "near_me", label: "Near me" },
							{ value: "sgw_wide", label: "SGW wide" },
						]}
						style={styles.segmented}
					/>
				</View>

				<Divider style={styles.divider} />

				{/* Toggles with descriptions */}
				<View style={styles.toggleSection}>
					<View style={styles.row}>
						<View style={styles.toggleText}>
							<Text style={styles.label}>Mobility-friendly guidance</Text>
							<Text style={styles.hint}>
								Prioritizes routes with ramps and elevators
							</Text>
						</View>
						<Switch
							value={mobilityFriendly}
							onValueChange={(v) => {
								setMobilityFriendly(v);
								handleUpdate("mobilityFriendly", v);
							}}
							color={colors.burgundy}
						/>
					</View>

					<View style={styles.row}>
						<View style={styles.toggleText}>
							<Text style={styles.label}>Low stimulation mode</Text>
							<Text style={styles.hint}>
								Reduces motion, mutes sounds, simplifies alerts
							</Text>
						</View>
						<Switch
							value={lowStimulation}
							onValueChange={(v) => {
								setLowStimulation(v);
								handleUpdate("lowStimulation", v);
							}}
							color={colors.burgundy}
						/>
					</View>

					<View style={styles.row}>
						<View style={styles.toggleText}>
							<Text style={styles.label}>Offline caching</Text>
							<Text style={styles.hint}>
								Saves flares locally for offline access
							</Text>
						</View>
						<Switch
							value={offlineCaching}
							onValueChange={(v) => {
								setOfflineCaching(v);
								handleUpdate("offlineCaching", v);
							}}
							color={colors.burgundy}
						/>
					</View>
				</View>

				<Divider style={styles.divider} />

				{/* About credibility labels */}
				<View style={styles.infoCard}>
					<Text style={styles.infoTitle}>About credibility labels</Text>
					<Text style={styles.infoBody}>
						Each flare progresses through four stages: Reported → Confirmed →
						Verified (official) → Resolved. Only campus authorities can mark a
						flare as Verified.
					</Text>
				</View>

				{/* Reset to defaults */}
				<Button
					mode="outlined"
					onPress={handleReset}
					textColor={colors.textSecondary}
					style={styles.resetButton}
					labelStyle={styles.resetLabel}
				>
					Reset to defaults
				</Button>
			</ScrollView>
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
		marginBottom: spacing.lg,
	},
	content: {
		paddingBottom: spacing.xl,
		gap: spacing.base,
	},
	section: {
		gap: spacing.xs,
	},
	toggleSection: {
		gap: spacing.base,
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
	segmented: {
		alignSelf: "flex-start",
		marginTop: spacing.xs,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		minHeight: components.touchTarget,
	},
	toggleText: {
		flex: 1,
		marginRight: spacing.md,
		gap: 2,
	},
	divider: {
		backgroundColor: colors.border,
	},
	infoCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	infoTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	infoBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
	resetButton: {
		borderColor: colors.border,
		borderRadius: components.cardRadius,
	},
	resetLabel: {
		fontSize: typography.body.fontSize,
	},
});
