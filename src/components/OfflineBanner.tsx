import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { colors, components, spacing, typography } from "../theme";

type BannerVariant = "offline" | "location";

interface OfflineBannerProps {
	variant: BannerVariant;
	lastSyncTime?: string;
	queueCount?: number;
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

const BANNER_COPY: Record<
	BannerVariant,
	(time?: string, queueCount?: number) => string
> = {
	offline: (time, queueCount) => {
		const queueText = queueCount
			? ` ${queueCount} report${queueCount === 1 ? "" : "s"} waiting to sync on this device.`
			: "";
		return time
			? `Offline — showing cached campus reports. Last sync: ${time}.${queueText}`
			: `Offline — showing cached campus reports.${queueText}`;
	},
	location: () => "Location services off — results may be limited.",
};

export const OfflineBanner = ({
	variant,
	lastSyncTime,
	queueCount,
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
				{BANNER_COPY[variant](lastSyncTime, queueCount)}
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
