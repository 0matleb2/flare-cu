import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
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

const RETRACT_WINDOW_MS = 2 * 60 * 1000; // 2 minutes

export const ReportStep3Screen = () => {
	const navigation = useNavigation<ReportStep3NavProp>();
	const route = useRoute<Step3Route>();
	const insets = useSafeAreaInsets();
	const createFlare = useCreateFlare();

	const [note, setNote] = useState("");
	const [submitted, setSubmitted] = useState(false);
	const [retractable, setRetractable] = useState(true);
	const [retracted, setRetracted] = useState(false);
	const [submittedAt, setSubmittedAt] = useState<number | null>(null);

	// Auto-expire retract window
	useEffect(() => {
		if (!submittedAt) return;
		const remaining = RETRACT_WINDOW_MS - (Date.now() - submittedAt);
		if (remaining <= 0) {
			setRetractable(false);
			return;
		}
		const timer = setTimeout(() => setRetractable(false), remaining);
		return () => clearTimeout(timer);
	}, [submittedAt]);

	const handleSubmit = () => {
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
					setSubmittedAt(Date.now());
				},
			},
		);
	};

	const handleRetract = () => {
		// In a real app, this would delete the flare
		setRetracted(true);
		setRetractable(false);
	};

	if (submitted) {
		return (
			<View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
				<View style={styles.successContent}>
					{retracted ? (
						<>
							<Text style={styles.retractedTitle}>Retracted</Text>
							<Text style={styles.successBody}>
								Your flare has been retracted.
							</Text>
						</>
					) : (
						<>
							<Text style={styles.successTitle}>Submitted</Text>
							<Text style={styles.successBody}>
								Your flare has been submitted. Thank you for helping the
								community.
							</Text>
							{retractable && (
								<Button
									mode="outlined"
									onPress={handleRetract}
									textColor={colors.statusCaution}
									style={styles.retractButton}
									labelStyle={styles.retractLabel}
								>
									Retract report
								</Button>
							)}
							<Text style={styles.retractNote}>
								{retractable
									? "You can retract within 2 minutes."
									: "Retract window has expired."}
							</Text>
						</>
					)}
				</View>

				<Button
					mode="contained"
					onPress={() => navigation.popToTop()}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
				>
					Back to feed
				</Button>
			</View>
		);
	}

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

			<View style={styles.content}>
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
				/>
				<Text style={styles.charCount}>{note.length}/140</Text>

				<Button
					mode="contained"
					onPress={handleSubmit}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					loading={createFlare.isPending}
					disabled={createFlare.isPending}
				>
					Submit
				</Button>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: components.screenPaddingH,
	},
	header: {
		flexDirection: "row",
		marginHorizontal: -components.screenPaddingH,
		paddingHorizontal: spacing.xs,
		paddingVertical: spacing.xs,
	},
	content: {
		gap: spacing.md,
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
	charCount: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		textAlign: "right",
	},
	button: {
		borderRadius: components.cardRadius,
		marginTop: spacing.sm,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	successContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: spacing.md,
	},
	successTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.statusSafe,
	},
	retractedTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: colors.textSecondary,
	},
	successBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
	},
	retractButton: {
		borderColor: colors.statusCaution,
		borderRadius: components.cardRadius,
		marginTop: spacing.sm,
	},
	retractLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	retractNote: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		marginTop: spacing.sm,
	},
});
