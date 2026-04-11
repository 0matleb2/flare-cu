import { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { CredibilityChip } from "../../components/CredibilityChip";
import { useEmergency } from "../../context/EmergencyContext";
import { getLocationDetails } from "../../data/locations";
import { useAccentColors } from "../../hooks/useAccentColors";
import { useFlares } from "../../hooks/useFlares";
import { useLowStim } from "../../hooks/useLowStim";
import { useNetworkState } from "../../hooks/useNetworkState";
import { usePreferences } from "../../hooks/usePreferences";
import { resolveBuildingId } from "../../routing/routeHelpers";
import {
	colors,
	components,
	spacing,
	typography,
	withAlpha,
} from "../../theme";
import type { Flare, TimelineEntry } from "../../types";
import { CATEGORY_LABELS } from "../../types";

const TOUCH_TARGET_EXPANSION = {
	top: 8,
	right: 8,
	bottom: 8,
	left: 8,
} as const;

function timeAgo(ms: number): string {
	const diff = Date.now() - ms;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins} min ago`;
	return `${Math.floor(mins / 60)}h ago`;
}

export const EmergencyUpdatesTab = () => {
	const { trigger } = useEmergency();
	const { data: flares = [], refetch, isLoading } = useFlares();
	const { data: prefs } = usePreferences();
	const lowStim = useLowStim();
	const accent = useAccentColors();
	const [lastChecked, setLastChecked] = useState<string | null>(null);
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [nearbyExpanded, setNearbyExpanded] = useState(false);
	const { isConnected } = useNetworkState();

	const isOnline = isConnected && prefs?.offlineCaching !== false;

	const liveFlare: Flare | null = trigger?.flare
		? (flares.find((f) => f.id === trigger.flare?.id) ?? trigger.flare)
		: null;

	const getScopedCodeForFlare = useCallback((flare: Flare) => {
		const locationBuildingCode = flare.locationId
			? getLocationDetails(flare.locationId).buildingCode
			: undefined;
		return locationBuildingCode ?? resolveBuildingId(flare.building);
	}, []);

	const scopedBuildingCode = trigger?.building
		? resolveBuildingId(trigger.building)
		: liveFlare
			? getScopedCodeForFlare(liveFlare)
			: undefined;

	const otherLocalFlares = useMemo(
		() =>
			flares.filter((flare) => {
				if (flare.credibility === "resolved" || flare.id === liveFlare?.id) {
					return false;
				}

				const flareBuildingCode = getScopedCodeForFlare(flare);

				return (
					scopedBuildingCode !== undefined &&
					flareBuildingCode === scopedBuildingCode
				);
			}),
		[flares, liveFlare?.id, scopedBuildingCode, getScopedCodeForFlare],
	);

	const handleCheckUpdates = async () => {
		await refetch();
		const now = new Date().toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});
		setLastChecked(now);
	};

	const toggleExpand = (id: string) => {
		setExpandedId((prev) => (prev === id ? null : id));
	};

	const renderFlareDetail = (flare: Flare) => (
		<View style={styles.expandedContent}>
			<View style={styles.expandedMeta}>
				<Text style={[styles.expandedCategory, { color: accent.primary }]}>
					{CATEGORY_LABELS[flare.category]}
				</Text>
				<Text style={styles.expandedLocation}>{flare.location}</Text>
			</View>

			{flare.timeline.length > 0 && (
				<View style={styles.expandedTimeline}>
					{flare.timeline.map((entry: TimelineEntry, i: number) => (
						<View key={`${entry.time}-${i}`} style={styles.timelineRow}>
							<View
								style={[
									styles.timelineDot,
									{ backgroundColor: accent.primary },
								]}
							/>
							<Text style={styles.timelineTime}>{entry.time}</Text>
							<Text style={styles.timelineLabel}>{entry.label}</Text>
						</View>
					))}
				</View>
			)}

			<Text
				style={[
					styles.expandedAdvice,
					{
						color: accent.primary,
						backgroundColor: withAlpha(accent.primary, "08"),
					},
					lowStim && styles.expandedAdviceLowStim,
				]}
			>
				{flare.category === "blocked_entrance"
					? "Use an alternate entrance. Check the Safe Route tab for the nearest accessible entry."
					: flare.category === "dense_crowd"
						? "Avoid this area if possible. The crowd may affect your route."
						: flare.category === "construction"
							? "A detour may be required. Check the Safe Route tab for alternatives."
							: "Stay aware and follow campus safety guidance."}
			</Text>
		</View>
	);

	return (
		<ScrollView
			style={styles.scrollView}
			contentContainerStyle={styles.container}
		>
			{!isOnline && (
				<View style={styles.offlineBanner}>
					<Text style={styles.offlineText}>
						Offline — showing cached data. Live updates unavailable.
					</Text>
				</View>
			)}

			{/* Triggering flare */}
			{liveFlare ? (
				<TouchableOpacity
					style={styles.triggerCard}
					activeOpacity={0.7}
					onPress={() => toggleExpand(liveFlare.id)}
					hitSlop={TOUCH_TARGET_EXPANSION}
					accessibilityRole="button"
					accessibilityLabel={`Triggering flare, ${CATEGORY_LABELS[liveFlare.category]}`}
					accessibilityHint="Opens flare details and timeline."
					accessibilityState={{ expanded: expandedId === liveFlare.id }}
				>
					<Text style={styles.cardTitle}>Current context</Text>
					<View style={styles.statusRow}>
						<CredibilityChip level={liveFlare.credibility} lowStim={lowStim} />
						{!lowStim && (
							<Text style={styles.timestamp}>
								{timeAgo(liveFlare.lastUpdated)}
							</Text>
						)}
					</View>
					<Text style={styles.summary}>{liveFlare.summary}</Text>
					{expandedId === liveFlare.id && renderFlareDetail(liveFlare)}
					{!lowStim && (
						<Text style={styles.tapHint}>
							{expandedId === liveFlare.id
								? "Tap to collapse"
								: "Tap for details"}
						</Text>
					)}
				</TouchableOpacity>
			) : (
				<View style={styles.noFlareCard}>
					<Text style={styles.noFlareTitle}>No linked flare</Text>
					<Text style={styles.noFlareBody}>
						Emergency mode was activated manually. Follow the Steps tab for
						general safety guidance.
					</Text>
				</View>
			)}

			{/* Check for updates */}
			{isOnline && (
				<View style={styles.refreshSection}>
					<Button
						mode="outlined"
						onPress={handleCheckUpdates}
						textColor={accent.primary}
						icon="refresh"
						loading={isLoading}
						style={[
							styles.refreshButton,
							{ borderColor: accent.primaryOutline },
						]}
						labelStyle={styles.refreshLabel}
						contentStyle={styles.refreshContent}
					>
						Check for updates
					</Button>
					{lastChecked && !lowStim && (
						<Text style={styles.lastChecked}>
							Last checked at {lastChecked}
						</Text>
					)}
				</View>
			)}

			{/* Other active flares in the same location — collapsed by default */}
			<View style={styles.nearbySection}>
				<TouchableOpacity
					style={styles.nearbySectionHeader}
					onPress={() => setNearbyExpanded((p) => !p)}
					activeOpacity={0.7}
					hitSlop={TOUCH_TARGET_EXPANSION}
					accessibilityRole="button"
					accessibilityLabel="Other flares near you"
					accessibilityHint="Expands or collapses nearby flare details."
					accessibilityState={{ expanded: nearbyExpanded }}
				>
					<Text style={styles.cardTitle}>Other flares near you</Text>
					<View style={styles.nearbyHeaderRight}>
						<Text style={styles.nearbyCount}>{otherLocalFlares.length}</Text>
						<Text style={styles.nearbyArrow}>{nearbyExpanded ? "▾" : "▸"}</Text>
					</View>
				</TouchableOpacity>

				{nearbyExpanded &&
					(otherLocalFlares.length > 0 ? (
						otherLocalFlares.slice(0, 4).map((f: Flare) => {
							const isExpanded = expandedId === f.id;
							return (
								<TouchableOpacity
									key={f.id}
									style={[
										styles.miniCard,
										isExpanded && {
											borderColor: accent.primaryOutline,
											borderWidth: 2,
										},
									]}
									activeOpacity={0.7}
									onPress={() => toggleExpand(f.id)}
									hitSlop={TOUCH_TARGET_EXPANSION}
									accessibilityRole="button"
									accessibilityLabel={`${CATEGORY_LABELS[f.category]} at ${f.location}`}
									accessibilityHint="Opens flare details and timeline."
									accessibilityState={{ expanded: isExpanded }}
								>
									<View style={styles.miniRow}>
										<CredibilityChip level={f.credibility} lowStim={lowStim} />
										{!lowStim && (
											<Text style={styles.timestamp}>
												{timeAgo(f.lastUpdated)}
											</Text>
										)}
									</View>
									<Text
										style={styles.miniSummary}
										numberOfLines={isExpanded ? undefined : 1}
									>
										{f.summary}
									</Text>
									{isExpanded && renderFlareDetail(f)}
								</TouchableOpacity>
							);
						})
					) : (
						<View style={styles.noLocalFlaresCard}>
							<Text style={styles.noLocalFlaresText}>
								No other active flares are linked to this location right now.
							</Text>
						</View>
					))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	scrollView: { flex: 1 },
	container: { gap: spacing.md, paddingBottom: spacing.lg },

	offlineBanner: {
		backgroundColor: "#FFF3E0",
		borderRadius: components.cardRadius,
		padding: spacing.sm,
	},
	offlineText: {
		fontSize: typography.caption.fontSize,
		color: colors.statusCaution,
		textAlign: "center",
	},

	// Triggering flare
	triggerCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		borderColor: colors.burgundy,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	cardTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	statusRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	timestamp: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	summary: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
	tapHint: {
		fontSize: 11,
		color: colors.textDisabled,
		textAlign: "center",
		marginTop: spacing.xs,
	},

	// Expanded detail
	expandedContent: {
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingTop: spacing.md,
		marginTop: spacing.sm,
		gap: spacing.md,
	},
	expandedMeta: {
		gap: spacing.xs,
	},
	expandedCategory: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.burgundy,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	expandedLocation: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	expandedSummary: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
		lineHeight: 20,
	},
	expandedTimeline: {
		gap: spacing.sm,
		paddingTop: spacing.xs,
	},
	timelineRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: spacing.sm,
		paddingVertical: 2,
	},
	timelineDot: {
		width: 6,
		height: 6,
		borderRadius: 3,
		backgroundColor: colors.burgundy,
		marginTop: 5,
	},
	timelineTime: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
		color: colors.textSecondary,
		lineHeight: 18,
		width: 56,
	},
	timelineLabel: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
		flex: 1,
		lineHeight: 20,
	},
	expandedAdvice: {
		fontSize: typography.caption.fontSize,
		color: colors.burgundy,
		fontStyle: "italic",
		lineHeight: 18,
		backgroundColor: `${colors.burgundy}08`,
		padding: spacing.sm,
		borderRadius: 8,
		marginTop: spacing.xs,
	},
	expandedAdviceLowStim: {
		fontStyle: "normal",
		backgroundColor: "transparent",
		paddingHorizontal: 0,
	},

	// No flare
	noFlareCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	noFlareTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	noFlareBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},

	// Refresh
	refreshSection: {
		gap: spacing.xs,
		alignItems: "center",
	},
	refreshButton: {
		borderRadius: components.cardRadius,
		alignSelf: "stretch",
	},
	refreshContent: { minHeight: components.touchTarget },
	refreshLabel: { fontSize: typography.body.fontSize },
	lastChecked: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
	},

	// Nearby
	nearbySection: { gap: spacing.sm },
	nearbySectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
	},
	nearbyHeaderRight: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	nearbyCount: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	nearbyArrow: {
		fontSize: 16,
		color: colors.textDisabled,
	},
	miniCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.xs,
	},
	miniCardExpanded: {
		borderColor: colors.burgundy,
		borderWidth: 2,
	},
	miniRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	miniSummary: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
	noLocalFlaresCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
	},
	noLocalFlaresText: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
});
