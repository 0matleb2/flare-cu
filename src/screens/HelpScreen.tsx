import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, List, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ZonePromptModal } from "../components/ZonePromptModal";
import { useEmergency } from "../context/EmergencyContext";
import { colors, components, spacing, typography } from "../theme";

const SECTIONS = [
	{
		title: "Getting Started with Flare CU",
		body: "Flare CU is a community-driven campus safety app for Concordia SGW. It helps students report and view disruptions, navigate around obstacles safely, and receive calm, actionable guidance during high-tension events without causing panic.",
	},
	{
		title: "Reporting a Campus Disruption",
		body: "1. Tap the 'Raise a flare' button on the Campus feed.\n2. Choose a category (e.g., Blocked entrance, Dense crowd).\n3. Confirm your location. The app tries to match your nearest SGW location. If indoor GPS is weak, it falls back to MB Building, and you can search manually.\n4. Add an optional note (up to 140 characters) to provide more context.\n5. Tap Raise flare. A short undo prompt appears on the Campus feed in case you made a mistake.",
	},
	{
		title: "Confirming & Upvoting Flares",
		body: "If you see a disruption that someone else has reported, you can confirm it by tapping the upvote arrow on the flare's detail screen after signing in. Guest mode can still view reports, routes, and emergency guidance, but confirmations are reserved for signed-in users. Once a flare receives enough student confirmations (10 upvotes), its credibility automatically upgrades from 'Reported' to 'Confirmed'.",
	},
	{
		title: "Understanding Credibility Labels",
		body: "Every flare has a credibility label to help you judge its trustworthiness:\n\n• Reported: A student submitted this flare. (Yellow)\n• Confirmed: Multiple students have validated it via upvotes. (Blue)\n• Verified: Campus authorities or security have officially confirmed the disruption. (Green)\n• Resolved: The issue has been cleared and the area is safe. (Gray)",
	},
	{
		title: "Why can't I see some flares?",
		body: "If flares seem to be missing from your Campus feed, check your settings:\n\n• Alert Intensity: If set to 'Low', the app will hide 'Reported' (unconfirmed) flares to reduce noise.\n• Offline Mode: If you have no connection, you will only see cached flares until you reconnect.\n• Low Stimulation: This mode doesn't hide flares, but it mutes their colors and collapses extra details to prevent visual overwhelm.",
	},
	{
		title: "Using Offline Mode",
		body: "Flare CU is designed to work even if you lose Wi-Fi or cellular data in campus basements or tunnels.\n\nWhen Offline mode is active, the app uses locally stored data. You can still view recently cached reports and submit new ones. New reports are saved on this device and queued. They sync automatically when you return to live mode or reopen the feed with an active connection.",
	},
	{
		title: "Route Guidance & Rerouting",
		body: "The Route tab helps you navigate the SGW campus safely. You can customize your route based on your needs:\n\n• Avoid High Tension: Reroutes you around active dense crowds, protests, and restricted areas.\n• Mobility-friendly: Keeps you on accessible paths, prioritizing elevators, ramps, curb cuts, and level entrances.",
	},
	{
		title: "Emergency Mode",
		body: "Emergency Mode provides simplified, step-by-step directions to a safe location during severe disruptions. You can enter it from the Emergency button on the Campus feed or from a high-severity flare's detail screen.\n\nWhile in Emergency Mode, visual clutter is reduced and you can access quick actions to raise a report while moving. You can exit at any time through the protected 'I'm safe — exit emergency mode' action.",
	},
	{
		title: "Location Auto-Detection Issues",
		body: "Indoor GPS on campus can sometimes be inaccurate. If Flare CU suggests the wrong location when you're raising a report, use the Step 2 search field to select the correct SGW location manually.",
	},
	{
		title: "Zone of Interest Alerts",
		body: "Zone of interest alerts are lightweight route prompts that appear when your current step moves near an active flare. They are optional per trip, and students using Low stimulation will only see the yellow in-step warning instead of the prompt. You can preview the backup zone alert flow below.",
		previewZoneAlert: true,
	},
];

export const HelpScreen = () => {
	const navigation = useNavigation();
	const insets = useSafeAreaInsets();
	const { activate: activateEmergency } = useEmergency();
	const [expandedId, setExpandedId] = useState<string | null>(
		SECTIONS[0].title,
	);
	const [zonePromptVisible, setZonePromptVisible] = useState(false);

	const handlePress = (id: string) => {
		setExpandedId((prev) => (prev === id ? null : id));
	};

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

				<View style={styles.accordionGroup}>
					{SECTIONS.map((section) => (
						<List.Accordion
							key={section.title}
							title={section.title}
							expanded={expandedId === section.title}
							onPress={() => handlePress(section.title)}
							titleStyle={styles.accordionTitle}
							style={[
								styles.accordionHeader,
								expandedId === section.title && styles.accordionHeaderExpanded,
							]}
							right={(props) => (
								<List.Icon
									{...props}
									icon={
										expandedId === section.title ? "chevron-up" : "chevron-down"
									}
									color={colors.textSecondary}
								/>
							)}
						>
							<View style={styles.accordionBody}>
								<Text style={styles.bodyText}>{section.body}</Text>
								{section.previewZoneAlert && (
									<Button
										mode="outlined"
										icon="map-marker-alert-outline"
										onPress={() => setZonePromptVisible(true)}
										textColor={colors.statusCaution}
										style={styles.previewButton}
										labelStyle={styles.previewButtonLabel}
										contentStyle={styles.previewButtonContent}
									>
										Preview zone alert
									</Button>
								)}
							</View>
						</List.Accordion>
					))}
				</View>
			</ScrollView>
			<ZonePromptModal
				visible={zonePromptVisible}
				flare={{
					id: "preview",
					category: "access_restriction",
					severity: "high",
					summary: "Tunnel between Hall and EV closed for maintenance.",
					location: "Hall Building, Tunnel Level",
					building: "Hall Building",
					credibility: "verified",
					timestamp: Date.now(),
					lastUpdated: Date.now(),
					timeline: [],
					savedByUser: false,
					upvotes: 0,
					upvotedByUser: false,
					downvotedByUser: false,
				}}
				onDismiss={() => setZonePromptVisible(false)}
				onRemindLater={() => setZonePromptVisible(false)}
				onViewGuidance={() => {
					setZonePromptVisible(false);
					activateEmergency({
						source: "zone",
						category: "access_restriction",
						location: "Hall Building, Tunnel Level",
						building: "Hall Building",
					});
				}}
			/>
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
		gap: spacing.sm,
	},
	title: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
		marginBottom: spacing.xs,
	},
	accordionGroup: {
		borderRadius: components.cardRadius,
		overflow: "hidden",
		borderWidth: components.cardBorderWidth,
		borderColor: colors.border,
	},
	accordionHeader: {
		backgroundColor: colors.surface,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
		paddingVertical: 2,
	},
	accordionHeaderExpanded: {
		backgroundColor: colors.surface,
	},
	accordionTitle: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.h2.fontWeight,
		color: colors.textPrimary,
	},
	accordionBody: {
		backgroundColor: colors.surface,
		paddingHorizontal: spacing.lg,
		paddingTop: 0,
		paddingBottom: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	bodyText: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		lineHeight: 20,
	},
	previewButton: {
		marginTop: spacing.md,
		alignSelf: "flex-start",
		borderColor: colors.statusCaution,
	},
	previewButtonContent: {
		minHeight: components.touchTarget,
	},
	previewButtonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
});
