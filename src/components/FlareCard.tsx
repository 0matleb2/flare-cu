import { StyleSheet, View } from "react-native";
import { Card, Chip, Text, useTheme } from "react-native-paper";
import { useConfirmFlare } from "../hooks/useFlares";
import type { Flare } from "../types";

interface FlareCardProps {
	flare: Flare;
}

export const FlareCard = ({ flare }: FlareCardProps) => {
	const theme = useTheme();
	const confirmFlare = useConfirmFlare();

	return (
		<Card style={styles.card} mode="elevated">
			<Card.Content>
				<View style={styles.header}>
					<Chip
						icon="alert-circle-outline"
						style={[styles.chip, { borderColor: theme.colors.outline }]}
						textStyle={{
							fontSize: 12,
							lineHeight: 12,
							color: theme.colors.primary,
						}}
						compact
					>
						{flare.type.toUpperCase()}
					</Chip>
					<Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
						{new Date(flare.timestamp).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
					</Text>
				</View>
				<Text variant="titleMedium">{flare.location}</Text>
				<Text variant="bodyMedium">{flare.description}</Text>
			</Card.Content>
			<Card.Actions>
				<Chip
					icon="check"
					onPress={() => confirmFlare.mutate(flare.id)}
					mode="outlined"
					disabled={confirmFlare.isPending}
				>
					{flare.confirmations} Confirmed
				</Chip>
			</Card.Actions>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		marginBottom: 16,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	chip: {
		backgroundColor: "transparent",
		borderWidth: 1,
		height: 28,
	},
});
