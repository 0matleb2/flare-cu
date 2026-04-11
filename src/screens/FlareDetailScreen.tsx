import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CredibilityChip } from "../components/CredibilityChip";
import { EmptyState } from "../components/EmptyState";
import { useAppSession } from "../context/AppSessionContext";
import { useEmergency } from "../context/EmergencyContext";
import { useAccentColors } from "../hooks/useAccentColors";
import {
	useDownvoteFlare,
	useFlares,
	useSaveFlare,
	useUpvoteFlare,
} from "../hooks/useFlares";
import { useLowStim } from "../hooks/useLowStim";
import type {
	FlareDetailNavProp,
	NearbyStackParamList,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { CredibilityLevel } from "../types";
import { CATEGORY_LABELS, CREDIBILITY_STEPS } from "../types";

const TOUCH_TARGET_EXPANSION = {
	top: 8,
	right: 8,
	bottom: 8,
	left: 8,
} as const;

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
	const downvoteFlare = useDownvoteFlare();
	const { accessMode } = useAppSession();
	const { activate: activateEmergency } = useEmergency();
	const lowStim = useLowStim();
	const accent = useAccentColors();
	const [timelineExpanded, setTimelineExpanded] = useState(!lowStim);
	const [voteGateMessageVisible, setVoteGateMessageVisible] = useState(false);

	const flare = flares.find((f) => f.id === route.params.flareId);
	const canConfirmFlare = accessMode === "account";

	if (!flare) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
				<View style={styles.notFoundCard}>
					<EmptyState
						title="Flare not found"
						message="This report may have been removed or is no longer available on this device."
						hint="Return to the feed and refresh to see the latest campus reports."
						actionLabel="Go back"
						onAction={() => navigation.goBack()}
						compact
					/>
				</View>
			</View>
		);
	}

	const handleUpvotePress = () => {
		if (!canConfirmFlare) {
			setVoteGateMessageVisible(true);
			return;
		}
		setVoteGateMessageVisible(false);
		upvoteFlare.mutate(flare.id);
	};

	const handleDownvotePress = () => {
		if (!canConfirmFlare) {
			setVoteGateMessageVisible(true);
			return;
		}
		setVoteGateMessageVisible(false);
		downvoteFlare.mutate(flare.id);
	};

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
					iconColor={flare.savedByUser ? accent.primary : colors.textSecondary}
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
						<CredibilityChip level={flare.credibility} lowStim={lowStim} />
					</View>
					<Text style={styles.heroSummary}>{flare.summary}</Text>
					<View style={styles.heroMeta}>
						<Text style={styles.heroLocation}>{flare.location}</Text>
						{!lowStim && (
							<>
								<Text style={styles.heroDot}>·</Text>
								<Text style={styles.heroTime}>
									{timeAgo(flare.lastUpdated)}
								</Text>
							</>
						)}
					</View>
					{flare.credibility !== "resolved" && (
						<View style={styles.votePill}>
							<IconButton
								icon={
									flare.upvotedByUser
										? "arrow-up-bold"
										: "arrow-up-bold-outline"
								}
								iconColor={
									canConfirmFlare
										? flare.upvotedByUser
											? accent.primary
											: colors.textSecondary
										: colors.textDisabled
								}
								size={18}
								onPress={handleUpvotePress}
								disabled={upvoteFlare.isPending || downvoteFlare.isPending}
								style={styles.voteButton}
								accessibilityLabel="Upvote this flare"
							/>
							<Text style={styles.voteCount}>{flare.upvotes}</Text>
							<IconButton
								icon={
									flare.downvotedByUser
										? "arrow-down-bold"
										: "arrow-down-bold-outline"
								}
								iconColor={
									canConfirmFlare
										? flare.downvotedByUser
											? accent.primary
											: colors.textSecondary
										: colors.textDisabled
								}
								size={18}
								onPress={handleDownvotePress}
								disabled={upvoteFlare.isPending || downvoteFlare.isPending}
								style={styles.voteButton}
								accessibilityLabel="Downvote this flare"
							/>
						</View>
					)}
					{voteGateMessageVisible && !canConfirmFlare && (
						<Text style={styles.voteHint}>
							Sign in with your Concordia account to confirm reports.
						</Text>
					)}
				</View>

				{/* ═══ Start plan ═══ */}
				<Button
					mode="contained"
					buttonColor={accent.primary}
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
					<TouchableOpacity
						style={styles.timelineHeader}
						onPress={() => setTimelineExpanded((p) => !p)}
						activeOpacity={0.7}
						hitSlop={TOUCH_TARGET_EXPANSION}
						accessibilityRole="button"
						accessibilityLabel="Timeline"
						accessibilityHint="Expands or collapses the flare timeline."
						accessibilityState={{ expanded: timelineExpanded }}
					>
						<Text style={styles.sectionTitle}>Timeline</Text>
						<Text style={[styles.timelineToggle, { color: accent.primary }]}>
							{timelineExpanded ? "Hide" : "View"}
						</Text>
					</TouchableOpacity>
					{timelineExpanded && (
						<>
							{/* Actual timeline entries */}
							{flare.timeline.map((entry, i) => (
								<View key={`${entry.time}-${i}`} style={styles.timelineRow}>
									<View
										style={[
											styles.timelineDot,
											styles.timelineDotDone,
											{ backgroundColor: accent.primary },
										]}
									/>
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
									<View
										style={[styles.timelineDot, styles.timelineDotPending]}
									/>
									<Text style={styles.timelineTimePending}>—</Text>
									<Text style={styles.timelineLabelPending}>
										{step.charAt(0).toUpperCase() + step.slice(1)}
									</Text>
								</View>
							))}
						</>
					)}
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
	notFoundCard: {
		paddingHorizontal: components.screenPaddingH,
	},

	// Hero card
	heroCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
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
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	heroSummary: {
		fontSize: 18,
		fontWeight: "700",
		color: colors.textPrimary,
		lineHeight: 24,
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
	votePill: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: colors.background,
		borderRadius: 999,
		alignSelf: "flex-start",
		paddingHorizontal: 0,
		marginTop: spacing.xs,
		borderWidth: 1,
		borderColor: colors.border,
		height: 36,
	},
	voteButton: {
		margin: -4,
	},
	voteCount: {
		color: colors.textPrimary,
		fontSize: 14,
		fontWeight: "600",
		marginHorizontal: 6,
	},
	voteHint: {
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
	timelineHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	timelineToggle: {
		fontSize: typography.caption.fontSize,
		color: colors.burgundy,
		fontWeight: "600",
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
		width: 75,
	},
	timelineTimePending: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
		width: 75,
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
