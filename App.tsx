import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Icon, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppSessionProvider } from "./src/context/AppSessionContext";
import {
	EmergencyProvider,
	useEmergency,
} from "./src/context/EmergencyContext";
import { useLowStim } from "./src/hooks/useLowStim";

import type {
	AuthStackParamList,
	MainTabParamList,
	NearbyStackParamList,
	RouteStackParamList,
	SavedStackParamList,
	SettingsStackParamList,
} from "./src/navigation/types";
// Screens – Nearby stack
import { ActionPlanScreen } from "./src/screens/ActionPlanScreen";
// Screens – Auth
import { CreateAccountScreen } from "./src/screens/CreateAccountScreen";
// Emergency
import { EmergencyShell } from "./src/screens/EmergencyShell";
import { FlareDetailScreen } from "./src/screens/FlareDetailScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import { HelpScreen } from "./src/screens/HelpScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { NearbyScreen } from "./src/screens/NearbyScreen";
import { PreferencesScreen } from "./src/screens/PreferencesScreen";
import { ReportStep1Screen } from "./src/screens/ReportStep1Screen";
import { ReportStep2Screen } from "./src/screens/ReportStep2Screen";
import { ReportStep3Screen } from "./src/screens/ReportStep3Screen";

// Screens – Route stack
import { RouteResultsScreen } from "./src/screens/RouteResultsScreen";
import { RouteSetupScreen } from "./src/screens/RouteSetupScreen";

// Screens – Tabs
import { SavedScreen } from "./src/screens/SavedScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";

import {
	AppSessionService,
	DEFAULT_APP_SESSION,
	type SessionAccessMode,
} from "./src/services/AppSessionService";
import { colors, getAccentColors, getPaperTheme } from "./src/theme";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const NearbyStack = createNativeStackNavigator<NearbyStackParamList>();
const RouteStack = createNativeStackNavigator<RouteStackParamList>();
const SavedStack = createNativeStackNavigator<SavedStackParamList>();
const SettStack = createNativeStackNavigator<SettingsStackParamList>();

const queryClient = new QueryClient();

// ── Nested navigators ───────────────────────────────────────

function NearbyStackNavigator() {
	return (
		<NearbyStack.Navigator screenOptions={{ headerShown: false }}>
			<NearbyStack.Screen name="NearbyFeed" component={NearbyScreen} />
			<NearbyStack.Screen name="FlareDetail" component={FlareDetailScreen} />
			<NearbyStack.Screen name="ReportStep1" component={ReportStep1Screen} />
			<NearbyStack.Screen name="ReportStep2" component={ReportStep2Screen} />
			<NearbyStack.Screen name="ReportStep3" component={ReportStep3Screen} />
			<NearbyStack.Screen name="ActionPlan" component={ActionPlanScreen} />
			<NearbyStack.Screen name="Help" component={HelpScreen} />
		</NearbyStack.Navigator>
	);
}

function RouteStackNavigator() {
	return (
		<RouteStack.Navigator screenOptions={{ headerShown: false }}>
			<RouteStack.Screen name="RouteSetup" component={RouteSetupScreen} />
			<RouteStack.Screen name="RouteResults" component={RouteResultsScreen} />
			<RouteStack.Screen name="RouteActionPlan" component={ActionPlanScreen} />
		</RouteStack.Navigator>
	);
}

function MainTabs({ onLogout }: { onLogout: () => void }) {
	const lowStim = useLowStim();
	const accent = useMemo(() => getAccentColors(lowStim), [lowStim]);

	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: accent.primary,
				tabBarInactiveTintColor: colors.textSecondary,
				tabBarStyle: {
					backgroundColor: colors.surface,
					borderTopColor: colors.border,
				},
				tabBarLabelStyle: { fontSize: 12, fontWeight: "600" },
			}}
		>
			<Tab.Screen
				name="NearbyTab"
				component={NearbyStackNavigator}
				options={{
					tabBarLabel: "Campus",
					tabBarIcon: ({ color, size }) => (
						<Icon
							source="map-marker-radius-outline"
							color={color}
							size={size}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="RouteTab"
				component={RouteStackNavigator}
				options={{
					tabBarLabel: "Route",
					tabBarIcon: ({ color, size }) => (
						<Icon source="map-search-outline" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="SavedTab"
				options={{
					tabBarLabel: "Saved",
					tabBarIcon: ({ color, size }) => (
						<Icon source="bookmark-outline" color={color} size={size} />
					),
				}}
			>
				{() => (
					<SavedStack.Navigator screenOptions={{ headerShown: false }}>
						<SavedStack.Screen name="SavedMain" component={SavedScreen} />
						<SavedStack.Screen
							name="FlareDetail"
							component={FlareDetailScreen}
						/>
					</SavedStack.Navigator>
				)}
			</Tab.Screen>
			<Tab.Screen
				name="SettingsTab"
				options={{
					tabBarLabel: "Settings",
					tabBarIcon: ({ color, size }) => (
						<Icon source="cog-outline" color={color} size={size} />
					),
				}}
			>
				{() => (
					<SettStack.Navigator screenOptions={{ headerShown: false }}>
						<SettStack.Screen name="SettingsMain">
							{() => <SettingsScreen onLogout={onLogout} />}
						</SettStack.Screen>
						<SettStack.Screen name="Help" component={HelpScreen} />
					</SettStack.Navigator>
				)}
			</Tab.Screen>
		</Tab.Navigator>
	);
}

function AuthFlow({
	onComplete,
}: {
	onComplete: (accessMode: SessionAccessMode) => void;
}) {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name="Welcome">
				{(props) => (
					<WelcomeScreen {...props} onGuestAccess={() => onComplete("guest")} />
				)}
			</AuthStack.Screen>
			<AuthStack.Screen name="Login">
				{(props) => (
					<LoginScreen {...props} onLogin={() => onComplete("account")} />
				)}
			</AuthStack.Screen>
			<AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
			<AuthStack.Screen name="Preferences">
				{(props) => <PreferencesScreen {...props} onComplete={onComplete} />}
			</AuthStack.Screen>
			<AuthStack.Screen
				name="ForgotPassword"
				component={ForgotPasswordScreen}
			/>
		</AuthStack.Navigator>
	);
}

// ── App content (reads EmergencyContext) ─────────────────────

function AppContent() {
	const [session, setSession] = useState(DEFAULT_APP_SESSION);
	const [isHydratingSession, setIsHydratingSession] = useState(true);
	const { isActive: isEmergencyActive } = useEmergency();
	const lowStim = useLowStim();
	const accent = useMemo(() => getAccentColors(lowStim), [lowStim]);

	useEffect(() => {
		let isMounted = true;

		const hydrateSession = async () => {
			const session = await AppSessionService.getSession();
			if (!isMounted) {
				return;
			}
			setSession(session);
			setIsHydratingSession(false);
		};

		void hydrateSession();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleCompleteAuth = useCallback((accessMode: SessionAccessMode) => {
		const nextSession = {
			isOnboarded: true,
			accessMode,
		};
		setSession(nextSession);
		void AppSessionService.saveSession(nextSession);
	}, []);

	const handleLogout = useCallback(() => {
		setSession(DEFAULT_APP_SESSION);
		void AppSessionService.clearSession();
	}, []);

	const appSessionValue = useMemo(() => session, [session]);

	return (
		<AppSessionProvider value={appSessionValue}>
			{isHydratingSession ? (
				<View style={styles.bootScreen}>
					<ActivityIndicator animating size="small" color={accent.primary} />
				</View>
			) : !session.isOnboarded ? (
				<AuthFlow onComplete={handleCompleteAuth} />
			) : isEmergencyActive ? (
				<EmergencyShell />
			) : (
				<MainTabs onLogout={handleLogout} />
			)}
		</AppSessionProvider>
	);
}

function ThemedApp() {
	const lowStim = useLowStim();
	const paperTheme = useMemo(() => getPaperTheme(lowStim), [lowStim]);

	return (
		<PaperProvider theme={paperTheme}>
			<EmergencyProvider>
				<NavigationContainer>
					<AppContent />
				</NavigationContainer>
			</EmergencyProvider>
		</PaperProvider>
	);
}

// ── Root App ────────────────────────────────────────────────

export default function App() {
	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<ThemedApp />
			</QueryClientProvider>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	bootScreen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.background,
	},
});
