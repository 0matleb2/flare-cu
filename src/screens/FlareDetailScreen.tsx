import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CredibilityChip } from "../components/CredibilityChip";
import { ProgressBar } from "../components/ProgressBar";
import { useEmergency } from "../context/EmergencyContext";
import { useFlares, useSaveFlare } from "../hooks/useFlares";
import type {
	FlareDetailNavProp,
	NearbyStackParamList,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import { CATEGORY_LABELS } from "../types";

type FlareDetailRoute = RouteProp<NearbyStackParamList, "FlareDetail">;

function timeAgo(ms: number): string {
	const diff = Date.now() - ms;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins} min ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}

export const FlareDetailScreen = () => {
	const route = useRoute<FlareDetailRoute>();
	const navigation = useNavigation<FlareDetailNavProp>();
	const insets = useSafeAreaInsets();
	const { data: flares = [] } = useFlares();
	const saveFlare = useSaveFlare();
	const { activate: activateEmergency } = useEmergency();

	const flare = flares.find((f) => f.id === route.params.flareId);

	if (!flare) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
				<Text style={styles.notFoundTitle}>Flare not found</Text>
				<Button onPress={() => navigation.goBack()} textColor={colors.burgundy}>
					Go back
				</Button>
			</View>
		);
	}

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Back header */}
			<View style={styles.header}>
				<Button
					icon="arrow-left"
					onPress={() => navigation.goBack()}
					textColor={colors.textPrimary}
					compact
				>
					Back
				</Button>
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				{/* ═══ Hero card — the flare identity ═══ */}
				<View style={styles.heroCard}>
					<Text style={styles.heroCategory}>
						{CATEGORY_LABELS[flare.category]}
					</Text>
					<Text style={styles.heroSummary}>{flare.summary}</Text>
					<View style={styles.heroMeta}>
						<Text style={styles.heroLocation}>{flare.location}</Text>
						<Text style={styles.heroDot}>·</Text>
						<Text style={styles.heroTime}>{timeAgo(flare.lastUpdated)}</Text>
					</View>
				</View>

				{/* ═══ Status — credibility progression ═══ */}
				<View style={styles.statusCard}>
					<View style={styles.statusHeader}>
						<Text style={styles.sectionTitle}>Status</Text>
						<CredibilityChip level={flare.credibility} />
					</View>
					<ProgressBar currentLevel={flare.credibility} showLabels />
				</View>

				{/* ═══ Primary actions ═══ */}
				<View style={styles.actionsSection}>
					{/* Start plan — big and prominent */}
					<Button
						mode="contained"
						buttonColor={colors.burgundy}
						textColor="#FFFFFF"
						icon="play-circle-outline"
						style={styles.primaryAction}
						labelStyle={styles.primaryLabel}
						contentStyle={styles.primaryContent}
						onPress={() =>
							navigation.navigate("ActionPlan", { planId: flare.id })
						}
					>
						Start action plan
					</Button>

					{/* Emergency mode */}
					<Button
						mode="contained"
						buttonColor="#D32F2F"
						textColor="#FFFFFF"
						icon="alert-circle"
						style={styles.emergencyAction}
						labelStyle={styles.secondaryLabel}
						contentStyle={styles.secondaryContent}
						onPress={() =>
							activateEmergency({
								source: "flare",
								flare,
								category: flare.category,
								location: flare.location,
								building: flare.building,
							})
						}
					>
						Enter emergency mode
					</Button>

					{/* Save flare */}
					<Button
						mode="outlined"
						textColor={colors.burgundy}
						icon={flare.savedByUser ? "bookmark" : "bookmark-outline"}
						style={styles.outlineAction}
						labelStyle={styles.secondaryLabel}
						contentStyle={styles.secondaryContent}
						onPress={() => saveFlare.mutate(flare.id)}
						disabled={saveFlare.isPending}
					>
						{flare.savedByUser ? "Saved" : "Save flare"}
					</Button>
				</View>

				{/* ═══ Timeline — at the bottom ═══ */}
				{flare.timeline.length > 0 && (
					<View style={styles.timelineCard}>
						<Text style={styles.sectionTitle}>Timeline</Text>
						{flare.timeline.map((entry, i) => (
							<View key={`${entry.time}-${i}`} style={styles.timelineRow}>
								<View style={styles.timelineDot} />
								<Text style={styles.timelineTime}>{entry.time}</Text>
								<Text style={styles.timelineLabel}>{entry.label}</Text>
							</View>
						))}
					</View>
				)}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
	},
	header: {
		flexDirection: "row",
		paddingHorizontal: spacing.xs,
		paddingVertical: spacing.xs,
	},
	content: {
		paddingHorizontal: components.screenPaddingH,
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	notFoundTitle: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
		padding: components.screenPaddingH,
	},

	// Hero card
	heroCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		borderColor: colors.burgundy,
		padding: spacing.lg,
		gap: spacing.sm,
	},
	heroCategory: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.burgundy,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	heroSummary: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.textPrimary,
		lineHeight: 26,
	},
	heroMeta: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.xs,
	},
	heroLocation: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	heroDot: {
		fontSize: typography.body.fontSize,
		color: colors.textDisabled,
	},
	heroTime: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},

	// Status card
	statusCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	statusHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	sectionTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},

	// Actions
	actionsSection: {
		gap: spacing.sm,
	},
	primaryAction: {
		borderRadius: components.cardRadius,
	},
	primaryContent: {
		minHeight: 56,
	},
	primaryLabel: {
		fontSize: 17,
		fontWeight: "700",
	},
	emergencyAction: {
		borderRadius: components.cardRadius,
	},
	outlineAction: {
		borderRadius: components.cardRadius,
		borderColor: colors.burgundy,
	},
	secondaryContent: {
		minHeight: components.touchTarget,
	},
	secondaryLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},

	// Timeline
	timelineCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	timelineRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		paddingVertical: spacing.xs,
	},
	timelineDot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: colors.burgundy,
	},
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
});
