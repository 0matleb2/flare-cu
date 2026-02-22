import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { CredibilityChip } from "../../components/CredibilityChip";
import { useEmergency } from "../../context/EmergencyContext";
import { useFlares } from "../../hooks/useFlares";
import { usePreferences } from "../../hooks/usePreferences";
import { colors, components, spacing, typography } from "../../theme";
import type { Flare, TimelineEntry } from "../../types";

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

	const isOnline = prefs?.offlineCaching !== false;

	const liveFlare: Flare | null = trigger?.flare
		? (flares.find((f) => f.id === trigger.flare?.id) ?? trigger.flare)
		: null;

	return (
		<View style={styles.container}>
			{!isOnline && (
				<View style={styles.offlineBanner}>
					<Text style={styles.offlineText}>
						Offline — showing cached data. Live updates unavailable.
					</Text>
				</View>
			)}

			{liveFlare ? (
				<View style={styles.flareCard}>
					<Text style={styles.cardTitle}>Triggering flare</Text>
					<View style={styles.statusRow}>
						<CredibilityChip level={liveFlare.credibility} />
						<Text style={styles.timestamp}>
							{timeAgo(liveFlare.lastUpdated)}
						</Text>
					</View>
					<Text style={styles.summary}>{liveFlare.summary}</Text>
					<Text style={styles.location}>{liveFlare.location}</Text>

					{liveFlare.timeline.length > 0 && (
						<View style={styles.timeline}>
							<Text style={styles.timelineTitle}>History</Text>
							{liveFlare.timeline.map((entry: TimelineEntry, i: number) => (
								<View key={`${entry.time}-${i}`} style={styles.timelineRow}>
									<Text style={styles.timelineTime}>{entry.time}</Text>
									<Text style={styles.timelineLabel}>{entry.label}</Text>
								</View>
							))}
						</View>
					)}
				</View>
			) : (
				<View style={styles.noFlareCard}>
					<Text style={styles.noFlareTitle}>No linked flare</Text>
					<Text style={styles.noFlareBody}>
						Emergency mode was activated manually. There are no specific flare
						updates to show. Follow the Steps tab for general safety guidance.
					</Text>
				</View>
			)}

			{isOnline && (
				<Button
					mode="outlined"
					onPress={() => refetch()}
					textColor={colors.burgundy}
					loading={isLoading}
					style={styles.refreshButton}
					labelStyle={styles.refreshLabel}
					contentStyle={styles.refreshContent}
				>
					Check for updates
				</Button>
			)}

			<View style={styles.nearbySection}>
				<Text style={styles.cardTitle}>Active flares nearby</Text>
				{flares
					.filter((f: Flare) => f.credibility !== "resolved")
					.slice(0, 3)
					.map((f: Flare) => (
						<View key={f.id} style={styles.miniCard}>
							<View style={styles.miniRow}>
								<CredibilityChip level={f.credibility} />
								<Text style={styles.timestamp}>{timeAgo(f.lastUpdated)}</Text>
							</View>
							<Text style={styles.miniSummary} numberOfLines={1}>
								{f.summary}
							</Text>
						</View>
					))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1, gap: spacing.md },
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
	flareCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
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
	location: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	timeline: { gap: spacing.xs, marginTop: spacing.xs },
	timelineTitle: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
		color: colors.textSecondary,
	},
	timelineRow: { flexDirection: "row", gap: spacing.md },
	timelineTime: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
		color: colors.textSecondary,
		width: 40,
	},
	timelineLabel: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
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
	refreshButton: {
		borderRadius: components.cardRadius,
		borderColor: colors.border,
	},
	refreshContent: { minHeight: components.touchTarget },
	refreshLabel: { fontSize: typography.body.fontSize },
	nearbySection: { gap: spacing.sm },
	miniCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.xs,
	},
	miniRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	miniSummary: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
});
