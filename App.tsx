import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Icon, PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
	EmergencyProvider,
	useEmergency,
} from "./src/context/EmergencyContext";
import type {
	AuthStackParamList,
	MainTabParamList,
	NearbyStackParamList,
	RouteStackParamList,
} from "./src/navigation/types";
// Screens – Nearby stack
import { ActionPlanScreen } from "./src/screens/ActionPlanScreen";
// Screens – Auth
import { CreateAccountScreen } from "./src/screens/CreateAccountScreen";
// Emergency
import { EmergencyShell } from "./src/screens/EmergencyShell";
import { FlareDetailScreen } from "./src/screens/FlareDetailScreen";
import { HelpScreen } from "./src/screens/HelpScreen";
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

import { colors, theme } from "./src/theme";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const NearbyStack = createNativeStackNavigator<NearbyStackParamList>();
const RouteStack = createNativeStackNavigator<RouteStackParamList>();

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
	return (
		<Tab.Navigator
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: colors.burgundy,
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
					tabBarLabel: "Nearby",
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
				component={SavedScreen}
				options={{
					tabBarLabel: "Saved",
					tabBarIcon: ({ color, size }) => (
						<Icon source="bookmark-outline" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="SettingsTab"
				options={{
					tabBarLabel: "Settings",
					tabBarIcon: ({ color, size }) => (
						<Icon source="cog-outline" color={color} size={size} />
					),
				}}
			>
				{() => <SettingsScreen onLogout={onLogout} />}
			</Tab.Screen>
		</Tab.Navigator>
	);
}

function AuthFlow({ onComplete }: { onComplete: () => void }) {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name="Welcome">
				{(props) => <WelcomeScreen {...props} onGuestAccess={onComplete} />}
			</AuthStack.Screen>
			<AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
			<AuthStack.Screen name="Preferences">
				{(props) => <PreferencesScreen {...props} onComplete={onComplete} />}
			</AuthStack.Screen>
		</AuthStack.Navigator>
	);
}

// ── App content (reads EmergencyContext) ─────────────────────

function AppContent() {
	const [isOnboarded, setIsOnboarded] = useState(false);
	const { isActive: isEmergencyActive } = useEmergency();

	if (!isOnboarded) {
		return <AuthFlow onComplete={() => setIsOnboarded(true)} />;
	}

	// Emergency mode replaces the entire main app
	if (isEmergencyActive) {
		return <EmergencyShell />;
	}

	return <MainTabs onLogout={() => setIsOnboarded(false)} />;
}

// ── Root App ────────────────────────────────────────────────

export default function App() {
	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<PaperProvider theme={theme}>
					<EmergencyProvider>
						<NavigationContainer>
							<AppContent />
						</NavigationContainer>
					</EmergencyProvider>
				</PaperProvider>
			</QueryClientProvider>
		</SafeAreaProvider>
	);
}
