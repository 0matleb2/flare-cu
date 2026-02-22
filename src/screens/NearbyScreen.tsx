import { useNavigation } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Badge, FAB, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionCard } from "../components/ActionCard";
import { EmptyState } from "../components/EmptyState";
import { FilterChips } from "../components/FilterChips";
import { FlareCard } from "../components/FlareCard";
import { OfflineBanner } from "../components/OfflineBanner";
import { StatusRow } from "../components/StatusRow";
import { ZonePromptModal } from "../components/ZonePromptModal";
import { useFlares } from "../hooks/useFlares";
import type { NearbyFeedNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { FeedFilter, Flare } from "../types";

export const NearbyScreen = () => {
	const { data: flares = [], isLoading, refetch } = useFlares();
	const navigation = useNavigation<NearbyFeedNavProp>();
	const insets = useSafeAreaInsets();

	const [filter, setFilter] = useState<FeedFilter>("near_me");
	const [isOnline, setIsOnline] = useState(true);
	const [zonePromptVisible, setZonePromptVisible] = useState(false);
	const [zoneFlareId, setZoneFlareId] = useState<string | null>(null);

	// Simulated offline queue count
	const [queuedCount] = useState(0);

	// Simulate zone detection: show prompt when a "reported" flare exists
	const _simulateZoneDetection = useCallback(() => {
		const reportedFlare = flares.find((f) => f.credibility === "reported");
		if (reportedFlare) {
			setZoneFlareId(reportedFlare.id);
			setZonePromptVisible(true);
		}
	}, [flares]);

	// Filter flares
	const filteredFlares = flares.filter((f) => {
		if (filter === "hide_resolved" && f.credibility === "resolved")
			return false;
		if (filter === "high_tension") return f.credibility === "reported";
		return true;
	});

	const renderItem = ({ item }: { item: Flare }) => (
		<FlareCard
			flare={item}
			onViewGuidance={() =>
				navigation.navigate("FlareDetail", { flareId: item.id })
			}
			onDetails={() => navigation.navigate("FlareDetail", { flareId: item.id })}
		/>
	);

	const ListHeader = () => (
		<View style={styles.listHeader}>
			{flares.some((f) => f.credibility === "reported") && (
				<ActionCard
					onPress={() => {
						const first = flares.find((f) => f.credibility === "reported");
						if (first)
							navigation.navigate("FlareDetail", { flareId: first.id });
					}}
				/>
			)}
		</View>
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
					{/* Offline toggle for demo */}
					<Text
						style={styles.offlineToggle}
						onPress={() => setIsOnline((prev) => !prev)}
					>
						{isOnline ? "Simulate offline" : "Go online"}
					</Text>
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
				ListHeaderComponent={ListHeader}
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

			{/* Queued count badge (when offline with queued reports) */}
			{!isOnline && queuedCount > 0 && (
				<Badge style={styles.badge}>{`${queuedCount} queued`}</Badge>
			)}

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
	offlineToggle: {
		fontSize: typography.caption.fontSize,
		color: colors.burgundy,
		fontWeight: typography.chip.fontWeight,
	},
	listHeader: {
		marginBottom: spacing.xs,
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
	badge: {
		position: "absolute",
		right: components.screenPaddingH,
		bottom: 72,
		backgroundColor: colors.statusCaution,
	},
});
