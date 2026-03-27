import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useState } from "react";
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

export const ReportStep3Screen = () => {
	const navigation = useNavigation<ReportStep3NavProp>();
	const route = useRoute<Step3Route>();
	const insets = useSafeAreaInsets();
	const createFlare = useCreateFlare();

	const [note, setNote] = useState("");

	const handleSubmit = useCallback(() => {
		createFlare.mutate(
			{
				category: route.params.category as FlareCategory,
				building: route.params.building,
				entrance: route.params.entrance,
				note: note || undefined,
			},
			{
				onSuccess: (newFlare) => {
					// Navigate back to feed with the new flare ID for snackbar undo
					navigation.navigate("NearbyFeed", {
						justCreatedFlareId: newFlare.id,
					});
				},
			},
		);
	}, [createFlare, route.params, note, navigation]);

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
		height: 6,
		borderRadius: 3,
		backgroundColor: colors.border,
	},
	progressDone: {
		backgroundColor: colors.burgundy,
	},
	progressCurrent: {
		backgroundColor: `${colors.burgundy}40`,
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
});
