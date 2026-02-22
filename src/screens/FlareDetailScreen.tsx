import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Divider, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CredibilityChip } from "../components/CredibilityChip";
import { ProgressBar } from "../components/ProgressBar";
import { useFlares } from "../hooks/useFlares";
import type {
	FlareDetailNavProp,
	NearbyStackParamList,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

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

	const flare = flares.find((f) => f.id === route.params.flareId);

	if (!flare) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
				<Text style={styles.title}>Flare not found</Text>
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
				{/* Status summary card */}
				<View style={styles.card}>
					<View style={styles.metaRow}>
						<CredibilityChip level={flare.credibility} />
						<Text style={styles.timestamp}>{timeAgo(flare.lastUpdated)}</Text>
					</View>
					<Text style={styles.summary}>{flare.summary}</Text>
					<Text style={styles.location}>{flare.location}</Text>
				</View>

				{/* Full progress bar */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Status</Text>
					<ProgressBar currentLevel={flare.credibility} showLabels />
				</View>

				{/* Recommended action panel */}
				<View style={styles.card}>
					<Text style={styles.sectionTitle}>Recommended action</Text>
					<View style={styles.actionButtons}>
						<Button
							mode="contained"
							buttonColor={colors.burgundy}
							textColor="#FFFFFF"
							labelStyle={styles.buttonLabel}
							contentStyle={styles.buttonContent}
							style={styles.primaryButton}
						>
							Avoid this area
						</Button>
						<Button
							mode="outlined"
							textColor={colors.burgundy}
							labelStyle={styles.buttonLabel}
							contentStyle={styles.buttonContent}
							style={styles.outlineButton}
						>
							Recheck
						</Button>
					</View>
					<Button
						mode="text"
						textColor={colors.textSecondary}
						compact
						labelStyle={styles.whyLabel}
					>
						Why this?
					</Button>
				</View>

				{/* Timeline */}
				{flare.timeline.length > 0 && (
					<View style={styles.card}>
						<Text style={styles.sectionTitle}>Timeline</Text>
						{flare.timeline.map((entry, i) => (
							<View key={`${entry.time}-${i}`} style={styles.timelineRow}>
								<Text style={styles.timelineTime}>{entry.time}</Text>
								<Text style={styles.timelineLabel}>{entry.label}</Text>
							</View>
						))}
					</View>
				)}

				{/* Actions row */}
				<Divider style={styles.divider} />
				<View style={styles.actionsRow}>
					<Button
						mode="text"
						textColor={colors.burgundy}
						icon="bookmark-outline"
						compact
						labelStyle={styles.smallLabel}
					>
						Save flare
					</Button>
					<Button
						mode="text"
						textColor={colors.burgundy}
						icon="pencil-outline"
						compact
						labelStyle={styles.smallLabel}
					>
						Report update
					</Button>
					<Button
						mode="text"
						textColor={colors.burgundy}
						icon="play-circle-outline"
						compact
						labelStyle={styles.smallLabel}
						onPress={() =>
							navigation.navigate("ActionPlan", { planId: flare.id })
						}
					>
						Start plan
					</Button>
				</View>
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
		gap: components.cardGap,
	},
	card: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	metaRow: {
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
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
		padding: components.screenPaddingH,
	},
	sectionTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	actionButtons: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	primaryButton: {
		borderRadius: components.cardRadius,
		flex: 1,
	},
	outlineButton: {
		borderRadius: components.cardRadius,
		borderColor: colors.burgundy,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	whyLabel: {
		fontSize: typography.caption.fontSize,
	},
	timelineRow: {
		flexDirection: "row",
		gap: spacing.md,
		paddingVertical: spacing.xs,
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
	divider: {
		backgroundColor: colors.border,
	},
	actionsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	smallLabel: {
		fontSize: typography.caption.fontSize,
	},
});
