import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "../components/EmptyState";
import { FlareCard } from "../components/FlareCard";
import { useFlares, useOfflineSyncStatus } from "../hooks/useFlares";
import { useLowStim } from "../hooks/useLowStim";
import type { SavedMainNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import { formatLastSyncLabel } from "../utils/syncLabels";

export const SavedScreen = () => {
	const insets = useSafeAreaInsets();
	const { data: flares = [], isError, error, refetch } = useFlares();
	const { data: syncStatus } = useOfflineSyncStatus();
	const navigation = useNavigation<SavedMainNavProp>();
	const lowStim = useLowStim();

	const savedFlares = flares.filter((f) => f.savedByUser);
	const lastSyncLabel = formatLastSyncLabel(syncStatus?.lastSync);
	const queuedCount = syncStatus?.queueCount ?? 0;
	const loadError =
		error instanceof Error
			? error.message
			: "We couldn't load your saved flares right now.";
	const syncSummary =
		queuedCount > 0
			? `${queuedCount} report${queuedCount === 1 ? "" : "s"} waiting to sync`
			: lastSyncLabel === "Not synced yet on this device"
				? "Device sync has not run yet"
				: "All offline reports are synced";

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Saved</Text>

			<ScrollView contentContainerStyle={styles.content}>
				{/* Saved flares */}
				<Text style={styles.sectionTitle}>
					Saved flares ({savedFlares.length})
				</Text>
				{isError ? (
					<EmptyState
						title="Couldn't load saved flares"
						message={loadError}
						hint="Try refreshing once the app regains access to local data."
						actionLabel="Try again"
						onAction={() => {
							void refetch();
						}}
						compact
					/>
				) : savedFlares.length > 0 ? (
					savedFlares.map((flare) => (
						<FlareCard
							key={flare.id}
							flare={flare}
							lowStim={lowStim}
							onPress={() =>
								navigation.navigate("FlareDetail", {
									flareId: flare.id,
								})
							}
						/>
					))
				) : (
					<EmptyState
						title="No saved flares yet"
						message="Save a flare from its detail page to keep it handy during your route or emergency flow."
						hint="Saved flares stay on this device so you can return to them quickly."
						compact
					/>
				)}

				{/* Sync status */}
				<Text style={styles.sectionTitle}>Sync status</Text>
				<View style={styles.card}>
					<View style={styles.row}>
						<Text style={styles.label}>Last sync</Text>
						<Text style={styles.value}>{lastSyncLabel}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Queued reports</Text>
						<Text style={styles.value}>{queuedCount}</Text>
					</View>
					<Text style={styles.syncSummary}>{syncSummary}</Text>
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
		gap: spacing.md,
	},
	sectionTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	card: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	label: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	value: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	syncSummary: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		lineHeight: 18,
	},
});
