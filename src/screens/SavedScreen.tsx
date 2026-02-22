import { ScrollView, StyleSheet, View } from "react-native";
import { Divider, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components, spacing, typography } from "../theme";

export const SavedScreen = () => {
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Saved</Text>

			<ScrollView contentContainerStyle={styles.content}>
				{/* Saved flares section */}
				<Text style={styles.sectionTitle}>Saved flares</Text>
				<View style={styles.emptyCard}>
					<Text style={styles.emptyText}>No saved flares yet.</Text>
					<Text style={styles.emptyHint}>
						Tap "Save flare" on any flare detail to add it here.
					</Text>
				</View>

				<Divider style={styles.divider} />

				{/* Saved routes section */}
				<Text style={styles.sectionTitle}>Saved routes</Text>
				<View style={styles.emptyCard}>
					<Text style={styles.emptyText}>No saved routes yet.</Text>
					<Text style={styles.emptyHint}>
						Save a route from the Route tab to access it offline.
					</Text>
				</View>

				<Divider style={styles.divider} />

				{/* Offline pack status */}
				<Text style={styles.sectionTitle}>Offline pack</Text>
				<View style={styles.card}>
					<View style={styles.row}>
						<Text style={styles.label}>Last sync</Text>
						<Text style={styles.value}>Today, 10:42 AM</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Cached items</Text>
						<Text style={styles.value}>12 flares</Text>
					</View>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.background,
		paddingHorizontal: components.screenPaddingH,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.lg,
	},
	content: {
		paddingBottom: spacing.xl,
		gap: spacing.md,
	},
	sectionTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	card: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	emptyCard: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: spacing.lg,
		alignItems: "center",
		gap: spacing.xs,
	},
	emptyText: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	emptyHint: {
		fontSize: typography.caption.fontSize,
		color: colors.textDisabled,
		textAlign: "center",
	},
	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	label: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	value: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	divider: {
		backgroundColor: colors.border,
		marginVertical: spacing.sm,
	},
});
