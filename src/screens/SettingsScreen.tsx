import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, Switch, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
	usePreferences,
	useResetPreferences,
	useUpdatePreferences,
} from "../hooks/usePreferences";
import type { NearbyFeedNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

export interface SettingsScreenProps {
	onLogout?: () => void;
}

export const SettingsScreen = ({ onLogout }: SettingsScreenProps) => {
	const insets = useSafeAreaInsets();
	const { data: prefs } = usePreferences();
	const updatePref = useUpdatePreferences();
	const resetPrefs = useResetPreferences();
	const navigation = useNavigation<NearbyFeedNavProp>();

	// Local state mirroring prefs
	const [alertHigh, setAlertHigh] = useState(prefs?.alertIntensity === "high");
	const [mobilityFriendly, setMobilityFriendly] = useState(
		prefs?.mobilityFriendly ?? false,
	);
	const [lowStim, setLowStim] = useState(prefs?.lowStimulation ?? false);
	const [offlineMode, setOfflineMode] = useState(false);

	const handleUpdate = (update: Record<string, unknown>) => {
		updatePref.mutate(update);
	};

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Settings</Text>

			<ScrollView contentContainerStyle={styles.content}>
				{/* ══════════ Preferences ══════════ */}
				<Text style={styles.groupTitle}>Preferences</Text>

				{/* Alert intensity toggle */}
				<View style={styles.row}>
					<View style={styles.rowText}>
						<Text style={styles.label}>Alert intensity</Text>
						<Text style={styles.hint}>
							{alertHigh
								? "High — shows all flares including unconfirmed"
								: "Low — hides unconfirmed flares for less noise"}
						</Text>
					</View>
					<Switch
						value={alertHigh}
						onValueChange={(v) => {
							setAlertHigh(v);
							handleUpdate({ alertIntensity: v ? "high" : "low" });
						}}
						color={colors.burgundy}
					/>
				</View>

				{/* Mobility-friendly */}
				<View style={styles.row}>
					<View style={styles.rowText}>
						<Text style={styles.label}>Accessibility</Text>
						<Text style={styles.hint}>
							Accessible routes appear first in Route tab
						</Text>
					</View>
					<Switch
						value={mobilityFriendly}
						onValueChange={(v) => {
							setMobilityFriendly(v);
							handleUpdate({ mobilityFriendly: v });
						}}
						color={colors.burgundy}
					/>
				</View>

				{/* Low stimulation */}
				<View style={styles.row}>
					<View style={styles.rowText}>
						<Text style={styles.label}>Low stimulation</Text>
						<Text style={styles.hint}>
							Simplifies alerts, reduces animations and visual noise
						</Text>
					</View>
					<Switch
						value={lowStim}
						onValueChange={(v) => {
							setLowStim(v);
							handleUpdate({ lowStimulation: v });
						}}
						color={colors.burgundy}
					/>
				</View>

				<Divider style={styles.divider} />

				{/* ══════════ Simulation ══════════ */}
				<Text style={styles.groupTitle}>Developer</Text>

				<View style={styles.row}>
					<View style={styles.rowText}>
						<Text style={styles.label}>Offline mode</Text>
						<Text style={styles.hint}>
							Simulates offline mode. Feed shows cached data.
						</Text>
					</View>
					<Switch
						value={offlineMode}
						onValueChange={(v) => {
							setOfflineMode(v);
							handleUpdate({ offlineCaching: !v });
						}}
						color={colors.statusCaution}
					/>
				</View>

				<Divider style={styles.divider} />

				{/* ══════════ Support ══════════ */}
				<Text style={styles.groupTitle}>Support</Text>

				<Button
					mode="outlined"
					icon="help-circle-outline"
					onPress={() => navigation.navigate("NearbyTab", { screen: "Help" })}
					textColor={colors.textPrimary}
					style={styles.supportButton}
					labelStyle={styles.supportLabel}
					contentStyle={styles.supportContent}
				>
					Help center
				</Button>

				<Button
					mode="outlined"
					icon="refresh"
					onPress={() => resetPrefs.mutate(undefined)}
					textColor={colors.textSecondary}
					style={styles.supportButton}
					labelStyle={styles.supportLabel}
					contentStyle={styles.supportContent}
				>
					Reset to defaults
				</Button>

				<Divider style={styles.divider} />

				{/* ══════════ Account ══════════ */}
				{onLogout && (
					<>
						<Button
							mode="contained"
							onPress={onLogout}
							buttonColor={colors.burgundy}
							textColor="#FFFFFF"
							style={styles.logoutButton}
							labelStyle={styles.logoutLabel}
							contentStyle={styles.supportContent}
						>
							Log out
						</Button>
						<View style={styles.logoutSpacer} />
					</>
				)}

				{/* ══════════ About ══════════ */}
				<View style={styles.aboutSection}>
					<Text style={styles.aboutText}>
						Flare CU — Campus safety, community-driven.
					</Text>
					<Text style={styles.aboutText}>
						Designed as part of the Human-Computer Interaction course at
						Concordia University.
					</Text>
					<Text style={styles.aboutMeta}>Terms & Privacy · Version 1.0.0</Text>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
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
	},

	// Group headers
	groupTitle: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
		marginBottom: spacing.sm,
		marginTop: spacing.xs,
	},

	// Setting rows
	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		minHeight: components.touchTarget,
		paddingVertical: spacing.sm,
		gap: spacing.md,
	},
	rowText: {
		flex: 1,
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
		lineHeight: 16,
	},

	divider: {
		backgroundColor: colors.border,
		marginVertical: spacing.md,
	},

	// Support buttons
	supportButton: {
		borderRadius: components.cardRadius,
		borderColor: colors.border,
		marginBottom: spacing.sm,
	},
	supportContent: {
		minHeight: components.touchTarget,
	},
	supportLabel: {
		fontSize: typography.body.fontSize,
	},

	// Logout
	logoutButton: {
		borderRadius: components.cardRadius,
	},
	logoutLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	logoutSpacer: {
		height: spacing.md,
	},

	// About
	aboutSection: {
		alignItems: "center",
		gap: spacing.xs,
		paddingVertical: spacing.lg,
	},
	aboutText: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
		textAlign: "center",
		lineHeight: 18,
	},
	aboutMeta: {
		fontSize: 11,
		color: colors.textDisabled,
		marginTop: spacing.xs,
	},
});
