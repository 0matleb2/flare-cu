import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import {
	Button,
	HelperText,
	SegmentedButtons,
	Text,
	TextInput,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAccentColors } from "../hooks/useAccentColors";
import { useCreateFlare } from "../hooks/useFlares";
import type {
	NearbyStackParamList,
	ReportStep3NavProp,
} from "../navigation/types";
import { colors, components, spacing, typography, withAlpha } from "../theme";
import type { FlareSeverity } from "../types";

type Step3Route = RouteProp<NearbyStackParamList, "ReportStep3">;

export const ReportStep3Screen = () => {
	const navigation = useNavigation<ReportStep3NavProp>();
	const route = useRoute<Step3Route>();
	const insets = useSafeAreaInsets();
	const createFlare = useCreateFlare();
	const accent = useAccentColors();

	const [note, setNote] = useState("");
	const [severity, setSeverity] = useState<FlareSeverity>(
		route.params.severity ?? "medium",
	);
	const submitError =
		createFlare.error instanceof Error
			? createFlare.error.message
			: "Couldn't raise flare. Try again.";

	const handleSubmit = useCallback(() => {
		createFlare.mutate(
			{
				category: route.params.category,
				otherText: route.params.otherText,
				locationId: route.params.locationId,
				building: route.params.building,
				entrance: route.params.entrance,
				severity,
				note: note || undefined,
			},
			{
				onSuccess: (newFlare) => {
					navigation.navigate("NearbyFeed", {
						justCreatedFlareId: newFlare.id,
						submissionMode:
							newFlare.syncStatus === "queued" ? "queued" : "live",
					});
				},
			},
		);
	}, [createFlare, route.params, severity, note, navigation]);

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
		>
			<View style={[styles.header, { paddingTop: insets.top }]}>
				<Button
					icon="arrow-left"
					onPress={() => navigation.goBack()}
					textColor={colors.textPrimary}
					compact
					disabled={createFlare.isPending}
				>
					Back
				</Button>
			</View>

			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={[
					styles.content,
					{ paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.lg },
				]}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
			>
				{/* Progress bar */}
				<View style={styles.progressRow}>
					<View
						style={[
							styles.progressSegment,
							{ backgroundColor: accent.primary },
						]}
					/>
					<View
						style={[
							styles.progressSegment,
							{ backgroundColor: accent.primary },
						]}
					/>
					<View
						style={[
							styles.progressSegment,
							{ backgroundColor: withAlpha(accent.primary, "40") },
						]}
					/>
				</View>

				<Text style={styles.title}>Add a note</Text>
				<View style={styles.locationCard}>
					<Text style={styles.locationLabel}>Location</Text>
					<Text style={styles.locationValue}>{route.params.locationLabel}</Text>
				</View>
				<View style={styles.severitySection}>
					<Text style={styles.severityLabel}>Severity</Text>
					<SegmentedButtons
						value={severity}
						onValueChange={(value) => setSeverity(value as FlareSeverity)}
						buttons={[
							{ value: "low", label: "Low" },
							{ value: "medium", label: "Medium" },
							{ value: "high", label: "High" },
						]}
					/>
				</View>

				<TextInput
					mode="outlined"
					label="What's happening? (optional)"
					value={note}
					onChangeText={(text) => setNote(text.slice(0, 140))}
					multiline
					numberOfLines={3}
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={accent.primary}
					right={<TextInput.Affix text={`${note.length}/140`} />}
					editable={!createFlare.isPending}
				/>
				{!!createFlare.error && (
					<HelperText type="error" visible>
						{submitError}
					</HelperText>
				)}
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
					buttonColor={accent.primary}
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
		</KeyboardAvoidingView>
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
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	progressRow: {
		flexDirection: "row",
		gap: 4,
	},
	progressSegment: {
		flex: 1,
		height: 6,
		borderRadius: 3,
		backgroundColor: colors.border,
	},
	progressDone: {},
	progressCurrent: {},
	input: {
		backgroundColor: colors.surface,
	},
	locationCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.md,
		gap: 4,
	},
	locationLabel: {
		fontSize: 12,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 0.8,
	},
	locationValue: {
		fontSize: typography.body.fontSize,
		fontWeight: "600",
		color: colors.textPrimary,
	},
	severitySection: {
		gap: spacing.xs,
	},
	severityLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
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
});
