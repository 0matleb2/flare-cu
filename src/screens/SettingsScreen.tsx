import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, Switch, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOfflineSyncStatus, useSyncQueuedReports } from "../hooks/useFlares";
import { useNetworkState } from "../hooks/useNetworkState";
import {
	usePreferences,
	useResetPreferences,
	useUpdatePreferences,
} from "../hooks/usePreferences";
import type { SettingsMainNavProp } from "../navigation/types";
import {
	colors,
	components,
	getAccentColors,
	spacing,
	typography,
} from "../theme";
import { DEFAULT_PREFERENCES, type UserPreferences } from "../types";
import { formatLastSyncLabel } from "../utils/syncLabels";

export interface SettingsScreenProps {
	onLogout?: () => void;
}

export const SettingsScreen = ({ onLogout }: SettingsScreenProps) => {
	const insets = useSafeAreaInsets();
	const { data: prefs } = usePreferences();
	const updatePref = useUpdatePreferences();
	const resetPrefs = useResetPreferences();
	const syncQueued = useSyncQueuedReports();
	const { data: syncStatus } = useOfflineSyncStatus();
	const navigation = useNavigation<SettingsMainNavProp>();
	const { isConnected } = useNetworkState();
	const currentPrefs = prefs ?? DEFAULT_PREFERENCES;
	const accent = getAccentColors(currentPrefs.lowStimulation);
	const isOnline = isConnected && currentPrefs.offlineCaching !== false;
	const queuedCount = syncStatus?.queueCount ?? 0;
	const lastSyncLabel = syncStatus?.lastSync
		? formatLastSyncLabel(syncStatus.lastSync)
		: undefined;
	const isSavingPreferences =
		updatePref.isPending || resetPrefs.isPending || syncQueued.isPending;

	const handleUpdate = (update: Partial<UserPreferences>) => {
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
							{currentPrefs.alertIntensity === "high"
								? "High — shows all flares including unconfirmed"
								: "Low — hides unconfirmed flares for less noise"}
						</Text>
					</View>
					<Switch
						value={currentPrefs.alertIntensity === "high"}
						onValueChange={(value) =>
							handleUpdate({ alertIntensity: value ? "high" : "low" })
						}
						color={accent.primary}
						disabled={isSavingPreferences}
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
						value={currentPrefs.mobilityFriendly}
						onValueChange={(value) => handleUpdate({ mobilityFriendly: value })}
						color={accent.primary}
						disabled={isSavingPreferences}
					/>
				</View>

				{/* Low stimulation */}
				<View style={styles.row}>
					<View style={styles.rowText}>
						<Text style={styles.label}>Low stimulation</Text>
						<Text style={styles.hint}>
							Mutes alert colors, collapses extra detail, and reduces visual
							noise
						</Text>
					</View>
					<Switch
						value={currentPrefs.lowStimulation}
						onValueChange={(value) => handleUpdate({ lowStimulation: value })}
						color={accent.primary}
						disabled={isSavingPreferences}
					/>
				</View>

				<Divider style={styles.divider} />

				{/* ══════════ Connectivity ══════════ */}
				<Text style={styles.groupTitle}>Connectivity</Text>

				<View style={styles.row}>
					<View style={styles.rowText}>
						<Text style={styles.label}>Offline mode</Text>
						<Text style={styles.hint}>
							{!isOnline
								? queuedCount > 0
									? `Offline. ${queuedCount} queued.`
									: "Offline."
								: lastSyncLabel
									? `Live. Last sync: ${lastSyncLabel}.`
									: "Live."}
						</Text>
					</View>
					<Switch
						value={!currentPrefs.offlineCaching}
						onValueChange={(value) => {
							handleUpdate({ offlineCaching: !value });
							if (!value) {
								syncQueued.mutate();
							}
						}}
						color={colors.statusCaution}
						disabled={isSavingPreferences}
					/>
				</View>

				<Divider style={styles.divider} />

				{/* ══════════ Support ══════════ */}
				<Text style={styles.groupTitle}>Support</Text>

				<Button
					mode="outlined"
					icon="help-circle-outline"
					onPress={() => navigation.navigate("Help")}
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
					disabled={isSavingPreferences}
					loading={resetPrefs.isPending}
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
							buttonColor={accent.primary}
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
