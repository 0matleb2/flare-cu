import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type {
	NearbyStackParamList,
	ReportStep2NavProp,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

type Step2Route = RouteProp<NearbyStackParamList, "ReportStep2">;

const SGW_BUILDINGS = [
	"Hall Building",
	"EV Building",
	"LB Building",
	"GM Building",
	"MB Building",
	"CL Building",
	"ER Building",
	"FG Building",
];

export const ReportStep2Screen = () => {
	const navigation = useNavigation<ReportStep2NavProp>();
	const route = useRoute<Step2Route>();
	const insets = useSafeAreaInsets();

	const [building, setBuilding] = useState("");
	const [entrance, setEntrance] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);

	const filteredBuildings = SGW_BUILDINGS.filter((b) =>
		b.toLowerCase().includes(building.toLowerCase()),
	);

	const handleNext = () => {
		navigation.navigate("ReportStep3", {
			category: route.params.category,
			building: building || "SGW Campus",
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

			<ScrollView
				style={styles.scrollArea}
				contentContainerStyle={styles.content}
				keyboardShouldPersistTaps="handled"
			>
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
					onChangeText={(text) => {
						setBuilding(text);
						setShowSuggestions(text.length > 0);
					}}
					onFocus={() => setShowSuggestions(building.length > 0)}
					onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={colors.burgundy}
					placeholder="e.g. Hall Building"
				/>

				{/* Building suggestions */}
				{showSuggestions && filteredBuildings.length > 0 && (
					<View style={styles.suggestions}>
						{filteredBuildings.map((b) => (
							<TouchableOpacity
								key={b}
								style={styles.suggestionItem}
								onPress={() => {
									setBuilding(b);
									setShowSuggestions(false);
								}}
							>
								<Text style={styles.suggestionText}>{b}</Text>
							</TouchableOpacity>
						))}
					</View>
				)}

				{/* Quick building chips */}
				{!building && (
					<View style={styles.quickChips}>
						<Text style={styles.quickLabel}>Quick select</Text>
						<View style={styles.chipRow}>
							{SGW_BUILDINGS.slice(0, 4).map((b) => (
								<TouchableOpacity
									key={b}
									style={styles.chip}
									onPress={() => {
										setBuilding(b);
										setShowSuggestions(false);
									}}
								>
									<Text style={styles.chipText}>
										{b.replace(" Building", "")}
									</Text>
								</TouchableOpacity>
							))}
						</View>
						<View style={styles.chipRow}>
							{SGW_BUILDINGS.slice(4).map((b) => (
								<TouchableOpacity
									key={b}
									style={styles.chip}
									onPress={() => {
										setBuilding(b);
										setShowSuggestions(false);
									}}
								>
									<Text style={styles.chipText}>
										{b.replace(" Building", "")}
									</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				)}

				<TextInput
					mode="outlined"
					label="Entrance / area (optional)"
					value={entrance}
					onChangeText={setEntrance}
					style={styles.input}
					outlineColor={colors.border}
					activeOutlineColor={colors.burgundy}
					placeholder="e.g. Main entrance, Floor 2"
				/>
			</ScrollView>

			{/* Next button at bottom */}
			<View
				style={[
					styles.bottomBar,
					{ paddingBottom: insets.bottom + spacing.md },
				]}
			>
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

	// Suggestions dropdown
	suggestions: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 1,
		borderColor: colors.border,
		marginTop: -spacing.sm,
		overflow: "hidden",
	},
	suggestionItem: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.sm,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	suggestionText: {
		fontSize: typography.body.fontSize,
		color: colors.textPrimary,
	},

	// Quick building chips
	quickChips: {
		gap: spacing.xs,
	},
	quickLabel: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.textSecondary,
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	chipRow: {
		flexDirection: "row",
		gap: spacing.xs,
	},
	chip: {
		backgroundColor: colors.surface,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: colors.border,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
	},
	chipText: {
		fontSize: typography.caption.fontSize,
		color: colors.textPrimary,
		fontWeight: "600",
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
