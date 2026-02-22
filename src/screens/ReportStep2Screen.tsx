import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
	NearbyStackParamList,
	ReportStep2NavProp,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

type Step2Route = RouteProp<NearbyStackParamList, "ReportStep2">;

export const ReportStep2Screen = () => {
	const navigation = useNavigation<ReportStep2NavProp>();
	const route = useRoute<Step2Route>();
	const insets = useSafeAreaInsets();

	const [building, setBuilding] = useState("Hall Building");
	const [entrance, setEntrance] = useState("Main entrance");

	const handleNext = () => {
		navigation.navigate("ReportStep3", {
			category: route.params.category,
			building,
			entrance,
		});
	};

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
					<View style={[styles.progressSegment, styles.progressCurrent]} />
					<View style={styles.progressSegment} />
				</View>

				<Text style={styles.title}>Confirm location</Text>
				<Text style={styles.step}>Step 2 of 3 — Location</Text>

				<TextInput
					mode="outlined"
					label="Building"
					value={building}
					onChangeText={setBuilding}
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={colors.burgundy}
				/>
				<TextInput
					mode="outlined"
					label="Entrance / area"
					value={entrance}
					onChangeText={setEntrance}
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={colors.burgundy}
				/>

				<Button
					mode="contained"
					onPress={handleNext}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					disabled={!building}
				>
					Next
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
	content: {
		paddingHorizontal: components.screenPaddingH,
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
});
