import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type {
	CompositeNavigationProp,
	NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// ── Auth Stack (first-launch / guest) ───────────────────────
export type AuthStackParamList = {
	Welcome: undefined;
	CreateAccount: undefined;
	Preferences: undefined;
};

// ── Nearby Stack (nested in tab) ────────────────────────────
export type NearbyStackParamList = {
	NearbyFeed: undefined;
	FlareDetail: { flareId: string };
	ReportStep1: undefined;
	ReportStep2: { category: string };
	ReportStep3: { category: string; building: string; entrance?: string };
	ActionPlan: { planId: string };
	Help: undefined;
};

// ── Route Stack (nested in tab) ─────────────────────────────
export type RouteStackParamList = {
	RouteSetup: undefined;
	RouteResults: {
		to: string;
		avoidHighTension: boolean;
		mobilityFriendly: boolean;
		lowStimulation: boolean;
	};
	RouteActionPlan: { planId: string };
};

// ── Main Tab Navigator ──────────────────────────────────────
export type MainTabParamList = {
	NearbyTab: NavigatorScreenParams<NearbyStackParamList>;
	RouteTab: NavigatorScreenParams<RouteStackParamList>;
	SavedTab: undefined;
	SettingsTab: undefined;
};

// ── Root (switches between Auth and Main) ───────────────────
export type RootStackParamList = {
	Auth: NavigatorScreenParams<AuthStackParamList>;
	Main: NavigatorScreenParams<MainTabParamList>;
};

// ── Navigation Props ────────────────────────────────────────

// Auth screens
export type WelcomeScreenNavProp = NativeStackNavigationProp<
	AuthStackParamList,
	"Welcome"
>;
export type CreateAccountScreenNavProp = NativeStackNavigationProp<
	AuthStackParamList,
	"CreateAccount"
>;
export type PreferencesScreenNavProp = NativeStackNavigationProp<
	AuthStackParamList,
	"Preferences"
>;

// Nearby stack screens
export type NearbyFeedNavProp = CompositeNavigationProp<
	NativeStackNavigationProp<NearbyStackParamList, "NearbyFeed">,
	BottomTabNavigationProp<MainTabParamList>
>;
export type FlareDetailNavProp = NativeStackNavigationProp<
	NearbyStackParamList,
	"FlareDetail"
>;
export type ReportStep1NavProp = NativeStackNavigationProp<
	NearbyStackParamList,
	"ReportStep1"
>;
export type ReportStep2NavProp = NativeStackNavigationProp<
	NearbyStackParamList,
	"ReportStep2"
>;
export type ReportStep3NavProp = NativeStackNavigationProp<
	NearbyStackParamList,
	"ReportStep3"
>;
export type ActionPlanNavProp = NativeStackNavigationProp<
	NearbyStackParamList,
	"ActionPlan"
>;
export type HelpNavProp = NativeStackNavigationProp<
	NearbyStackParamList,
	"Help"
>;

// Route stack screens
export type RouteSetupNavProp = NativeStackNavigationProp<
	RouteStackParamList,
	"RouteSetup"
>;
export type RouteResultsNavProp = NativeStackNavigationProp<
	RouteStackParamList,
	"RouteResults"
>;
