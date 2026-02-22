import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CredibilityChip } from "../components/CredibilityChip";
import { useCreateFlare, useFlares } from "../hooks/useFlares";
import { usePreferences } from "../hooks/usePreferences";
import type {
	EmergencyUXNavProp,
	NearbyStackParamList,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { FlareCategory } from "../types";

type EmergencyRoute = RouteProp<NearbyStackParamList, "EmergencyUX">;

const CAMPUS_SECURITY = "514-848-3717";
const EMERGENCY_911 = "911";

// Context-adaptive steps — when we know the location, steps are specific
function getSteps(hasLocation: boolean, mobilityFriendly: boolean) {
	const steps = [
		{
			instruction: "Move away from the area",
			detail: hasLocation
				? "Leave through the nearest safe exit. Avoid the reported disruption zone."
				: "If indoors, exit the building using the closest exit. If outdoors, move away from the area.",
		},
		{
			instruction: "Head to a safe, populated area",
			detail: mobilityFriendly
				? "Go to the nearest accessible building lobby with elevator access — EV, Hall, or LB Building."
				: "Head to a well-lit lobby or open common area — Hall Building, EV Building, or Library Building.",
		},
		{
			instruction: "Contact help if needed",
			detail: `Call campus security at ${CAMPUS_SECURITY}. For life-threatening emergencies, call 911.`,
		},
		{
			instruction: "Wait for the all-clear",
			detail:
				"Stay in a safe area. Check for updates below, or wait for an announcement from campus security.",
		},
	];
	return steps;
}

// Quick report categories (compressed)
const QUICK_CATEGORIES: { value: FlareCategory; label: string }[] = [
	{ value: "blocked_entrance", label: "Blocked entrance" },
	{ value: "dense_crowd", label: "Dense crowd" },
	{ value: "access_restriction", label: "Restriction" },
	{ value: "other", label: "Other" },
];

function timeAgo(ms: number): string {
	const diff = Date.now() - ms;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins} min ago`;
	return `${Math.floor(mins / 60)}h ago`;
}

export const EmergencyScreen = () => {
	const route = useRoute<EmergencyRoute>();
	const navigation = useNavigation<EmergencyUXNavProp>();
	const insets = useSafeAreaInsets();
	const { data: flares = [], refetch } = useFlares();
	const { data: prefs } = usePreferences();
	const createFlare = useCreateFlare();

	const isOnline = prefs?.offlineCaching !== false;
	const mobilityFriendly = prefs?.mobilityFriendly ?? false;

	// Context from triggering flare (if any)
	const flare = route.params?.flareId
		? flares.find((f) => f.id === route.params.flareId)
		: undefined;

	const hasFlareContext = !!flare;
	const steps = getSteps(hasFlareContext, mobilityFriendly);

	// Step state
	const [currentStep, setCurrentStep] = useState(0);
	const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
	const [isSafe, setIsSafe] = useState(false);

	// Quick report state
	const [reportVisible, setReportVisible] = useState(false);
	const [reportCategory, setReportCategory] = useState<FlareCategory>("other");
	const [reportNote, setReportNote] = useState("");
	const [reportSubmitted, setReportSubmitted] = useState(false);

	const handleNextStep = () => {
		setCompletedSteps((prev) => new Set(prev).add(currentStep));
		if (currentStep < steps.length - 1) {
			setCurrentStep((p) => p + 1);
		} else {
			setIsSafe(true);
		}
	};

	const handleCallSecurity = () => {
		const url = `tel:${CAMPUS_SECURITY}`;
		Linking.canOpenURL(url).then((supported) => {
			if (supported) {
				Linking.openURL(url);
			} else {
				Alert.alert(
					"Campus Security",
					`Call ${CAMPUS_SECURITY}\n\nIf calling is unavailable, go to the nearest security desk in Hall Building or EV Building.`,
					[{ text: "OK" }],
				);
			}
		});
	};

	const handleCall911 = () => {
		const url = `tel:${EMERGENCY_911}`;
		Linking.canOpenURL(url).then((supported) => {
			if (supported) {
				Linking.openURL(url);
			} else {
				Alert.alert("Emergency", "Call 911 from the nearest phone.", [
					{ text: "OK" },
				]);
			}
		});
	};

	const handleQuickReport = () => {
		createFlare.mutate(
			{
				category: reportCategory,
				building: flare?.building ?? "SGW Campus",
				entrance: flare?.entrance,
				note: reportNote || undefined,
			},
			{
				onSuccess: () => setReportSubmitted(true),
			},
		);
	};

	// ═══════════════════════════════════════════════════════════
	// "I'm safe" completion screen
	// ═══════════════════════════════════════════════════════════
	if (isSafe) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
				<View style={styles.safeContent}>
					<Text style={styles.safeTitle}>You're safe</Text>
					<Text style={styles.safeBody}>
						All steps complete. If you need further help, contact campus
						security.
					</Text>
				</View>

				<View style={styles.safeActions}>
					{hasFlareContext && (
						<Button
							mode="outlined"
							onPress={() => {
								navigation.goBack();
								// Navigate to flare detail would be ideal but goBack is safest
							}}
							textColor={colors.burgundy}
							style={styles.actionButton}
							labelStyle={styles.actionLabel}
							contentStyle={styles.actionContent}
						>
							View updates
						</Button>
					)}
					<Button
						mode="contained"
						onPress={() => navigation.popToTop()}
						buttonColor={colors.statusSafe}
						textColor="#FFFFFF"
						style={styles.actionButton}
						labelStyle={styles.actionLabel}
						contentStyle={styles.actionContent}
					>
						Back to feed
					</Button>
				</View>
			</View>
		);
	}

	// ═══════════════════════════════════════════════════════════
	// Main Emergency screen
	// ═══════════════════════════════════════════════════════════
	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
			{/* ── Header ─────────────────────────────────────── */}
			<View style={styles.header}>
				<Text style={styles.title}>Emergency</Text>
				<Button
					mode="text"
					onPress={() => navigation.goBack()}
					textColor={colors.textSecondary}
					compact
					labelStyle={styles.exitLabel}
				>
					Exit
				</Button>
			</View>

			{/* Offline notice */}
			{!isOnline && (
				<View style={styles.offlineBanner}>
					<Text style={styles.offlineText}>
						Offline — showing cached guidance. Live updates unavailable.
					</Text>
				</View>
			)}

			{/* Flare context (if triggered from a flare) */}
			{hasFlareContext && flare && (
				<View style={styles.contextCard}>
					<View style={styles.contextRow}>
						<CredibilityChip level={flare.credibility} />
						<Text style={styles.contextTime}>{timeAgo(flare.lastUpdated)}</Text>
					</View>
					<Text style={styles.contextSummary}>{flare.summary}</Text>
					<Text style={styles.contextLocation}>{flare.location}</Text>
				</View>
			)}

			{/* ── Steps ──────────────────────────────────────── */}
			<ScrollView
				style={styles.stepsScroll}
				contentContainerStyle={styles.stepsContainer}
			>
				{steps.map((step, i) => {
					const isComplete = completedSteps.has(i);
					const isCurrent = i === currentStep;
					const isFuture = i > currentStep;

					return (
						<View
							key={step.instruction}
							style={[
								styles.stepCard,
								isCurrent && styles.stepCardCurrent,
								isComplete && styles.stepCardComplete,
								isFuture && styles.stepCardFuture,
							]}
						>
							<View style={styles.stepHeader}>
								<View
									style={[
										styles.stepBadge,
										isComplete && styles.stepBadgeComplete,
										isCurrent && styles.stepBadgeCurrent,
									]}
								>
									<Text
										style={[
											styles.stepBadgeText,
											(isComplete || isCurrent) && styles.stepBadgeTextActive,
										]}
									>
										{isComplete ? "✓" : i + 1}
									</Text>
								</View>
								<Text
									style={[
										styles.stepInstruction,
										isComplete && styles.stepInstructionComplete,
										isFuture && styles.stepInstructionFuture,
									]}
								>
									{step.instruction}
								</Text>
							</View>
							{(isCurrent || isComplete) && (
								<Text
									style={[
										styles.stepDetail,
										isComplete && styles.stepDetailComplete,
									]}
								>
									{step.detail}
								</Text>
							)}
						</View>
					);
				})}
			</ScrollView>

			{/* ── Bottom actions (always visible) ────────────── */}
			<View style={styles.bottomBar}>
				{/* Progress + Next */}
				<Button
					mode="contained"
					onPress={handleNextStep}
					buttonColor={
						currentStep === steps.length - 1
							? colors.statusSafe
							: colors.burgundy
					}
					textColor="#FFFFFF"
					style={styles.actionButton}
					labelStyle={styles.actionLabel}
					contentStyle={styles.nextContent}
				>
					{currentStep === steps.length - 1 ? "I'm safe" : "Next step"}
				</Button>

				{/* Persistent call row */}
				<View style={styles.callRow}>
					<Button
						mode="contained"
						onPress={handleCallSecurity}
						buttonColor="#1B5E20"
						textColor="#FFFFFF"
						icon="phone"
						style={styles.callButton}
						labelStyle={styles.callLabel}
						contentStyle={styles.callContent}
					>
						Campus security
					</Button>
					<Button
						mode="outlined"
						onPress={handleCall911}
						textColor="#D32F2F"
						icon="phone"
						style={[styles.callButton, styles.call911]}
						labelStyle={styles.callLabel}
						contentStyle={styles.callContent}
					>
						911
					</Button>
				</View>

				{/* Quick report + Check updates */}
				<View style={styles.secondaryRow}>
					<Button
						mode="text"
						onPress={() => {
							setReportSubmitted(false);
							setReportNote("");
							setReportVisible(true);
						}}
						textColor={colors.burgundy}
						compact
						labelStyle={styles.secondaryLabel}
					>
						Quick report
					</Button>
					{isOnline && (
						<Button
							mode="text"
							onPress={() => refetch()}
							textColor={colors.textSecondary}
							compact
							labelStyle={styles.secondaryLabel}
						>
							Check for updates
						</Button>
					)}
				</View>
			</View>

			{/* ── Quick Report Modal ─────────────────────────── */}
			<Portal>
				<Modal
					visible={reportVisible}
					onDismiss={() => setReportVisible(false)}
					contentContainerStyle={styles.modalContainer}
				>
					{reportSubmitted ? (
						<View style={styles.modalDone}>
							<Text style={styles.modalDoneTitle}>Reported</Text>
							<Text style={styles.modalDoneBody}>
								Thank you. Your report helps others stay safe.
							</Text>
							<Button
								mode="contained"
								onPress={() => setReportVisible(false)}
								buttonColor={colors.burgundy}
								textColor="#FFFFFF"
								style={styles.actionButton}
								labelStyle={styles.actionLabel}
							>
								Back to emergency
							</Button>
						</View>
					) : (
						<>
							<Text style={styles.modalTitle}>Quick report</Text>
							<Text style={styles.modalHint}>
								Location: {flare?.location ?? "SGW Campus (auto-detected)"}
							</Text>

							{/* Category row */}
							<View style={styles.categoryRow}>
								{QUICK_CATEGORIES.map((cat) => (
									<Button
										key={cat.value}
										mode={
											reportCategory === cat.value ? "contained" : "outlined"
										}
										onPress={() => setReportCategory(cat.value)}
										buttonColor={
											reportCategory === cat.value ? colors.burgundy : undefined
										}
										textColor={
											reportCategory === cat.value
												? "#FFFFFF"
												: colors.textPrimary
										}
										compact
										style={styles.categoryChip}
										labelStyle={styles.categoryLabel}
									>
										{cat.label}
									</Button>
								))}
							</View>

							{/* Optional note */}
							<TextInput
								mode="outlined"
								label="Note (optional)"
								value={reportNote}
								onChangeText={(t) => setReportNote(t.slice(0, 140))}
								style={styles.noteInput}
								outlineColor={colors.border}
								activeOutlineColor={colors.burgundy}
								multiline
							/>

							<Button
								mode="contained"
								onPress={handleQuickReport}
								buttonColor={colors.burgundy}
								textColor="#FFFFFF"
								loading={createFlare.isPending}
								disabled={createFlare.isPending}
								style={styles.actionButton}
								labelStyle={styles.actionLabel}
								contentStyle={styles.actionContent}
							>
								Submit
							</Button>
						</>
					)}
				</Modal>
			</Portal>
		</View>
	);
};

// ═════════════════════════════════════════════════════════════
// Styles — large type, high contrast, minimal clutter
// ═════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: components.screenPaddingH,
	},

	// Header
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.sm,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	exitLabel: {
		fontSize: typography.body.fontSize,
	},

	// Offline
	offlineBanner: {
		backgroundColor: "#FFF3E0",
		borderRadius: components.cardRadius,
		padding: spacing.sm,
		marginBottom: spacing.sm,
	},
	offlineText: {
		fontSize: typography.caption.fontSize,
		color: colors.statusCaution,
		textAlign: "center",
	},

	// Flare context
	contextCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.xs,
		marginBottom: spacing.sm,
	},
	contextRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	contextTime: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	contextSummary: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},
	contextLocation: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},

	// Steps
	stepsScroll: {
		flex: 1,
	},
	stepsContainer: {
		gap: spacing.sm,
		paddingBottom: spacing.md,
	},
	stepCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.xs,
	},
	stepCardCurrent: {
		borderColor: colors.burgundy,
		borderWidth: 2,
		backgroundColor: "#FFF8F0",
	},
	stepCardComplete: {
		opacity: 0.6,
	},
	stepCardFuture: {
		opacity: 0.4,
	},
	stepHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	stepBadge: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	stepBadgeComplete: {
		backgroundColor: colors.statusSafe,
	},
	stepBadgeCurrent: {
		backgroundColor: colors.burgundy,
	},
	stepBadgeText: {
		fontSize: 14,
		fontWeight: "700",
		color: colors.textSecondary,
	},
	stepBadgeTextActive: {
		color: "#FFFFFF",
	},
	stepInstruction: {
		flex: 1,
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	stepInstructionComplete: {
		textDecorationLine: "line-through",
	},
	stepInstructionFuture: {
		color: colors.textSecondary,
	},
	stepDetail: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
		marginLeft: 28 + 8, // badge width + gap
	},
	stepDetailComplete: {
		textDecorationLine: "line-through",
	},

	// Bottom bar
	bottomBar: {
		gap: spacing.sm,
		paddingBottom: spacing.lg,
		paddingTop: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	nextContent: {
		minHeight: 52,
	},
	callRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	callButton: {
		flex: 1,
		borderRadius: components.cardRadius,
	},
	call911: {
		borderColor: "#D32F2F",
	},
	callContent: {
		minHeight: components.touchTarget,
	},
	callLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	secondaryRow: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	secondaryLabel: {
		fontSize: typography.caption.fontSize,
	},

	// Action buttons (shared)
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

	// Safe screen
	safeContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.md,
	},
	safeTitle: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.statusSafe,
	},
	safeBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
		maxWidth: 280,
	},
	safeActions: {
		gap: spacing.sm,
		paddingBottom: spacing.xl,
	},

	// Quick Report Modal
	modalContainer: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		padding: spacing.lg,
		marginHorizontal: spacing.lg,
		gap: spacing.md,
	},
	modalTitle: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	modalHint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	categoryRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.xs,
	},
	categoryChip: {
		borderRadius: components.cardRadius,
		borderColor: colors.border,
	},
	categoryLabel: {
		fontSize: typography.caption.fontSize,
	},
	noteInput: {
		backgroundColor: colors.surface,
	},
	modalDone: {
		alignItems: "center",
		gap: spacing.md,
	},
	modalDoneTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.statusSafe,
	},
	modalDoneBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
	},
});
