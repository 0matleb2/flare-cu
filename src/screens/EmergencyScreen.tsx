import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CredibilityChip } from "../components/CredibilityChip";
import { useFlares } from "../hooks/useFlares";
import type {
	EmergencyUXNavProp,
	NearbyStackParamList,
} from "../navigation/types";
import { colors, components, spacing, typography } from "../theme";

type EmergencyRoute = RouteProp<NearbyStackParamList, "EmergencyUX">;

function timeAgo(ms: number): string {
	const diff = Date.now() - ms;
	const mins = Math.floor(diff / 60000);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins} min ago`;
	return `${Math.floor(mins / 60)}h ago`;
}

export const EmergencyScreen = () => {
	const route = useRoute<EmergencyRoute>();
	const navigation = useNavigation<EmergencyUXNavProp>();
	const insets = useSafeAreaInsets();
	const { data: flares = [] } = useFlares();

	const flare = flares.find((f) => f.id === route.params.flareId);

	return (
		<View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
			<View style={styles.content}>
				<Text style={styles.title}>Emergency mode</Text>
				<Text style={styles.subtitle}>You are near a disruption</Text>

				{flare && (
					<View style={styles.meta}>
						<CredibilityChip level={flare.credibility} />
						<Text style={styles.timestamp}>{timeAgo(flare.lastUpdated)}</Text>
					</View>
				)}
			</View>

			<View style={styles.actions}>
				<Button
					mode="contained"
					buttonColor={colors.burgundy}
					textColor="#FFFFFF"
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={styles.button}
				>
					Avoid this area
				</Button>
				<Button
					mode="outlined"
					textColor={colors.burgundy}
					labelStyle={styles.buttonLabel}
					contentStyle={styles.buttonContent}
					style={[styles.button, styles.outlineButton]}
				>
					Recheck
				</Button>
				<Button
					mode="text"
					textColor={colors.textSecondary}
					onPress={() => {
						if (flare) {
							navigation.navigate("FlareDetail", { flareId: flare.id });
						}
					}}
					labelStyle={styles.detailsLabel}
				>
					View details
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
		justifyContent: "space-between",
		paddingBottom: spacing.xl,
	},
	content: {
		gap: spacing.sm,
	},
	title: {
		fontSize: 28,
		fontWeight: "700",
		color: colors.textPrimary,
	},
	subtitle: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	meta: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
		marginTop: spacing.md,
	},
	timestamp: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	actions: {
		gap: spacing.md,
	},
	button: {
		borderRadius: components.cardRadius,
	},
	outlineButton: {
		borderColor: colors.burgundy,
	},
	buttonContent: {
		minHeight: components.touchTarget,
	},
	buttonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	detailsLabel: {
		fontSize: typography.caption.fontSize,
	},
});
