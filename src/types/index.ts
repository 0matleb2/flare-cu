// ── Flare Types ──────────────────────────────────────────────

export type FlareCategory =
	| "blocked_entrance"
	| "dense_crowd"
	| "access_restriction"
	| "construction"
	| "other";

export type CredibilityLevel =
	| "reported"
	| "confirmed"
	| "verified"
	| "resolved";

export interface TimelineEntry {
	time: string; // e.g. "10:05"
	label: string; // e.g. "Reported"
}

export interface Flare {
	id: string;
	category: FlareCategory;
	credibility: CredibilityLevel;
	summary: string; // one-sentence summary
	location: string; // building + entrance or intersection
	building: string;
	entrance?: string;
	timestamp: number; // created at
	lastUpdated: number; // last status change
	timeline: TimelineEntry[];
	savedByUser: boolean;
	note?: string; // optional reporter note (max 140 chars)
}

// ── Category Helpers ─────────────────────────────────────────

export const CATEGORY_LABELS: Record<FlareCategory, string> = {
	blocked_entrance: "Blocked entrance",
	dense_crowd: "Dense crowd",
	access_restriction: "Access restriction",
	construction: "Construction",
	other: "Other",
};

export const CREDIBILITY_LABELS: Record<CredibilityLevel, string> = {
	reported: "Reported",
	confirmed: "Confirmed",
	verified: "Verified",
	resolved: "Resolved",
};

// Ordered progression for the progress bar
export const CREDIBILITY_STEPS: CredibilityLevel[] = [
	"reported",
	"confirmed",
	"verified",
	"resolved",
];

// ── User Preferences ────────────────────────────────────────

export type AlertIntensity = "low" | "medium";
export type NotificationRadius = "near_me" | "sgw_wide";

export interface UserPreferences {
	mobilityFriendly: boolean;
	lowStimulation: boolean;
	alertIntensity: AlertIntensity;
	notificationRadius: NotificationRadius;
	offlineCaching: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
	mobilityFriendly: false,
	lowStimulation: false,
	alertIntensity: "medium",
	notificationRadius: "near_me",
	offlineCaching: true,
};

// ── Route Types ─────────────────────────────────────────────

export interface RouteStep {
	instruction: string; // imperative verb sentence
	warning?: string;
}

export type RouteLabel = "safest" | "accessible" | "fastest_safe";

export const ROUTE_LABEL_DISPLAY: Record<RouteLabel, string> = {
	safest: "Safest",
	accessible: "Accessible",
	fastest_safe: "Fastest safe",
};

export interface Route {
	id: string;
	label: RouteLabel;
	from: string;
	to: string;
	steps: RouteStep[];
	savedByUser: boolean;
}

// ── Action Plan ─────────────────────────────────────────────

export interface ActionStep {
	id: string;
	instruction: string; // one line, imperative verb
	completed: boolean;
}

export interface ActionPlan {
	id: string;
	title: string;
	steps: ActionStep[];
}

// ── Offline Queue ───────────────────────────────────────────

export interface OfflineQueueItem {
	id: string;
	category: FlareCategory;
	building: string;
	entrance?: string;
	note?: string;
	timestamp: number;
}

// ── Feed Filters ────────────────────────────────────────────

export type FeedFilter =
	| "near_me"
	| "all_sgw"
	| "accessibility"
	| "high_tension"
	| "hide_resolved";

export const FEED_FILTER_LABELS: Record<FeedFilter, string> = {
	near_me: "Near me",
	all_sgw: "All SGW",
	accessibility: "Accessibility",
	high_tension: "High tension",
	hide_resolved: "Hide resolved",
};

// ── Recommended Actions ─────────────────────────────────────

export type RecommendedAction =
	| "avoid"
	| "reroute"
	| "go_indoors"
	| "wait"
	| "recheck";

export const ACTION_LABELS: Record<RecommendedAction, string> = {
	avoid: "Avoid",
	reroute: "Reroute",
	go_indoors: "Go indoors",
	wait: "Wait",
	recheck: "Recheck",
};
