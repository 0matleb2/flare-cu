import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type {
	CompositeNavigationProp,
	NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { SessionAccessMode } from "../services/AppSessionService";
import type { FlareCategory, FlareSeverity } from "../types";

// ── Auth Stack (first-launch / guest) ───────────────────────
export type AuthStackParamList = {
	Welcome: undefined;
	Login: undefined;
	CreateAccount: undefined;
	Preferences: { accessMode?: SessionAccessMode } | undefined;
	ForgotPassword: undefined;
};

// ── Nearby Stack (nested in tab) ────────────────────────────
export type NearbyStackParamList = {
	NearbyFeed:
		| { justCreatedFlareId?: string; submissionMode?: "live" | "queued" }
		| undefined;
	FlareDetail: { flareId: string };
	ReportStep1: undefined;
	ReportStep2: { category: FlareCategory; otherText?: string };
	ReportStep3: {
		category: FlareCategory;
		otherText?: string;
		locationId: string;
		locationLabel: string;
		building: string;
		entrance?: string;
		severity?: FlareSeverity;
	};
	ActionPlan: { planId: string };
	Help: undefined;
};

// ── Route Stack (nested in tab) ─────────────────────────────
export type RouteStackParamList = {
	RouteSetup: undefined;
	RouteResults: {
		from: string;
		to: string;
		avoidHighTension: boolean;
		mobilityFriendly: boolean;
		zonePromptEnabled: boolean;
	};
	RouteActionPlan: {
		planId: string;
		building?: string;
		entrance?: string;
		fromBuilding?: string;
		zonePromptEnabled?: boolean;
		steps?: import("../types").RouteStep[];
	};
};

// ── Settings Stack (nested in tab) ──────────────────────────
export type SettingsStackParamList = {
	SettingsMain: undefined;
	Help: undefined;
};

// ── Saved Stack (nested in tab) ─────────────────────────────
export type SavedStackParamList = {
	SavedMain: undefined;
	FlareDetail: { flareId: string };
};

// ── Main Tab Navigator ──────────────────────────────────────
export type MainTabParamList = {
	NearbyTab: NavigatorScreenParams<NearbyStackParamList>;
	RouteTab: NavigatorScreenParams<RouteStackParamList>;
	SavedTab: NavigatorScreenParams<SavedStackParamList>;
	SettingsTab: NavigatorScreenParams<SettingsStackParamList>;
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
export type LoginScreenNavProp = NativeStackNavigationProp<
	AuthStackParamList,
	"Login"
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

// Settings stack screens
export type SettingsMainNavProp = NativeStackNavigationProp<
	SettingsStackParamList,
	"SettingsMain"
>;

// Saved stack screens
export type SavedMainNavProp = NativeStackNavigationProp<
	SavedStackParamList,
	"SavedMain"
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
