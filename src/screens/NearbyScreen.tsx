import { useNavigation } from "@react-navigation/native";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { Button, FAB, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "../components/EmptyState";
import { FlareCard } from "../components/FlareCard";
import { OfflineBanner } from "../components/OfflineBanner";
import { StatusRow } from "../components/StatusRow";
import { useEmergency } from "../context/EmergencyContext";
import { useFlares } from "../hooks/useFlares";
import { usePreferences } from "../hooks/usePreferences";
import type { NearbyFeedNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { CredibilityLevel, Flare } from "../types";

// Feed sorting: verified first, then confirmed, reported, resolved last
const CREDIBILITY_PRIORITY: Record<CredibilityLevel, number> = {
	verified: 0,
	confirmed: 1,
	reported: 2,
	resolved: 3,
};

export const NearbyScreen = () => {
	const { data: flares = [], isLoading, refetch } = useFlares();
	const { data: prefs } = usePreferences();
	const navigation = useNavigation<NearbyFeedNavProp>();
	const insets = useSafeAreaInsets();
	const { activate } = useEmergency();

	const isOnline = prefs?.offlineCaching !== false;

	// Filter: hide unconfirmed in low intensity
	const feedFlares = flares
		.filter((f) => {
			if (prefs?.alertIntensity === "low" && f.credibility === "reported")
				return false;
			return true;
		})
		// Sort by credibility priority, then by upvotes within same tier
		.sort((a, b) => {
			const diff =
				CREDIBILITY_PRIORITY[a.credibility] -
				CREDIBILITY_PRIORITY[b.credibility];
			if (diff !== 0) return diff;
			// Within same credibility, most upvoted first
			if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
			return b.lastUpdated - a.lastUpdated;
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
						mode="text"
						textColor="#D32F2F"
						compact
						icon="alert-circle-outline"
						labelStyle={styles.emergencyLabel}
						onPress={() => activate({ source: "manual" })}
					>
						Emergency
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

			{/* Feed */}
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
				icon="fire"
				label="Raise a flare"
				style={styles.fab}
				color="#FFFFFF"
				onPress={() => navigation.navigate("ReportStep1")}
				customSize={48}
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
	emergencyLabel: {
		fontSize: typography.caption.fontSize,
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
