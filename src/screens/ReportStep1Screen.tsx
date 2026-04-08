import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAccentColors } from "../hooks/useAccentColors";
import type { ReportStep1NavProp } from "../navigation/types";
import { colors, components, spacing, typography, withAlpha } from "../theme";
import type { FlareCategory } from "../types";

const TOUCH_TARGET_EXPANSION = {
	top: 8,
	right: 8,
	bottom: 8,
	left: 8,
} as const;

const CATEGORIES: {
	value: FlareCategory;
	label: string;
	icon: string;
	description: string;
}[] = [
	{
		value: "blocked_entrance",
		label: "Blocked entrance",
		icon: "🚧",
		description: "Door, gate, or entrance is blocked or locked",
	},
	{
		value: "dense_crowd",
		label: "Dense crowd",
		icon: "👥",
		description: "Large crowd causing congestion or safety concern",
	},
	{
		value: "access_restriction",
		label: "Access restriction",
		icon: "⛔",
		description: "Elevator, stairs, or area temporarily unavailable",
	},
	{
		value: "construction",
		label: "Construction",
		icon: "🏗️",
		description: "Active construction, detour required",
	},
	{
		value: "other",
		label: "Other",
		icon: "📋",
		description: "Something else that affects campus access",
	},
];

export const ReportStep1Screen = () => {
	const navigation = useNavigation<ReportStep1NavProp>();
	const insets = useSafeAreaInsets();
	const accent = useAccentColors();
	const [selected, setSelected] = useState<FlareCategory | null>(null);
	const [otherText, setOtherText] = useState("");

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
				>
					Back
				</Button>
			</View>

			<ScrollView
				style={styles.content}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
				contentContainerStyle={[
					styles.contentInner,
					{ paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.lg },
				]}
			>
				<View style={styles.progressRow}>
					<View
						style={[
							styles.progressSegment,
							{ backgroundColor: withAlpha(accent.primary, "40") },
						]}
					/>
					<View style={styles.progressSegment} />
					<View style={styles.progressSegment} />
				</View>

				<Text style={styles.title}>Raise a flare</Text>

				<View style={styles.tiles}>
					{CATEGORIES.map((cat) => {
						const isSelected = selected === cat.value;
						return (
							<TouchableOpacity
								key={cat.value}
								style={[
									styles.tile,
									isSelected && {
										borderColor: accent.primaryOutline,
										backgroundColor: withAlpha(accent.primary, "08"),
									},
								]}
								activeOpacity={0.7}
								onPress={() => setSelected(cat.value)}
								hitSlop={TOUCH_TARGET_EXPANSION}
								accessibilityRole="radio"
								accessibilityLabel={cat.label}
								accessibilityHint={cat.description}
								accessibilityState={{ selected: isSelected }}
							>
								<View style={styles.tileRow}>
									<Text style={styles.tileIcon}>{cat.icon}</Text>
									<View style={styles.tileTextGroup}>
										<Text
											style={[
												styles.tileLabel,
												isSelected && { color: accent.primary },
											]}
										>
											{cat.label}
										</Text>
										<Text style={styles.tileDescription}>
											{cat.description}
										</Text>
									</View>
									<View
										style={[
											styles.radio,
											isSelected && { borderColor: accent.primaryOutline },
										]}
									>
										{isSelected && (
											<View
												style={[
													styles.radioInner,
													{ backgroundColor: accent.primary },
												]}
											/>
										)}
									</View>
								</View>
							</TouchableOpacity>
						);
					})}
				</View>

				{selected === "other" && (
					<TextInput
						mode="outlined"
						label="What's happening?"
						value={otherText}
						onChangeText={setOtherText}
						multiline
						numberOfLines={3}
						style={styles.otherInput}
						outlineColor={colors.border}
						activeOutlineColor={accent.primary}
						placeholder="Describe what's affecting campus access..."
					/>
				)}
			</ScrollView>

			<View
				style={[
					styles.bottomBar,
					{ paddingBottom: insets.bottom + spacing.md },
				]}
			>
				<Button
					mode="contained"
					onPress={() =>
						selected &&
						navigation.navigate("ReportStep2", {
							category: selected,
							otherText:
								selected === "other"
									? otherText.trim() || undefined
									: undefined,
						})
					}
					buttonColor={accent.primary}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					disabled={!selected || (selected === "other" && !otherText.trim())}
				>
					Next
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
	content: {
		flex: 1,
	},
	contentInner: {
		paddingHorizontal: components.screenPaddingH,
		gap: spacing.sm,
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
	progressCurrent: {
		backgroundColor: `${colors.burgundy}40`,
	},

	// Category tiles
	tiles: {
		gap: spacing.sm,
	},
	tile: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: 2,
		borderColor: colors.border,
		padding: spacing.md,
	},
	tileSelected: {
		borderColor: colors.burgundy,
		backgroundColor: `${colors.burgundy}08`,
	},
	tileRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	tileIcon: {
		fontSize: 24,
	},
	tileTextGroup: {
		flex: 1,
		gap: 2,
	},
	tileLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	tileLabelSelected: {
		color: colors.burgundy,
	},
	tileDescription: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		lineHeight: 16,
	},

	// Radio indicator
	radio: {
		width: 22,
		height: 22,
		borderRadius: 11,
		borderWidth: 2,
		borderColor: colors.border,
		justifyContent: "center",
		alignItems: "center",
	},
	radioSelected: {
		borderColor: colors.burgundy,
	},
	radioInner: {
		width: 12,
		height: 12,
		borderRadius: 6,
		backgroundColor: colors.burgundy,
	},
	otherInput: {
		backgroundColor: colors.surface,
		marginTop: spacing.xs,
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
