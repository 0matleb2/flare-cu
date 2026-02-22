import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCreateFlare } from "../hooks/useFlares";
import type {
	NearbyStackParamList,
	ReportStep3NavProp,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { FlareCategory } from "../types";

type Step3Route = RouteProp<NearbyStackParamList, "ReportStep3">;

const RETRACT_SECONDS = 10;

export const ReportStep3Screen = () => {
	const navigation = useNavigation<ReportStep3NavProp>();
	const route = useRoute<Step3Route>();
	const insets = useSafeAreaInsets();
	const createFlare = useCreateFlare();

	const [note, setNote] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [retracted, setRetracted] = useState(false);
	const [countdown, setCountdown] = useState(RETRACT_SECONDS);

	// Countdown timer after submission
	useEffect(() => {
		if (!submitted || retracted) return;
		if (countdown <= 0) {
			// Auto-navigate back to feed
			navigation.popToTop();
			return;
		}
		const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [submitted, retracted, countdown, navigation]);

	// Auto-return after retract
	useEffect(() => {
		if (!retracted) return;
		const timer = setTimeout(() => {
			navigation.popToTop();
		}, 2000);
		return () => clearTimeout(timer);
	}, [retracted, navigation]);

	const handleSubmit = useCallback(() => {
		createFlare.mutate(
			{
				category: route.params.category as FlareCategory,
				building: route.params.building,
				entrance: route.params.entrance,
				note: note || undefined,
			},
			{
				onSuccess: () => {
					setSubmitted(true);
					setCountdown(RETRACT_SECONDS);
				},
			},
		);
	}, [createFlare, route.params, note]);

	const handleRetract = () => {
		setRetracted(true);
	};

	// ═══ Submitted state with countdown ═══
	if (submitted) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
				<View style={styles.successContent}>
					{retracted ? (
						<>
							<Text style={styles.retractedEmoji}>↩</Text>
							<Text style={styles.retractedTitle}>Flare retracted</Text>
							<Text style={styles.successBody}>
								Your flare has been retracted. Returning to feed...
							</Text>
						</>
					) : (
						<>
							<Text style={styles.successEmoji}>✓</Text>
							<Text style={styles.successTitle}>Flare raised</Text>
							<Text style={styles.successBody}>
								Your flare has been submitted. Thank you for helping the
								community.
							</Text>

							{/* Status */}
							<View style={styles.statusCard}>
								<Text style={styles.statusLabel}>Awaiting verification</Text>
								<Text style={styles.statusBody}>
									Other users can confirm your flare. Campus safety may verify
									it officially.
								</Text>
							</View>

							{/* Countdown + retract */}
							<View style={styles.countdownSection}>
								<View style={styles.countdownCircle}>
									<Text style={styles.countdownNumber}>{countdown}</Text>
								</View>
								<Text style={styles.countdownLabel}>
									{countdown > 0
										? `Retract within ${countdown}s`
										: "Returning to feed..."}
								</Text>
								{countdown > 0 && (
									<Button
										mode="outlined"
										onPress={handleRetract}
										textColor={colors.statusCaution}
										style={styles.retractButton}
										labelStyle={styles.retractLabel}
									>
										Retract flare
									</Button>
								)}
							</View>
						</>
					)}
				</View>
			</View>
		);
	}

	// ═══ Input state ═══
	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
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

			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.content}
			>
				{/* Progress bar */}
				<View style={styles.progressRow}>
					<View style={[styles.progressSegment, styles.progressDone]} />
					<View style={[styles.progressSegment, styles.progressDone]} />
					<View style={[styles.progressSegment, styles.progressCurrent]} />
				</View>

				<Text style={styles.title}>Add a note</Text>
				<Text style={styles.step}>Step 3 of 3 — Optional</Text>

				<TextInput
					mode="outlined"
					label="What's happening? (optional)"
					value={note}
					onChangeText={(text) => setNote(text.slice(0, 140))}
					multiline
					numberOfLines={3}
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={colors.burgundy}
					right={<TextInput.Affix text={`${note.length}/140`} />}
				/>
			</ScrollView>

			{/* Submit button at bottom */}
			<View
				style={[
					styles.bottomBar,
					{ paddingBottom: insets.bottom + spacing.md },
				]}
			>
				<Button
					mode="contained"
					icon="fire"
					onPress={handleSubmit}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					loading={createFlare.isPending}
					disabled={createFlare.isPending}
				>
					Raise flare
				</Button>
			</View>
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
	scrollArea: { flex: 1 },
	content: {
		paddingHorizontal: components.screenPaddingH,
		gap: spacing.md,
		paddingBottom: spacing.lg,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	step: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	progressRow: {
		flexDirection: "row",
		gap: 4,
	},
	progressSegment: {
		flex: 1,
		height: 4,
		borderRadius: 2,
		backgroundColor: colors.border,
	},
	progressDone: {
		backgroundColor: colors.burgundy,
	},
	progressCurrent: {
		backgroundColor: colors.burgundy,
		opacity: 0.5,
	},
	input: {
		backgroundColor: colors.surface,
	},

	// Bottom bar
	bottomBar: {
		paddingHorizontal: components.screenPaddingH,
		paddingTop: spacing.sm,
		borderTopWidth: 1,
		borderTopColor: colors.border,
	},
	button: {
		borderRadius: components.cardRadius,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},

	// Success state
	successContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: components.screenPaddingH,
		gap: spacing.md,
	},
	successEmoji: {
		fontSize: 48,
		color: colors.burgundy,
	},
	successTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.burgundy,
	},
	successBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
		maxWidth: 280,
	},

	// Status card
	statusCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 1,
		borderColor: colors.border,
		padding: spacing.md,
		gap: spacing.xs,
		width: "100%",
		maxWidth: 320,
	},
	statusLabel: {
		fontSize: 13,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	statusBody: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		lineHeight: 18,
	},

	// Countdown
	countdownSection: {
		alignItems: "center",
		gap: spacing.sm,
		marginTop: spacing.sm,
	},
	countdownCircle: {
		width: 56,
		height: 56,
		borderRadius: 28,
		borderWidth: 3,
		borderColor: colors.burgundy,
		justifyContent: "center",
		alignItems: "center",
	},
	countdownNumber: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.burgundy,
	},
	countdownLabel: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	retractButton: {
		borderColor: colors.statusCaution,
		borderRadius: components.cardRadius,
	},
	retractLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},

	// Retracted state
	retractedEmoji: {
		fontSize: 48,
		color: colors.textSecondary,
	},
	retractedTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.textSecondary,
	},
});
