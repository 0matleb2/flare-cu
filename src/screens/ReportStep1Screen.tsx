import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Text, TouchableRipple } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ReportStep1NavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";
import type { FlareCategory } from "../types";
import { CATEGORY_LABELS } from "../types";

const CATEGORIES: FlareCategory[] = [
	"blocked_entrance",
	"dense_crowd",
	"access_restriction",
	"construction",
	"other",
];

export const ReportStep1Screen = () => {
	const navigation = useNavigation<ReportStep1NavProp>();
	const insets = useSafeAreaInsets();

	const handleSelect = (category: FlareCategory) => {
		navigation.navigate("ReportStep2", { category });
	};

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
				<Text style={styles.title}>Report a flare</Text>
				<Text style={styles.step}>Step 1 of 3 — Category</Text>

				<View style={styles.tiles}>
					{CATEGORIES.map((cat) => (
						<TouchableRipple
							key={cat}
							onPress={() => handleSelect(cat)}
							borderless
							style={styles.tile}
						>
							<Text style={styles.tileLabel}>{CATEGORY_LABELS[cat]}</Text>
						</TouchableRipple>
					))}
				</View>
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
	tiles: {
		gap: spacing.md,
	},
	tile: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		minHeight: components.touchTarget,
		justifyContent: "center",
	},
	tileLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
});
