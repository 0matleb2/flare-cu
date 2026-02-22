import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { colors, spacing, typography } from "../theme";

interface StatusRowProps {
	isOnline: boolean;
	locationOn: boolean;
	lastSync?: string;
}

export const StatusRow = ({
	isOnline,
	locationOn,
	lastSync,
}: StatusRowProps) => {
	return (
		<View style={styles.container}>
			{/* Online / Offline status */}
			<View
				style={[styles.pill, isOnline ? styles.onlinePill : styles.offlinePill]}
			>
				<View
					style={[
						styles.dot,
						{
							backgroundColor: isOnline
								? colors.statusSafe
								: colors.statusCaution,
						},
					]}
				/>
				<Text style={styles.pillText}>{isOnline ? "Online" : "Offline"}</Text>
			</View>

			{/* Location indicator */}
			{locationOn && <Text style={styles.locationText}>📍 SGW Campus</Text>}

			{/* Last sync — only shown when offline */}
			{!isOnline && lastSync && (
				<Text style={styles.syncText}>Synced {lastSync}</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	pill: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: spacing.sm,
		paddingVertical: 4,
		borderRadius: 12,
		gap: spacing.xs,
	},
	onlinePill: {
		backgroundColor: "#E8F5E9",
	},
	offlinePill: {
		backgroundColor: "#FFF3E0",
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},
	pillText: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
		color: colors.textPrimary,
	},
	locationText: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	syncText: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
});
