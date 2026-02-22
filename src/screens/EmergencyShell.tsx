import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useState } from "react";
import { Alert, Linking, ScrollView, StyleSheet, View } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CredibilityChip } from "../components/CredibilityChip";
import { useEmergency } from "../context/EmergencyContext";
import { useCreateFlare } from "../hooks/useFlares";
import { colors, components, spacing, typography } from "../theme";
import type { FlareCategory } from "../types";
import { EmergencySafeRouteTab } from "./emergency/EmergencySafeRouteTab";
import { EmergencyStepsTab } from "./emergency/EmergencyStepsTab";
import { EmergencyUpdatesTab } from "./emergency/EmergencyUpdatesTab";

const CAMPUS_SECURITY = "514-848-3717";

const Tab = createMaterialTopTabNavigator();

// Quick report categories
const QUICK_CATS: { value: FlareCategory; label: string }[] = [
	{ value: "blocked_entrance", label: "Blocked entrance" },
	{ value: "dense_crowd", label: "Dense crowd" },
	{ value: "access_restriction", label: "Restriction" },
	{ value: "other", label: "Other" },
];

export const EmergencyShell = () => {
	const insets = useSafeAreaInsets();
	const { trigger, deactivate } = useEmergency();
	const createFlare = useCreateFlare();

	// Quick report state
	const [reportVisible, setReportVisible] = useState(false);
	const [reportCat, setReportCat] = useState<FlareCategory>("other");
	const [reportNote, setReportNote] = useState("");
	const [reportDone, setReportDone] = useState(false);

	// Safe exit confirmation
	const [showSafeConfirm, setShowSafeConfirm] = useState(false);

	const handleCallSecurity = () => {
		const url = `tel:${CAMPUS_SECURITY}`;
		Linking.canOpenURL(url).then((ok) => {
			if (ok) {
				Linking.openURL(url);
			} else {
				Alert.alert(
					"Campus Security",
					`Call ${CAMPUS_SECURITY}\n\nIf calling is unavailable, go to the nearest security desk in Hall, EV, or LB Building.`,
				);
			}
		});
	};

	const handleCall911 = () => {
		const url = "tel:911";
		Linking.canOpenURL(url).then((ok) => {
			if (ok) {
				Linking.openURL(url);
			} else {
				Alert.alert("Emergency", "Call 911 from the nearest phone.");
			}
		});
	};

	const handleQuickReport = () => {
		createFlare.mutate(
			{
				category: reportCat,
				building: trigger?.building ?? trigger?.flare?.building ?? "SGW Campus",
				entrance: trigger?.flare?.entrance,
				note: reportNote || undefined,
			},
			{ onSuccess: () => setReportDone(true) },
		);
	};

	const handleExit = () => {
		setShowSafeConfirm(true);
	};

	return (
		<View style={[styles.shell, { paddingTop: insets.top }]}>
			{/* ═══ Persistent top banner ═══ */}
			<View style={styles.banner}>
				<View style={styles.bannerLeft}>
					<View style={styles.emergencyDot} />
					<Text style={styles.bannerTitle}>Emergency mode</Text>
				</View>
				<Button
					mode="text"
					onPress={handleExit}
					textColor="#FFFFFF"
					compact
					labelStyle={styles.exitLabel}
				>
					Exit ✕
				</Button>
			</View>

			{/* Flare context strip (if triggered from flare) */}
			{trigger?.flare && (
				<View style={styles.contextStrip}>
					<CredibilityChip level={trigger.flare.credibility} />
					<Text style={styles.contextText} numberOfLines={1}>
						{trigger.flare.summary}
					</Text>
				</View>
			)}

			{/* ═══ Emergency tab navigator ═══ */}
			<Tab.Navigator
				screenOptions={{
					tabBarStyle: styles.tabBar,
					tabBarLabelStyle: styles.tabLabel,
					tabBarActiveTintColor: colors.burgundy,
					tabBarInactiveTintColor: colors.textSecondary,
					tabBarIndicatorStyle: styles.tabIndicator,
				}}
			>
				<Tab.Screen name="Steps">
					{() => (
						<View style={styles.tabContent}>
							<EmergencyStepsTab />
						</View>
					)}
				</Tab.Screen>
				<Tab.Screen name="Safe route">
					{() => (
						<View style={styles.tabContent}>
							<EmergencySafeRouteTab />
						</View>
					)}
				</Tab.Screen>
				<Tab.Screen name="Updates">
					{() => (
						<ScrollView
							style={styles.tabScrollContent}
							contentContainerStyle={styles.tabScrollInner}
						>
							<EmergencyUpdatesTab />
						</ScrollView>
					)}
				</Tab.Screen>
			</Tab.Navigator>

			{/* ═══ Persistent bottom call bar ═══ */}
			<View
				style={[
					styles.bottomBar,
					{ paddingBottom: insets.bottom + spacing.sm },
				]}
			>
				<View style={styles.callRow}>
					<Button
						mode="outlined"
						onPress={handleCallSecurity}
						textColor="#1B5E20"
						icon="phone"
						style={[styles.callButton, styles.callSecurity]}
						labelStyle={styles.callLabel}
						contentStyle={styles.callContent}
					>
						Campus security
					</Button>
					<Button
						mode="outlined"
						onPress={handleCall911}
						textColor="#D32F2F"
						icon="phone"
						style={[styles.callButton, styles.call911]}
						labelStyle={styles.callLabel}
						contentStyle={styles.callContent}
					>
						911
					</Button>
				</View>
				<Button
					mode="text"
					onPress={() => {
						setReportDone(false);
						setReportNote("");
						setReportVisible(true);
					}}
					textColor={colors.burgundy}
					compact
					labelStyle={styles.quickReportLabel}
				>
					Quick report
				</Button>
			</View>

			{/* ═══ "I'm safe" confirmation modal ═══ */}
			<Portal>
				<Modal
					visible={showSafeConfirm}
					onDismiss={() => setShowSafeConfirm(false)}
					contentContainerStyle={styles.modalContainer}
				>
					<Text style={styles.modalTitle}>Are you safe?</Text>
					<Text style={styles.modalBody}>
						Exiting emergency mode will return you to the main app.
					</Text>
					<Button
						mode="contained"
						onPress={() => {
							setShowSafeConfirm(false);
							deactivate();
						}}
						buttonColor={colors.statusSafe}
						textColor="#FFFFFF"
						style={styles.modalButton}
						labelStyle={styles.modalButtonLabel}
						contentStyle={styles.modalButtonContent}
					>
						I'm safe — exit
					</Button>
					<Button
						mode="text"
						onPress={() => setShowSafeConfirm(false)}
						textColor={colors.textSecondary}
						labelStyle={styles.modalCancelLabel}
					>
						Stay in emergency mode
					</Button>
				</Modal>
			</Portal>

			{/* ═══ Quick Report modal ═══ */}
			<Portal>
				<Modal
					visible={reportVisible}
					onDismiss={() => setReportVisible(false)}
					contentContainerStyle={styles.modalContainer}
				>
					{reportDone ? (
						<View style={styles.reportDone}>
							<Text style={styles.reportDoneTitle}>Reported</Text>
							<Text style={styles.reportDoneBody}>
								Thank you. Your report helps others stay safe.
							</Text>
							<Button
								mode="contained"
								onPress={() => setReportVisible(false)}
								buttonColor={colors.burgundy}
								textColor="#FFFFFF"
								style={styles.modalButton}
								labelStyle={styles.modalButtonLabel}
							>
								Back to emergency
							</Button>
						</View>
					) : (
						<>
							<Text style={styles.modalTitle}>Quick report</Text>
							<Text style={styles.reportHint}>
								Location:{" "}
								{trigger?.flare?.location ?? "SGW Campus (auto-detected)"}
							</Text>

							<View style={styles.categoryRow}>
								{QUICK_CATS.map((c) => (
									<Button
										key={c.value}
										mode={reportCat === c.value ? "contained" : "outlined"}
										onPress={() => setReportCat(c.value)}
										buttonColor={
											reportCat === c.value ? colors.burgundy : undefined
										}
										textColor={
											reportCat === c.value ? "#FFFFFF" : colors.textPrimary
										}
										compact
										style={styles.catChip}
										labelStyle={styles.catLabel}
									>
										{c.label}
									</Button>
								))}
							</View>

							<TextInput
								mode="outlined"
								label="Note (optional)"
								value={reportNote}
								onChangeText={(t) => setReportNote(t.slice(0, 140))}
								style={styles.noteInput}
								outlineColor={colors.border}
								activeOutlineColor={colors.burgundy}
								multiline
							/>

							<Button
								mode="contained"
								onPress={handleQuickReport}
								buttonColor={colors.burgundy}
								textColor="#FFFFFF"
								loading={createFlare.isPending}
								disabled={createFlare.isPending}
								style={styles.modalButton}
								labelStyle={styles.modalButtonLabel}
								contentStyle={styles.modalButtonContent}
							>
								Submit
							</Button>
						</>
					)}
				</Modal>
			</Portal>
		</View>
	);
};

const styles = StyleSheet.create({
	shell: {
		flex: 1,
		backgroundColor: colors.background,
	},

	// Banner
	banner: {
		backgroundColor: "#B71C1C",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: components.screenPaddingH,
		paddingVertical: spacing.sm,
	},
	bannerLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	emergencyDot: {
		width: 10,
		height: 10,
		borderRadius: 5,
		backgroundColor: "#FFFFFF",
	},
	bannerTitle: {
		fontSize: typography.h2.fontSize,
		fontWeight: "700",
		color: "#FFFFFF",
	},
	exitLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},

	// Context strip
	contextStrip: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
		backgroundColor: colors.surface,
		paddingHorizontal: components.screenPaddingH,
		paddingVertical: spacing.xs,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	contextText: {
		flex: 1,
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},

	// Tab bar
	tabBar: {
		backgroundColor: colors.surface,
		elevation: 0,
		shadowOpacity: 0,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
	},
	tabLabel: {
		fontSize: 13,
		fontWeight: "600",
		textTransform: "none",
	},
	tabIndicator: {
		backgroundColor: colors.burgundy,
		height: 3,
	},

	// Tab content
	tabContent: {
		flex: 1,
		backgroundColor: colors.background,
		padding: components.screenPaddingH,
		paddingTop: spacing.md,
	},
	tabScrollContent: {
		flex: 1,
		backgroundColor: colors.background,
	},
	tabScrollInner: {
		padding: components.screenPaddingH,
		paddingTop: spacing.md,
		paddingBottom: spacing.lg,
	},

	// Bottom bar
	bottomBar: {
		backgroundColor: colors.surface,
		borderTopWidth: 1,
		borderTopColor: colors.border,
		paddingHorizontal: components.screenPaddingH,
		paddingTop: spacing.sm,
		gap: spacing.xs,
	},
	callRow: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	callButton: {
		flex: 1,
		borderRadius: components.cardRadius,
	},
	callSecurity: {
		borderColor: "#1B5E20",
	},
	call911: {
		borderColor: "#D32F2F",
	},
	callContent: {
		minHeight: components.touchTarget,
	},
	callLabel: {
		fontSize: typography.body.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	quickReportLabel: {
		fontSize: typography.caption.fontSize,
	},

	// Modals
	modalContainer: {
		backgroundColor: colors.surface,
		borderRadius: components.cardRadius,
		padding: spacing.lg,
		marginHorizontal: spacing.lg,
		gap: spacing.md,
	},
	modalTitle: {
		fontSize: typography.h1.fontSize,
		fontWeight: typography.h1.fontWeight,
		color: colors.textPrimary,
	},
	modalBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
	},
	modalButton: {
		borderRadius: components.cardRadius,
	},
	modalButtonContent: {
		minHeight: components.touchTarget,
	},
	modalButtonLabel: {
		fontSize: typography.button.fontSize,
		fontWeight: typography.button.fontWeight,
	},
	modalCancelLabel: {
		fontSize: typography.caption.fontSize,
	},

	// Quick report
	reportHint: {
		fontSize: typography.caption.fontSize,
		color: colors.textSecondary,
	},
	categoryRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: spacing.xs,
	},
	catChip: {
		borderRadius: components.cardRadius,
		borderColor: colors.border,
	},
	catLabel: {
		fontSize: typography.caption.fontSize,
	},
	noteInput: {
		backgroundColor: colors.surface,
	},
	reportDone: {
		alignItems: "center",
		gap: spacing.md,
	},
	reportDoneTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: colors.statusSafe,
	},
	reportDoneBody: {
		fontSize: typography.body.fontSize,
		color: colors.textSecondary,
		textAlign: "center",
	},
});
