import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ReportStep1NavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { FlareCategory } from "../types";

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
	const [selected, setSelected] = useState<FlareCategory | null>(null);

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			{/* Header */}
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
					<View style={[styles.progressSegment, styles.progressCurrent]} />
					<View style={styles.progressSegment} />
					<View style={styles.progressSegment} />
				</View>

				<Text style={styles.title}>Raise a flare</Text>
				<Text style={styles.step}>Step 1 of 3 — Category</Text>

				{/* Category radio cards */}
				<View style={styles.tiles}>
					{CATEGORIES.map((cat) => {
						const isSelected = selected === cat.value;
						return (
							<TouchableOpacity
								key={cat.value}
								style={[styles.tile, isSelected && styles.tileSelected]}
								activeOpacity={0.7}
								onPress={() => setSelected(cat.value)}
							>
								<View style={styles.tileRow}>
									<Text style={styles.tileIcon}>{cat.icon}</Text>
									<View style={styles.tileTextGroup}>
										<Text
											style={[
												styles.tileLabel,
												isSelected && styles.tileLabelSelected,
											]}
										>
											{cat.label}
										</Text>
										<Text style={styles.tileDescription}>
											{cat.description}
										</Text>
									</View>
									<View
										style={[styles.radio, isSelected && styles.radioSelected]}
									>
										{isSelected && <View style={styles.radioInner} />}
									</View>
								</View>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>

			{/* Next button at bottom */}
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
						navigation.navigate("ReportStep2", { category: selected })
					}
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
					disabled={!selected}
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
		flex: 1,
		paddingHorizontal: components.screenPaddingH,
		gap: spacing.sm,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	step: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
		marginBottom: spacing.md,
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
	progressCurrent: {
		backgroundColor: colors.burgundy,
		opacity: 0.5,
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
