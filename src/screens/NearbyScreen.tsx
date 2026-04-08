import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { useAccentColors } from "../hooks/useAccentColors";
import { useCampusLocation } from "../hooks/useCampusLocation";
import {
	useDeleteFlare,
	useFlares,
	useOfflineSyncStatus,
} from "../hooks/useFlares";
import { useLowStim } from "../hooks/useLowStim";
import { useNetworkState } from "../hooks/useNetworkState";
import { usePreferences } from "../hooks/usePreferences";
import type {
	NearbyFeedNavProp,
	NearbyStackParamList,
} from "../navigation/types";
import { resolveBuildingId } from "../routing/routeHelpers";
import { DEFAULT_CAMPUS_BUILDING } from "../services/CampusLocationService";
import { colors, components, spacing, typography, withAlpha } from "../theme";
import type { CredibilityLevel, Flare } from "../types";
import { getFlareGraphDistance } from "../utils/flareDistance";
import { formatLastSyncLabel } from "../utils/syncLabels";

const TOUCH_TARGET_EXPANSION = {
	top: 8,
	right: 8,
	bottom: 8,
	left: 8,
} as const;

// ── Sort modes ──────────────────────────────────────────────
type SortMode = "priority" | "nearest" | "recent";

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
	{ value: "priority", label: "Priority" },
	{ value: "nearest", label: "Nearby" },
	{ value: "recent", label: "Recent" },
];

const CREDIBILITY_PRIORITY: Record<CredibilityLevel, number> = {
	verified: 0,
	confirmed: 1,
	reported: 2,
	resolved: 3,
};

function sortFlares(
	flares: Flare[],
	mode: SortMode,
	distanceByFlareId: Record<string, number>,
): Flare[] {
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
				const aDist = distanceByFlareId[a.id] ?? Number.POSITIVE_INFINITY;
				const bDist = distanceByFlareId[b.id] ?? Number.POSITIVE_INFINITY;
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
	const { data: flares = [], isLoading, isError, error, refetch } = useFlares();
	const { data: prefs } = usePreferences();
	const navigation = useNavigation<NearbyFeedNavProp>();
	const route = useRoute<NearbyFeedRoute>();
	const insets = useSafeAreaInsets();
	const { activate } = useEmergency();
	const accent = useAccentColors();
	const { location } = useCampusLocation();
	const lowStim = useLowStim();
	const deleteFlare = useDeleteFlare();
	const { data: syncStatus } = useOfflineSyncStatus();
	const { isConnected } = useNetworkState();

	const isOnline = isConnected && prefs?.offlineCaching !== false;
	const lastSyncTime = syncStatus?.lastSync
		? formatLastSyncLabel(syncStatus.lastSync)
		: undefined;
	const queueCount = syncStatus?.queueCount ?? 0;
	const [submissionMode, setSubmissionMode] = useState<"live" | "queued">(
		"live",
	);
	const [sortMode, setSortMode] = useState<SortMode>("priority");

	// ── Snackbar undo state ─────────────────────────────────
	const [snackVisible, setSnackVisible] = useState(false);
	const [undoFlareId, setUndoFlareId] = useState<string | null>(null);
	const processedParamRef = useRef<string | null>(null);
	const currentCampusOrigin =
		location?.building.name ?? DEFAULT_CAMPUS_BUILDING.name;
	const currentCampusOriginId = resolveBuildingId(currentCampusOrigin);

	// React to justCreatedFlareId navigation param
	useEffect(() => {
		const createdId = route.params?.justCreatedFlareId;
		if (createdId && createdId !== processedParamRef.current) {
			processedParamRef.current = createdId;
			setUndoFlareId(createdId);
			setSubmissionMode(route.params?.submissionMode ?? "live");
			setSnackVisible(true);
			navigation.setParams({
				justCreatedFlareId: undefined,
				submissionMode: undefined,
			});
		}
	}, [
		route.params?.justCreatedFlareId,
		route.params?.submissionMode,
		navigation,
	]);

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

	const visibleFlares = useMemo(
		() =>
			flares.filter((f) => {
				if (
					prefs?.alertIntensity === "low" &&
					(f.credibility === "reported" || f.credibility === "resolved")
				) {
					return false;
				}
				return true;
			}),
		[flares, prefs?.alertIntensity],
	);
	const distanceByFlareId = useMemo(
		() =>
			Object.fromEntries(
				visibleFlares.map((flare) => [
					flare.id,
					getFlareGraphDistance(currentCampusOriginId, flare),
				]),
			),
		[visibleFlares, currentCampusOriginId],
	);
	const feedFlares = useMemo(
		() => sortFlares(visibleFlares, sortMode, distanceByFlareId),
		[visibleFlares, sortMode, distanceByFlareId],
	);
	const hiddenByLowIntensity =
		prefs?.alertIntensity === "low" &&
		feedFlares.length === 0 &&
		flares.some(
			(f) => f.credibility === "reported" || f.credibility === "resolved",
		);
	const loadError =
		error instanceof Error
			? error.message
			: "We couldn't load campus reports right now.";

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
										color: isOnline ? colors.statusSafe : colors.statusCaution,
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
						onPress={() =>
							activate({
								source: "manual",
								building: currentCampusOrigin,
								location: currentCampusOrigin,
							})
						}
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
								style={[
									styles.sortChip,
									isActive && {
										borderColor: accent.primaryOutline,
										backgroundColor: withAlpha(accent.primary, "0F"),
									},
								]}
								onPress={() => setSortMode(opt.value)}
								activeOpacity={0.7}
								hitSlop={TOUCH_TARGET_EXPANSION}
								accessibilityRole="button"
								accessibilityLabel={`Sort by ${opt.label}`}
								accessibilityHint={`Shows campus reports sorted by ${opt.label.toLowerCase()}.`}
								accessibilityState={{ selected: isActive }}
							>
								<Text
									style={[
										styles.sortChipText,
										isActive && { color: accent.primary },
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
				<OfflineBanner
					variant="offline"
					lastSyncTime={lastSyncTime}
					queueCount={queueCount}
				/>
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
				ListEmptyComponent={
					!isLoading ? (
						isError ? (
							<EmptyState
								title="Couldn't load campus reports"
								message={loadError}
								hint="Pull to refresh or try again once your connection is stable."
								actionLabel="Try again"
								onAction={() => {
									void refetch();
								}}
							/>
						) : (
							<EmptyState
								title="No active campus reports"
								message={
									hiddenByLowIntensity
										? "Low alert intensity is hiding reported-only flares."
										: "There are no active flare reports for SGW right now."
								}
								hint={
									hiddenByLowIntensity
										? "Switch Alert intensity to High in Settings if you want to review unconfirmed reports too."
										: "Pull down to refresh or raise a flare if you see something the community should know about."
								}
							/>
						)
					) : null
				}
			/>

			{/* Report FAB */}
			<FAB
				icon="fire"
				label="Raise a flare"
				style={[styles.fab, { backgroundColor: accent.primary }]}
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
				theme={{
					colors: {
						inverseSurface: colors.surface,
						inverseOnSurface: colors.textPrimary,
						inversePrimary: accent.primary,
					},
				}}
				style={styles.snackbar}
			>
				{submissionMode === "queued"
					? lowStim
						? "Flare saved offline"
						: "Flare saved offline and queued for sync"
					: lowStim
						? "Flare raised"
						: "Flare raised on the campus feed"}
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
	sortChipText: {
		fontSize: typography.caption.fontSize,
		fontWeight: "600",
		color: colors.textSecondary,
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

	// Snackbar
	snackbar: {
		backgroundColor: colors.surface,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		marginBottom: 72, // Clear the FAB
	},
});
