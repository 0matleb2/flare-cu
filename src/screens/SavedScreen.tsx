import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlareCard } from "../components/FlareCard";
import { useFlares } from "../hooks/useFlares";
import type { NearbyFeedNavProp } from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

export const SavedScreen = () => {
	const insets = useSafeAreaInsets();
	const { data: flares = [] } = useFlares();
	const navigation = useNavigation<NearbyFeedNavProp>();

	const savedFlares = flares.filter((f) => f.savedByUser);
	const syncTime = new Date().toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	const syncDate = new Date().toLocaleDateString([], {
		month: "short",
		day: "numeric",
	});

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
			<Text style={styles.title}>Saved</Text>

			<ScrollView contentContainerStyle={styles.content}>
				{/* Saved flares */}
				<Text style={styles.sectionTitle}>
					Saved flares ({savedFlares.length})
				</Text>
				{savedFlares.length > 0 ? (
					savedFlares.map((flare) => (
						<FlareCard
							key={flare.id}
							flare={flare}
							onPress={() =>
								navigation.navigate("NearbyTab", {
									screen: "FlareDetail",
									params: { flareId: flare.id },
								})
							}
						/>
					))
				) : (
					<View style={styles.emptyCard}>
						<Text style={styles.emptyText}>No saved flares yet.</Text>
						<Text style={styles.emptyHint}>
							Tap "Save flare" on any flare detail to add it here.
						</Text>
					</View>
				)}

				{/* Offline pack */}
				<Text style={styles.sectionTitle}>Offline pack</Text>
				<View style={styles.card}>
					<View style={styles.row}>
						<Text style={styles.label}>Last sync</Text>
						<Text style={styles.value}>
							{syncDate}, {syncTime}
						</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>Cached items</Text>
						<Text style={styles.value}>{flares.length} flares</Text>
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
});
