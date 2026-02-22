import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, SegmentedButtons, Switch, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components, spacing, typography } from "../theme";

export const SettingsScreen = () => {
	const insets = useSafeAreaInsets();

	const [alertIntensity, setAlertIntensity] = useState("medium");
	const [notifRadius, setNotifRadius] = useState("near_me");
	const [mobilityFriendly, setMobilityFriendly] = useState(false);
	const [lowStimulation, setLowStimulation] = useState(false);
	const [offlineCaching, setOfflineCaching] = useState(true);

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Settings</Text>

			<ScrollView contentContainerStyle={styles.content}>
				{/* Alert intensity */}
				<View style={styles.section}>
					<Text style={styles.label}>Alert intensity</Text>
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

				<Divider style={styles.divider} />

				{/* Notification radius */}
				<View style={styles.section}>
					<Text style={styles.label}>Notification radius</Text>
					<SegmentedButtons
						value={notifRadius}
						onValueChange={setNotifRadius}
						buttons={[
							{ value: "near_me", label: "Near me" },
							{ value: "sgw_wide", label: "SGW wide" },
						]}
						style={styles.segmented}
					/>
				</View>

				<Divider style={styles.divider} />

				{/* Toggles */}
				<View style={styles.row}>
					<Text style={styles.label}>Mobility-friendly guidance</Text>
					<Switch
						value={mobilityFriendly}
						onValueChange={setMobilityFriendly}
						color={colors.burgundy}
					/>
				</View>

				<View style={styles.row}>
					<Text style={styles.label}>Low stimulation mode</Text>
					<Switch
						value={lowStimulation}
						onValueChange={setLowStimulation}
						color={colors.burgundy}
					/>
				</View>

				<View style={styles.row}>
					<Text style={styles.label}>Offline caching</Text>
					<Switch
						value={offlineCaching}
						onValueChange={setOfflineCaching}
						color={colors.burgundy}
					/>
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
		gap: spacing.sm,
	},
	label: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	segmented: {
		alignSelf: "flex-start",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		minHeight: components.touchTarget,
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
});
