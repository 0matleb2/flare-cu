import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
	FlatList,
	RefreshControl,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Button, FAB, Snackbar, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "../components/EmptyState";
import { FlareCard } from "../components/FlareCard";
import { OfflineBanner } from "../components/OfflineBanner";
import { useEmergency } from "../context/EmergencyContext";
import { useDeleteFlare, useFlares } from "../hooks/useFlares";
import { useLowStim } from "../hooks/useLowStim";
import { usePreferences } from "../hooks/usePreferences";
import type {
	NearbyFeedNavProp,
	NearbyStackParamList,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
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

type NearbyFeedRoute = RouteProp<NearbyStackParamList, "NearbyFeed">;

const SNACKBAR_DURATION_MS = 4000;

export const NearbyScreen = () => {
	const { data: flares = [], isLoading, refetch } = useFlares();
	const { data: prefs } = usePreferences();
	const navigation = useNavigation<NearbyFeedNavProp>();
	const route = useRoute<NearbyFeedRoute>();
	const insets = useSafeAreaInsets();
	const { activate } = useEmergency();
	const lowStim = useLowStim();
	const deleteFlare = useDeleteFlare();

	const isOnline = prefs?.offlineCaching !== false;
	const syncTimeStr = new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	const [sortMode, setSortMode] = useState<SortMode>("priority");

	// ── Snackbar undo state ─────────────────────────────────
	const [snackVisible, setSnackVisible] = useState(false);
	const [undoFlareId, setUndoFlareId] = useState<string | null>(null);
	const processedParamRef = useRef<string | null>(null);

	// React to justCreatedFlareId navigation param
	useEffect(() => {
		const createdId = route.params?.justCreatedFlareId;
		if (createdId && createdId !== processedParamRef.current) {
			processedParamRef.current = createdId;
			setUndoFlareId(createdId);
			setSnackVisible(true);
			// Clear the param so it doesn't re-trigger on re-focus
			navigation.setParams({ justCreatedFlareId: undefined });
		}
	}, [route.params?.justCreatedFlareId, navigation]);

	const handleUndo = () => {
		if (undoFlareId) {
			deleteFlare.mutate(undoFlareId);
		}
		setSnackVisible(false);
		setUndoFlareId(null);
	};

	const handleSnackDismiss = () => {
		setSnackVisible(false);
		setUndoFlareId(null);
	};

	// Filter: hide unconfirmed in low intensity
	const feedFlares = sortFlares(
		flares.filter((f) => {
			if (prefs?.alertIntensity === "low" && f.credibility === "reported")
				return false;
			return true;
		}),
		sortMode,
	);

	const renderItem = ({ item }: { item: Flare }) => (
		<FlareCard
			flare={item}
			onPress={() => navigation.navigate("FlareDetail", { flareId: item.id })}
			lowStim={lowStim}
		/>
	);

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.titleRow}>
					<View style={styles.titleLeft}>
						<Text style={styles.title}>SGW Campus</Text>
						<View style={styles.statusBadge}>
							<View
								style={[
									styles.statusDot,
									{
										backgroundColor: isOnline
											? colors.statusSafe
											: colors.statusCaution,
									},
								]}
							/>
							<Text
								style={[
									styles.statusText,
									{
										color: isOnline
											? colors.statusSafe
											: colors.statusCaution,
									},
								]}
							>
								{isOnline ? "Online" : "Offline"}
							</Text>
						</View>
					</View>
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

				{/* Sort chips */}
				<View style={styles.sortRow}>
					{SORT_OPTIONS.map((opt) => {
						const isActive = sortMode === opt.value;
						return (
							<TouchableOpacity
								key={opt.value}
								style={[styles.sortChip, isActive && styles.sortChipActive]}
								onPress={() => setSortMode(opt.value)}
								activeOpacity={0.7}
							>
								<Text
									style={[
										styles.sortChipText,
										isActive && styles.sortChipTextActive,
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

			{/* ── Snackbar: flare created confirmation with Undo ── */}
			<Snackbar
				visible={snackVisible}
				onDismiss={handleSnackDismiss}
				duration={SNACKBAR_DURATION_MS}
				action={{ label: "Undo", onPress: handleUndo }}
				style={styles.snackbar}
			>
				Flare raised
			</Snackbar>
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
	titleLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	emergencyLabel: {
		fontSize: typography.caption.fontSize,
	},

	// Status badge (inline with title)
	statusBadge: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},
	statusDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	statusText: {
		fontSize: typography.caption.fontSize,
		fontWeight: "600",
	},

	// Sort row
	sortRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	sortChip: {
		paddingHorizontal: spacing.md,
		paddingVertical: 4,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: colors.border,
		backgroundColor: colors.surface,
	},
	sortChipActive: {
		borderColor: colors.burgundy,
		backgroundColor: `${colors.burgundy}0F`,
	},
	sortChipText: {
		fontSize: typography.caption.fontSize,
		fontWeight: "600",
		color: colors.textSecondary,
	},
	sortChipTextActive: {
		color: colors.burgundy,
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

	// Snackbar
	snackbar: {
		backgroundColor: colors.textPrimary,
		marginBottom: 72, // Clear the FAB
	},
});
