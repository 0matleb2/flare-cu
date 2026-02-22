import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CredibilityChip } from "../components/CredibilityChip";
import { useEmergency } from "../context/EmergencyContext";
import { useFlares, useSaveFlare, useUpvoteFlare } from "../hooks/useFlares";
import type {
	FlareDetailNavProp,
	NearbyStackParamList,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { CredibilityLevel } from "../types";
import { CATEGORY_LABELS, CREDIBILITY_STEPS } from "../types";

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
	const upvoteFlare = useUpvoteFlare();
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
			{/* Header: back + bookmark */}
			<View style={styles.header}>
				<Button
					icon="arrow-left"
					onPress={() => navigation.goBack()}
					textColor={colors.textPrimary}
					compact
				>
					Back
				</Button>
				<IconButton
					icon={flare.savedByUser ? "bookmark" : "bookmark-outline"}
					iconColor={flare.savedByUser ? colors.burgundy : colors.textSecondary}
					size={24}
					onPress={() =>
						saveFlare.mutate({ id: flare.id, wasSaved: flare.savedByUser })
					}
					disabled={saveFlare.isPending}
				/>
			</View>

			<ScrollView contentContainerStyle={styles.content}>
				{/* ═══ Hero — category + credibility at top ═══ */}
				<View style={styles.heroCard}>
					<View style={styles.heroTopRow}>
						<Text style={styles.heroCategory}>
							{CATEGORY_LABELS[flare.category]}
						</Text>
						<CredibilityChip level={flare.credibility} />
					</View>
					<Text style={styles.heroSummary}>{flare.summary}</Text>
					<View style={styles.heroMeta}>
						<Text style={styles.heroLocation}>{flare.location}</Text>
						<Text style={styles.heroDot}>·</Text>
						<Text style={styles.heroTime}>{timeAgo(flare.lastUpdated)}</Text>
					</View>

					{/* Upvote / confirm */}
					{flare.credibility !== "resolved" && (
						<View style={styles.upvoteRow}>
							<Button
								mode={flare.upvotedByUser ? "contained" : "outlined"}
								icon="arrow-up-bold"
								onPress={() => upvoteFlare.mutate(flare.id)}
								buttonColor={flare.upvotedByUser ? colors.burgundy : undefined}
								textColor={flare.upvotedByUser ? "#FFFFFF" : colors.burgundy}
								style={styles.upvoteButton}
								labelStyle={styles.upvoteLabel}
								compact
							>
								{flare.upvotedByUser ? "Confirmed" : "Confirm"}
							</Button>
							<Text style={styles.upvoteHint}>
								{flare.upvotes} {flare.upvotes === 1 ? "person" : "people"}{" "}
								confirmed this
							</Text>
						</View>
					)}
				</View>

				{/* ═══ Start plan ═══ */}
				<Button
					mode="contained"
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					icon="play-circle-outline"
					style={styles.actionButton}
					labelStyle={styles.actionLabel}
					contentStyle={styles.actionContent}
					onPress={() =>
						navigation.navigate("ActionPlan", { planId: flare.id })
					}
				>
					Respond to flare
				</Button>

				{/* ═══ Timeline + credibility progression ═══ */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Timeline</Text>
					{/* Actual timeline entries */}
					{flare.timeline.map((entry, i) => (
						<View key={`${entry.time}-${i}`} style={styles.timelineRow}>
							<View style={[styles.timelineDot, styles.timelineDotDone]} />
							<Text style={styles.timelineTime}>{entry.time}</Text>
							<Text style={styles.timelineLabel}>{entry.label}</Text>
						</View>
					))}
					{/* Future credibility steps (greyed out) */}
					{CREDIBILITY_STEPS.filter((step: CredibilityLevel) => {
						const currentIdx = CREDIBILITY_STEPS.indexOf(flare.credibility);
						const stepIdx = CREDIBILITY_STEPS.indexOf(step);
						return stepIdx > currentIdx;
					}).map((step: CredibilityLevel) => (
						<View key={step} style={styles.timelineRow}>
							<View style={[styles.timelineDot, styles.timelineDotPending]} />
							<Text style={styles.timelineTimePending}>—</Text>
							<Text style={styles.timelineLabelPending}>
								{step.charAt(0).toUpperCase() + step.slice(1)}
							</Text>
						</View>
					))}
				</View>

				{/* ═══ Emergency — small text link at very bottom ═══ */}
				<Button
					mode="text"
					icon="alert-circle-outline"
					textColor={colors.textSecondary}
					compact
					labelStyle={styles.emergencyLink}
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
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: spacing.xs,
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
	heroTopRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
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
	upvoteRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		marginTop: spacing.xs,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingTop: spacing.sm,
	},
	upvoteButton: {
		borderRadius: 20,
		borderColor: colors.burgundy,
	},
	upvoteLabel: {
		fontSize: 13,
		fontWeight: "600",
	},
	upvoteHint: {
		flex: 1,
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},

	// Cards
	card: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	sectionTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},

	// Action
	actionButton: {
		borderRadius: components.cardRadius,
	},
	actionContent: {
		minHeight: components.touchTarget,
	},
	actionLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},

	// Timeline
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
	timelineDotDone: {
		backgroundColor: colors.burgundy,
	},
	timelineDotPending: {
		backgroundColor: colors.border,
		borderWidth: 1,
		borderColor: colors.textDisabled,
	},
	timelineTime: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
		color: colors.textSecondary,
		width: 40,
	},
	timelineTimePending: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
		width: 40,
	},
	timelineLabel: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
	timelineLabelPending: {
		fontSize: typography.body.fontSize,
		color: colors.textDisabled,
		fontStyle: "italic",
	},

	// Emergency text link
	emergencyLink: {
		fontSize: typography.caption.fontSize,
	},
});
