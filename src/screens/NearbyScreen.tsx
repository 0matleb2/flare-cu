import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Button, FAB, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "../components/EmptyState";
import { FlareCard } from "../components/FlareCard";
import { OfflineBanner } from "../components/OfflineBanner";
import { StatusRow } from "../components/StatusRow";
import { ZonePromptModal } from "../components/ZonePromptModal";
import { useFlares } from "../hooks/useFlares";
import { usePreferences } from "../hooks/usePreferences";
import type { NearbyFeedNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { Flare } from "../types";

export const NearbyScreen = () => {
	const { data: flares = [], isLoading, refetch } = useFlares();
	const { data: prefs } = usePreferences();
	const navigation = useNavigation<NearbyFeedNavProp>();
	const insets = useSafeAreaInsets();

	const [zonePromptVisible, setZonePromptVisible] = useState(false);
	const [zoneFlareId, _setZoneFlareId] = useState<string | null>(null);

	const isOnline = prefs?.offlineCaching !== false;

	// Filter: hide resolved if not relevant, hide unconfirmed in low intensity
	const feedFlares = flares.filter((f) => {
		if (prefs?.alertIntensity === "low" && f.credibility === "reported")
			return false;
		return true;
	});

	const syncTimeStr = new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	const renderItem = ({ item }: { item: Flare }) => (
		<FlareCard
			flare={item}
			onPress={() => navigation.navigate("FlareDetail", { flareId: item.id })}
		/>
	);

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.titleRow}>
					<Text style={styles.title}>Nearby</Text>
					<Button
						mode="contained"
						buttonColor="#D32F2F"
						textColor="#FFFFFF"
						compact
						labelStyle={styles.emergencyLabel}
						style={styles.emergencyButton}
						onPress={() => navigation.navigate("EmergencyUX", {})}
					>
						🚨 Emergency
					</Button>
				</View>
				<StatusRow
					isOnline={isOnline}
					locationOn={true}
					lastSync={syncTimeStr}
				/>
			</View>

			{/* Offline banner */}
			{!isOnline && (
				<OfflineBanner variant="offline" lastSyncTime={syncTimeStr} />
			)}

			{/* Feed — no filter pills, just the list */}
			<FlatList
				data={feedFlares}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				refreshControl={
					<RefreshControl refreshing={isLoading} onRefresh={refetch} />
				}
				ListEmptyComponent={!isLoading ? <EmptyState /> : null}
			/>

			{/* Report FAB */}
			<FAB
				icon="plus"
				label="Report"
				style={styles.fab}
				color="#FFFFFF"
				onPress={() => navigation.navigate("ReportStep1")}
				customSize={48}
			/>

			{/* Zone prompt */}
			<ZonePromptModal
				visible={zonePromptVisible}
				onViewGuidance={() => {
					setZonePromptVisible(false);
					if (zoneFlareId) {
						navigation.navigate("EmergencyUX", { flareId: zoneFlareId });
					}
				}}
				onDismiss={() => setZonePromptVisible(false)}
				onRemindLater={() => setZonePromptVisible(false)}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		paddingHorizontal: components.screenPaddingH,
		paddingVertical: spacing.md,
		gap: spacing.sm,
	},
	titleRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	emergencyButton: {
		borderRadius: components.cardRadius,
	},
	emergencyLabel: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	list: {
		paddingHorizontal: components.screenPaddingH,
		paddingBottom: 100,
	},
	fab: {
		position: "absolute",
		right: components.screenPaddingH,
		bottom: 16,
		backgroundColor: colors.burgundy,
		borderRadius: components.cardRadius,
	},
});
