import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActionCard } from "../components/ActionCard";
import { EmptyState } from "../components/EmptyState";
import { FilterChips } from "../components/FilterChips";
import { FlareCard } from "../components/FlareCard";
import { OfflineBanner } from "../components/OfflineBanner";
import { StatusRow } from "../components/StatusRow";
import { useFlares } from "../hooks/useFlares";
import type { NearbyFeedNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { FeedFilter, Flare } from "../types";

export const NearbyScreen = () => {
	const { data: flares = [], isLoading, refetch } = useFlares();
	const navigation = useNavigation<NearbyFeedNavProp>();
	const insets = useSafeAreaInsets();

	const [filter, setFilter] = useState<FeedFilter>("near_me");
	const [isOnline] = useState(true); // simulated

	// Filter flares
	const filteredFlares = flares.filter((f) => {
		if (filter === "hide_resolved" && f.credibility === "resolved")
			return false;
		if (filter === "high_tension" && f.credibility === "reported") return true;
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
			{/* Show action card only when there are high-priority flares */}
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

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.title}>Nearby</Text>
				<StatusRow isOnline={isOnline} locationOn={true} lastSync="10:42" />
			</View>

			{/* Offline banner (when offline) */}
			{!isOnline && <OfflineBanner variant="offline" lastSyncTime="10:42" />}

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
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	listHeader: {
		marginBottom: spacing.xs,
	},
	list: {
		paddingHorizontal: components.screenPaddingH,
		paddingBottom: 80,
	},
});
