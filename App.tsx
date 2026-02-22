import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import type {
	AuthStackParamList,
	MainTabParamList,
	NearbyStackParamList,
	RootStackParamList,
	RouteStackParamList,
} from "./src/navigation/types";
// Screens – Nearby stack
import { ActionPlanScreen } from "./src/screens/ActionPlanScreen";
// Screens – Auth
import { CreateAccountScreen } from "./src/screens/CreateAccountScreen";
import { EmergencyScreen } from "./src/screens/EmergencyScreen";
import { FlareDetailScreen } from "./src/screens/FlareDetailScreen";
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

const _RootStack = createNativeStackNavigator<RootStackParamList>();
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
			<NearbyStack.Screen name="EmergencyUX" component={EmergencyScreen} />
			<NearbyStack.Screen name="ReportStep1" component={ReportStep1Screen} />
			<NearbyStack.Screen name="ReportStep2" component={ReportStep2Screen} />
			<NearbyStack.Screen name="ReportStep3" component={ReportStep3Screen} />
			<NearbyStack.Screen name="ActionPlan" component={ActionPlanScreen} />
		</NearbyStack.Navigator>
	);
}

function RouteStackNavigator() {
	return (
		<RouteStack.Navigator screenOptions={{ headerShown: false }}>
			<RouteStack.Screen name="RouteSetup" component={RouteSetupScreen} />
			<RouteStack.Screen name="RouteResults" component={RouteResultsScreen} />
		</RouteStack.Navigator>
	);
}

function MainTabs() {
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
				options={{ tabBarLabel: "Nearby" }}
			/>
			<Tab.Screen
				name="RouteTab"
				component={RouteStackNavigator}
				options={{ tabBarLabel: "Route" }}
			/>
			<Tab.Screen
				name="SavedTab"
				component={SavedScreen}
				options={{ tabBarLabel: "Saved" }}
			/>
			<Tab.Screen
				name="SettingsTab"
				component={SettingsScreen}
				options={{ tabBarLabel: "Settings" }}
			/>
		</Tab.Navigator>
	);
}

function AuthFlow({ onComplete }: { onComplete: () => void }) {
	return (
		<AuthStack.Navigator screenOptions={{ headerShown: false }}>
			<AuthStack.Screen name="Welcome" component={WelcomeScreen} />
			<AuthStack.Screen name="CreateAccount" component={CreateAccountScreen} />
			<AuthStack.Screen name="Preferences">
				{(props) => <PreferencesScreen {...props} onComplete={onComplete} />}
			</AuthStack.Screen>
		</AuthStack.Navigator>
	);
}

// ── Root App ────────────────────────────────────────────────

export default function App() {
	const [isOnboarded, setIsOnboarded] = useState(false);

	return (
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<PaperProvider theme={theme}>
					<NavigationContainer>
						{isOnboarded ? (
							<MainTabs />
						) : (
							<AuthFlow onComplete={() => setIsOnboarded(true)} />
						)}
					</NavigationContainer>
				</PaperProvider>
			</QueryClientProvider>
		</SafeAreaProvider>
	);
}
