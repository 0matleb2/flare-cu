import { useNavigation } from "@react-navigation/native";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, components, spacing, typography } from "../theme";

const SECTIONS = [
	{
		title: "What is Flare CU?",
		body: "Flare CU is a community-driven campus safety app for Concordia SGW. Students report and view disruptions, route around obstacles, and receive calm, actionable guidance — without alarm or panic.",
	},
	{
		title: "Flare credibility labels",
		body: "Each flare progresses through four stages:\n\n• Reported — A student submitted this flare.\n• Confirmed — Multiple students have validated it.\n• Verified (official) — Campus authorities confirmed it.\n• Resolved — The issue has been cleared.\n\nLabels appear on every flare to help you judge trustworthiness quickly.",
	},
	{
		title: "How to report a flare",
		body: "1. Tap the + Report button on the Nearby feed.\n2. Pick a category (blocked entrance, dense crowd, etc.).\n3. Confirm or edit the auto-detected location.\n4. Add an optional note (140 characters max).\n5. Submit. You can retract within 2 minutes if you change your mind.",
	},
	{
		title: "Route guidance",
		body: "The Route tab helps you navigate campus safely. Enter a destination, toggle preferences (avoid high tension areas, mobility-friendly, low stimulation), and choose from ranked route options.\n\nRoutes are ordered based on your preferences — if you have mobility-friendly guidance enabled, accessible routes appear first.",
	},
	{
		title: "Emergency UX",
		body: "When a high-severity disruption is nearby, you can enter Emergency mode for simplified step-by-step directions. Emergency mode also lets you raise a report while navigating to safety.",
	},
	{
		title: "Offline mode",
		body: "When you toggle off 'Offline caching' in Settings, the app simulates being offline. Recent flares and zone status are cached locally. Reports made offline are queued and sync when you reconnect.",
	},
	{
		title: "Settings explained",
		body: "• Alert intensity: Low hides unconfirmed (reported-only) flares on the feed. Medium shows everything.\n\n• Notification radius: Near me shows flares in your immediate area. SGW wide shows the full campus.\n\n• Mobility-friendly: Prioritizes routes with ramps, elevators, and level pathways.\n\n• Low stimulation: Removes animations and simplifies alert presentation.\n\n• Offline caching: When off, the app works in offline mode with cached data.",
	},
	{
		title: "Campus coverage",
		body: "Flare CU covers the entire SGW (Sir George Williams) campus — all buildings and surrounding environs including sidewalks, streets, and common areas. Protests, crowds, construction, and other disruptions in the area are all within scope.",
	},
];

export const HelpScreen = () => {
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
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

			<ScrollView contentContainerStyle={styles.content}>
				<Text style={styles.title}>Help & Documentation</Text>

				{SECTIONS.map((section) => (
					<View key={section.title} style={styles.card}>
						<Text style={styles.cardTitle}>{section.title}</Text>
						<Text style={styles.cardBody}>{section.body}</Text>
					</View>
				))}
			</ScrollView>
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
		paddingBottom: spacing.xl,
		gap: components.cardGap,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.sm,
	},
	card: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
		padding: components.cardPadding,
		gap: spacing.sm,
	},
	cardTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	cardBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
});
