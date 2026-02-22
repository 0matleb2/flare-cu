import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { FAB, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "../components/EmptyState";
import { FilterChips } from "../components/FilterChips";
import { FlareCard } from "../components/FlareCard";
import { OfflineBanner } from "../components/OfflineBanner";
import { StatusRow } from "../components/StatusRow";
import { ZonePromptModal } from "../components/ZonePromptModal";
import { useFlares } from "../hooks/useFlares";
import { usePreferences } from "../hooks/usePreferences";
import type { NearbyFeedNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { FeedFilter, Flare } from "../types";

export const NearbyScreen = () => {
	const { data: flares = [], isLoading, refetch } = useFlares();
	const { data: prefs } = usePreferences();
	const navigation = useNavigation<NearbyFeedNavProp>();
	const insets = useSafeAreaInsets();

	const [filter, setFilter] = useState<FeedFilter>("near_me");
	const [zonePromptVisible, setZonePromptVisible] = useState(false);
	const [zoneFlareId, _setZoneFlareId] = useState<string | null>(null);

	// Use offline state from prefs (toggled in Settings)
	const isOnline = prefs?.offlineCaching !== false;

	// Filter flares based on active filter + preferences
	const filteredFlares = flares.filter((f) => {
		if (filter === "hide_resolved" && f.credibility === "resolved")
			return false;
		if (filter === "high_tension") return f.credibility === "reported";
		// If alert intensity is "low", hide reported-only (unconfirmed) flares
		if (prefs?.alertIntensity === "low" && f.credibility === "reported")
			return false;
		return true;
	});

	const renderItem = ({ item }: { item: Flare }) => (
		<FlareCard
			flare={item}
			onPress={() => navigation.navigate("FlareDetail", { flareId: item.id })}
		/>
	);

	const syncTimeStr = new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.titleRow}>
					<Text style={styles.title}>Nearby</Text>
					<IconButton
						icon="help-circle-outline"
						iconColor={colors.textSecondary}
						size={24}
						onPress={() => navigation.navigate("Help")}
						accessibilityLabel="Help"
					/>
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

			{/* Filter chips */}
			<FilterChips active={filter} onSelect={setFilter} />

			{/* Feed */}
			<FlatList
				data={filteredFlares}
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

			{/* Zone of Interest prompt */}
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
		paddingVertical: spacing.sm,
		gap: spacing.xs,
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
