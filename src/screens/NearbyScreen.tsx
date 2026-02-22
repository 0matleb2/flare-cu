import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
	FlatList,
	RefreshControl,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Button, FAB, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "../components/EmptyState";
import { FlareCard } from "../components/FlareCard";
import { OfflineBanner } from "../components/OfflineBanner";
import { useEmergency } from "../context/EmergencyContext";
import { useAppTheme } from "../context/ThemeContext";
import { useFlares } from "../hooks/useFlares";
import { useLowStim } from "../hooks/useLowStim";
import { usePreferences } from "../hooks/usePreferences";
import type { NearbyFeedNavProp } from "../navigation/types";
import { components, spacing, typography } from "../theme";
import type { CredibilityLevel, Flare } from "../types";

// ── Sort modes ──────────────────────────────────────────────
type SortMode = "priority" | "nearest" | "recent";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
	{ value: "priority", label: "Priority" },
	{ value: "nearest", label: "Nearest" },
	{ value: "recent", label: "Recent" },
];

const CREDIBILITY_PRIORITY: Record<CredibilityLevel, number> = {
	verified: 0,
	confirmed: 1,
	reported: 2,
	resolved: 3,
};

// Simulated proximity scores (lower = closer). In a real app this
// would be calculated from device GPS vs flare coordinates.
const PROXIMITY_SCORE: Record<string, number> = {
	"Hall Building": 1,
	"EV Building": 2,
	"LB Building": 3,
	"GM Building": 4,
	"MB Building": 5,
	"CL Building": 6,
	"FG Building": 7,
	"Guy Street": 2,
	"Webster Library": 3,
};

function sortFlares(flares: Flare[], mode: SortMode): Flare[] {
	// Partition: resolved always last
	const active = flares.filter((f) => f.credibility !== "resolved");
	const resolved = flares.filter((f) => f.credibility === "resolved");

	const sorted = [...active].sort((a, b) => {
		switch (mode) {
			case "priority": {
				const diff =
					CREDIBILITY_PRIORITY[a.credibility] -
					CREDIBILITY_PRIORITY[b.credibility];
				if (diff !== 0) return diff;
				if (b.upvotes !== a.upvotes) return b.upvotes - a.upvotes;
				return b.lastUpdated - a.lastUpdated;
			}
			case "nearest": {
				const aDist = PROXIMITY_SCORE[a.building] ?? 10;
				const bDist = PROXIMITY_SCORE[b.building] ?? 10;
				if (aDist !== bDist) return aDist - bDist;
				return b.lastUpdated - a.lastUpdated;
			}
			case "recent":
				return b.lastUpdated - a.lastUpdated;
			default:
				return 0;
		}
	});

	return [...sorted, ...resolved];
}

export const NearbyScreen = () => {
	const { data: flares = [], isLoading, refetch } = useFlares();
	const { data: prefs } = usePreferences();
	const navigation = useNavigation<NearbyFeedNavProp>();
	const insets = useSafeAreaInsets();
	const { activate } = useEmergency();
	const { colors } = useAppTheme();
	const lowStim = useLowStim();

	const isOnline = prefs?.offlineCaching !== false;
	const [sortMode, setSortMode] = useState<SortMode>("priority");

	// Filter: hide unconfirmed in low intensity
	const feedFlares = sortFlares(
		flares.filter((f) => {
			if (prefs?.alertIntensity === "low" && f.credibility === "reported")
				return false;
			return true;
		}),
		sortMode,
	);

	const syncTimeStr = new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});

	const renderItem = ({ item }: { item: Flare }) => (
		<FlareCard
			flare={item}
			onPress={() => navigation.navigate("FlareDetail", { flareId: item.id })}
			lowStim={lowStim}
		/>
	);

	return (
		<View
			style={[
				styles.container,
				{ paddingTop: insets.top, backgroundColor: colors.background },
			]}
		>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.titleRow}>
					<Text style={[styles.title, { color: colors.textPrimary }]}>
						SGW Campus
					</Text>
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

				{/* Sort chips + Online — one row */}
				<View style={styles.sortRow}>
					<View
						style={[
							styles.onlinePill,
							{
								backgroundColor: isOnline ? "#E8F5E9" : "#FFF3E0",
							},
						]}
					>
						<View
							style={[
								styles.onlineDot,
								{
									backgroundColor: isOnline
										? colors.statusSafe
										: colors.statusCaution,
								},
							]}
						/>
						<Text style={[styles.onlineText, { color: colors.textPrimary }]}>
							{isOnline ? "Online" : "Offline"}
						</Text>
					</View>

					{SORT_OPTIONS.map((opt) => {
						const isActive = sortMode === opt.value;
						return (
							<TouchableOpacity
								key={opt.value}
								style={[
									styles.sortChip,
									{
										borderColor: isActive ? colors.burgundy : colors.border,
										backgroundColor: isActive
											? `${colors.burgundy}0F`
											: colors.surface,
									},
								]}
								onPress={() => setSortMode(opt.value)}
								activeOpacity={0.7}
							>
								<Text
									style={[
										styles.sortChipText,
										{
											color: isActive ? colors.burgundy : colors.textSecondary,
										},
									]}
								>
									{opt.label}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>
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
				style={[styles.fab, { backgroundColor: colors.burgundy }]}
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
	},
	emergencyLabel: {
		fontSize: typography.caption.fontSize,
	},

	// Sort + Online row
	sortRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	onlinePill: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
		paddingVertical: 4,
		borderRadius: 12,
		gap: spacing.xs,
		marginRight: spacing.xs,
	},
	onlineDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
	},
	onlineText: {
		fontSize: typography.caption.fontSize,
		fontWeight: "600",
	},
	sortChip: {
		paddingHorizontal: spacing.md,
		paddingVertical: 4,
		borderRadius: 20,
		borderWidth: 1,
	},
	sortChipText: {
		fontSize: typography.caption.fontSize,
		fontWeight: "600",
	},

	list: {
		paddingHorizontal: components.screenPaddingH,
		paddingBottom: 100,
	},
	fab: {
		position: "absolute",
		right: components.screenPaddingH,
		bottom: 16,
		borderRadius: components.cardRadius,
	},
});
