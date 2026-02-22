import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";

type BannerVariant = "offline" | "location";

interface OfflineBannerProps {
	variant: BannerVariant;
	lastSyncTime?: string;
}

const BANNER_STYLES: Record<
	BannerVariant,
	{ bg: string; text: string; border: string }
> = {
	offline: {
		bg: colors.offlineBg,
		text: colors.offlineText,
		border: colors.offlineBorder,
	},
	location: {
		bg: colors.locationBg,
		text: colors.locationText,
		border: colors.locationBorder,
	},
};

const BANNER_COPY: Record<BannerVariant, (time?: string) => string> = {
	offline: (time) =>
		time
			? `Offline — showing cached updates. Last sync ${time}.`
			: "Offline — showing cached updates.",
	location: () => "Location services off — results may be limited.",
};

export const OfflineBanner = ({
	variant,
	lastSyncTime,
}: OfflineBannerProps) => {
	const style = BANNER_STYLES[variant];

	return (
		<View
			style={[
				styles.banner,
				{
					backgroundColor: style.bg,
					borderColor: style.border,
				},
			]}
		>
			<Text style={[styles.text, { color: style.text }]}>
				{BANNER_COPY[variant](lastSyncTime)}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	banner: {
		paddingVertical: spacing.sm,
		paddingHorizontal: components.screenPaddingH,
		borderBottomWidth: 1,
	},
	text: {
		fontSize: typography.caption.fontSize,
		fontWeight: typography.chip.fontWeight,
	},
});
