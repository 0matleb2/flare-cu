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
			{/* Online / Offline pill */}
			<View
				style={[
					styles.pill,
					{
						backgroundColor: isOnline
							? `${colors.statusSafe}18`
							: `${colors.statusCaution}18`,
					},
				]}
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
				<Text
					style={[
						styles.pillText,
						{
							color: isOnline ? colors.statusSafe : colors.statusCaution,
						},
					]}
				>
					{isOnline ? "Online" : "Offline"}
				</Text>
			</View>

			{/* Location icon/text */}
			<Text
				style={[
					styles.meta,
					{ color: locationOn ? colors.textSecondary : colors.statusCaution },
				]}
			>
				{locationOn ? "📍 On" : "📍 Off"}
			</Text>

			{/* Last sync */}
			{lastSync && <Text style={styles.meta}>Synced {lastSync}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.md,
	},
	pill: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 999,
		paddingVertical: 4,
		paddingHorizontal: 10,
		gap: 6,
	},
	dot: {
		width: 6,
		height: 6,
		borderRadius: 3,
	},
	pillText: {
		fontSize: typography.chip.fontSize,
		fontWeight: typography.chip.fontWeight,
	},
	meta: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
});
