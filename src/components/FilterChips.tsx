import { ScrollView, StyleSheet } from "react-native";
import { Text, TouchableRipple } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";
import type { FeedFilter } from "../types";
import { FEED_FILTER_LABELS } from "../types";

const FILTERS: FeedFilter[] = [
	"near_me",
	"all_sgw",
	"accessibility",
	"high_tension",
	"hide_resolved",
];

interface FilterChipsProps {
	active: FeedFilter;
	onSelect: (filter: FeedFilter) => void;
}

export const FilterChips = ({ active, onSelect }: FilterChipsProps) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={styles.container}
		>
			{FILTERS.map((filter) => {
				const isActive = filter === active;
				return (
					<TouchableRipple
						key={filter}
						onPress={() => onSelect(filter)}
						borderless
						style={[
							styles.chip,
							isActive ? styles.chipActive : styles.chipInactive,
						]}
					>
						<Text
							style={[
								styles.label,
								{ color: isActive ? "#FFFFFF" : colors.textPrimary },
							]}
						>
							{FEED_FILTER_LABELS[filter]}
						</Text>
					</TouchableRipple>
				);
			})}
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingHorizontal: components.screenPaddingH,
		paddingVertical: spacing.sm,
		gap: spacing.sm,
	},
	chip: {
		borderRadius: components.chipRadius,
		paddingVertical: components.chipPaddingV,
		paddingHorizontal: components.chipPaddingH,
		minHeight: components.touchTarget,
		justifyContent: "center",
	},
	chipActive: {
		backgroundColor: colors.burgundy,
	},
	chipInactive: {
		backgroundColor: colors.surface,
		borderWidth: 1,
		borderColor: colors.border,
	},
	label: {
		fontSize: typography.chip.fontSize,
		fontWeight: typography.chip.fontWeight,
	},
});
