import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import { getLocationDetails } from "../data/locations";
import type { CreateFlareInput, Flare } from "../types";
import { CATEGORY_LABELS, CONFIRM_THRESHOLD } from "../types";
import { AppSessionService } from "./AppSessionService";
import { PreferencesService } from "./PreferencesService";

const getStorageKey = async () => {
	const session = await AppSessionService.getSession();
	return session.userEmail
		? `@flare_cu_flares_v5_${session.userEmail}`
		: "@flare_cu_flares_v5";
};

const getQueueKey = async () => {
	const session = await AppSessionService.getSession();
	return session.userEmail
		? `@flare_cu_offline_queue_${session.userEmail}`
		: "@flare_cu_offline_queue";
};

const getLastSyncKey = async () => {
	const session = await AppSessionService.getSession();
	return session.userEmail
		? `@flare_cu_last_sync_${session.userEmail}`
		: "@flare_cu_last_sync";
};

const SIMULATED_DELAY_MS = 600;
const INITIAL_FLARE_REFRESH_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 7;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function formatTime(timestamp: number) {
	return new Date(timestamp).toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
}

function buildTimeline(
	now: number,
	entries: Array<{ minutesAgo: number; label: string }>,
) {
	return entries.map((entry) => ({
		time: formatTime(now - entry.minutesAgo * 60 * 1000),
		label: entry.label,
	}));
}

function buildInitialFlares(now = Date.now(), isGuest = false): Flare[] {
	return [
		{
			id: "1",
			category: "dense_crowd",
			credibility: "verified",
			summary: "Metro exit crowd spilling onto the concourse, expect delays.",
			location: "Guy-Concordia Metro",
			locationId: "guy_concordia_metro",
			building: "Guy-Concordia Metro",
			severity: "high",
			timestamp: now - 55 * 60 * 1000,
			lastUpdated: now - 18 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 55, label: "Reported" },
				{ minutesAgo: 43, label: "Confirmed" },
				{ minutesAgo: 18, label: "Verified" },
			]),
			savedByUser: false,
			upvotes: 18,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "2",
			category: "construction",
			credibility: "verified",
			summary:
				"Scaffolding narrows the sidewalk on Guy between De Maisonneuve and Sainte-Catherine.",
			location: "Guy, De Maisonneuve to Sainte-Catherine",
			locationId: "guy_demaisonneuve_to_stecatherine",
			building: "Guy, De Maisonneuve to Sainte-Catherine",
			severity: "high",
			timestamp: now - 135 * 60 * 1000,
			lastUpdated: now - 74 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 135, label: "Reported" },
				{ minutesAgo: 122, label: "Confirmed" },
				{ minutesAgo: 74, label: "Verified" },
			]),
			savedByUser: !isGuest,
			upvotes: 16,
			upvotedByUser: !isGuest,
			downvotedByUser: false,
		},
		{
			id: "3",
			category: "access_restriction",
			credibility: "verified",
			summary:
				"Hall to MB connector closed for maintenance. Use street-level access instead.",
			location: "Hall to MB connector",
			locationId: "H_MB_tunnel",
			building: "Hall to MB connector",
			severity: "high",
			timestamp: now - 220 * 60 * 1000,
			lastUpdated: now - 108 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 220, label: "Reported" },
				{ minutesAgo: 188, label: "Confirmed" },
				{ minutesAgo: 108, label: "Verified" },
			]),
			savedByUser: false,
			upvotes: 21,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "4",
			category: "blocked_entrance",
			credibility: "confirmed",
			summary: "Delivery setup is blocking the Hall main entrance doors.",
			location: "Hall main entrance",
			locationId: "H_main_entrance",
			building: "Hall Building",
			entrance: "Hall main entrance",
			severity: "high",
			timestamp: now - 21 * 60 * 1000,
			lastUpdated: now - 9 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 21, label: "Reported" },
				{ minutesAgo: 9, label: "Confirmed" },
			]),
			savedByUser: false,
			upvotes: 14,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "5",
			category: "dense_crowd",
			credibility: "confirmed",
			summary: "Workshop check-in line is backing up outside Learning Square.",
			location: "LS main entrance",
			locationId: "LS_main_entrance",
			building: "Learning Square",
			entrance: "LS main entrance",
			severity: "medium",
			timestamp: now - 38 * 60 * 1000,
			lastUpdated: now - 19 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 38, label: "Reported" },
				{ minutesAgo: 19, label: "Confirmed" },
			]),
			savedByUser: false,
			upvotes: 11,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "6",
			category: "blocked_entrance",
			credibility: "confirmed",
			summary: "Barricades are narrowing the Faubourg main entrance.",
			location: "FB main entrance",
			locationId: "FB_main_entrance",
			building: "FB Building",
			entrance: "FB main entrance",
			severity: "medium",
			timestamp: now - 29 * 60 * 1000,
			lastUpdated: now - 13 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 29, label: "Reported" },
				{ minutesAgo: 13, label: "Confirmed" },
			]),
			savedByUser: !isGuest,
			upvotes: 10,
			upvotedByUser: !isGuest,
			downvotedByUser: false,
		},
		{
			id: "7",
			category: "access_restriction",
			credibility: "reported",
			summary: "One MB elevator bank is out of service. Expect slower access.",
			location: "John Molson Building (MB)",
			locationId: "MB",
			building: "MB Building",
			severity: "medium",
			timestamp: now - 7 * 60 * 1000,
			lastUpdated: now - 7 * 60 * 1000,
			timeline: buildTimeline(now, [{ minutesAgo: 7, label: "Reported" }]),
			savedByUser: false,
			upvotes: 4,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "8",
			category: "other",
			credibility: "reported",
			summary: "Slippery steps reported outside the Grey Nuns Annex entrance.",
			location: "GA main entrance",
			locationId: "GA_main_entrance",
			building: "GA Annex",
			entrance: "GA main entrance",
			severity: "low",
			timestamp: now - 14 * 60 * 1000,
			lastUpdated: now - 14 * 60 * 1000,
			timeline: buildTimeline(now, [{ minutesAgo: 14, label: "Reported" }]),
			savedByUser: false,
			upvotes: 1,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "9",
			category: "dense_crowd",
			credibility: "reported",
			summary:
				"Crowd gathering at Guy and De Maisonneuve is slowing crossings.",
			location: "Guy / De Maisonneuve",
			locationId: "guy_demaisonneuve",
			building: "Guy / De Maisonneuve",
			severity: "high",
			timestamp: now - 4 * 60 * 1000,
			lastUpdated: now - 4 * 60 * 1000,
			timeline: buildTimeline(now, [{ minutesAgo: 4, label: "Reported" }]),
			savedByUser: false,
			upvotes: 3,
			upvotedByUser: true,
			downvotedByUser: false,
		},
		{
			id: "10",
			category: "construction",
			credibility: "reported",
			summary:
				"Temporary fencing narrows the sidewalk near the Visual Arts entrance.",
			location: "VA main entrance",
			locationId: "VA_main_entrance",
			building: "VA Building",
			entrance: "VA main entrance",
			severity: "medium",
			timestamp: now - 9 * 60 * 1000,
			lastUpdated: now - 9 * 60 * 1000,
			timeline: buildTimeline(now, [{ minutesAgo: 9, label: "Reported" }]),
			savedByUser: false,
			upvotes: 1,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "11",
			category: "blocked_entrance",
			credibility: "resolved",
			summary: "Grey Nuns main entrance reopened after an earlier fire drill.",
			location: "GN main entrance",
			locationId: "GN_main_entrance",
			building: "GN Building",
			entrance: "GN main entrance",
			severity: "high",
			timestamp: now - 4 * 60 * 60 * 1000,
			lastUpdated: now - 2 * 60 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 240, label: "Reported" },
				{ minutesAgo: 228, label: "Confirmed" },
				{ minutesAgo: 213, label: "Verified" },
				{ minutesAgo: 120, label: "Resolved" },
			]),
			savedByUser: false,
			upvotes: 11,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "12",
			category: "access_restriction",
			credibility: "resolved",
			summary:
				"GM to Library connector reopened after maintenance and is fully accessible again.",
			location: "GM to LB connector",
			locationId: "GM_LB_tunnel",
			building: "GM to LB connector",
			severity: "medium",
			timestamp: now - 5 * 60 * 60 * 1000,
			lastUpdated: now - 150 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 300, label: "Reported" },
				{ minutesAgo: 285, label: "Confirmed" },
				{ minutesAgo: 270, label: "Verified" },
				{ minutesAgo: 150, label: "Resolved" },
			]),
			savedByUser: false,
			upvotes: 10,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "13",
			category: "access_restriction",
			credibility: "verified",
			summary:
				"EV elevator maintenance is slowing access to upper floors this morning.",
			location: "EV Building",
			locationId: "EV",
			building: "EV Building",
			severity: "medium",
			timestamp: now - 97 * 60 * 1000,
			lastUpdated: now - 35 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 97, label: "Reported" },
				{ minutesAgo: 71, label: "Confirmed" },
				{ minutesAgo: 35, label: "Verified" },
			]),
			savedByUser: false,
			upvotes: 12,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "14",
			category: "dense_crowd",
			credibility: "confirmed",
			summary: "Study group overflow is crowding the LB main entrance.",
			location: "LB main entrance",
			locationId: "LB_main_entrance",
			building: "LB Building",
			entrance: "LB main entrance",
			severity: "medium",
			timestamp: now - 46 * 60 * 1000,
			lastUpdated: now - 16 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 46, label: "Reported" },
				{ minutesAgo: 16, label: "Confirmed" },
			]),
			savedByUser: false,
			upvotes: 9,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "15",
			category: "construction",
			credibility: "reported",
			summary:
				"Utility work is narrowing St-Mathieu between Sainte-Catherine and Rene-Levesque.",
			location: "St-Mathieu, Sainte-Catherine to Rene-Levesque",
			locationId: "stmathieu_stecatherine_to_renelevesque",
			building: "St-Mathieu, Sainte-Catherine to Rene-Levesque",
			severity: "medium",
			timestamp: now - 12 * 60 * 1000,
			lastUpdated: now - 12 * 60 * 1000,
			timeline: buildTimeline(now, [{ minutesAgo: 12, label: "Reported" }]),
			savedByUser: false,
			upvotes: 2,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "16",
			category: "blocked_entrance",
			credibility: "confirmed",
			summary: "Event equipment is blocking part of the FG main entrance.",
			location: "FG main entrance",
			locationId: "FG_main_entrance",
			building: "FG Building",
			entrance: "FG main entrance",
			severity: "medium",
			timestamp: now - 31 * 60 * 1000,
			lastUpdated: now - 11 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 31, label: "Reported" },
				{ minutesAgo: 11, label: "Confirmed" },
			]),
			savedByUser: !isGuest,
			upvotes: 8,
			upvotedByUser: !isGuest,
			downvotedByUser: false,
		},
		{
			id: "17",
			category: "other",
			credibility: "reported",
			summary: "Wet floor reported inside the Hall to GM connector.",
			location: "Hall to GM connector",
			locationId: "H_GM_tunnel",
			building: "Hall to GM connector",
			severity: "low",
			timestamp: now - 6 * 60 * 1000,
			lastUpdated: now - 6 * 60 * 1000,
			timeline: buildTimeline(now, [{ minutesAgo: 6, label: "Reported" }]),
			savedByUser: false,
			upvotes: 1,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "18",
			category: "construction",
			credibility: "verified",
			summary:
				"Scaffolding is narrowing Bishop between De Maisonneuve and Sainte-Catherine.",
			location: "Bishop, De Maisonneuve to Sainte-Catherine",
			locationId: "bishop_demaisonneuve_to_stecatherine",
			building: "Bishop, De Maisonneuve to Sainte-Catherine",
			severity: "high",
			timestamp: now - 180 * 60 * 1000,
			lastUpdated: now - 92 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 180, label: "Reported" },
				{ minutesAgo: 138, label: "Confirmed" },
				{ minutesAgo: 92, label: "Verified" },
			]),
			savedByUser: false,
			upvotes: 15,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "19",
			category: "access_restriction",
			credibility: "reported",
			summary:
				"Grey Nuns lift service is limited right now. Plan for a slower entry.",
			location: "Grey Nuns Building (GN)",
			locationId: "GN",
			building: "GN Building",
			severity: "medium",
			timestamp: now - 22 * 60 * 1000,
			lastUpdated: now - 22 * 60 * 1000,
			timeline: buildTimeline(now, [{ minutesAgo: 22, label: "Reported" }]),
			savedByUser: false,
			upvotes: 3,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "20",
			category: "dense_crowd",
			credibility: "confirmed",
			summary: "Exhibition check-in queue is building at the VA entrance.",
			location: "VA main entrance",
			locationId: "VA_main_entrance",
			building: "VA Building",
			entrance: "VA main entrance",
			severity: "medium",
			timestamp: now - 27 * 60 * 1000,
			lastUpdated: now - 14 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 27, label: "Reported" },
				{ minutesAgo: 14, label: "Confirmed" },
			]),
			savedByUser: false,
			upvotes: 7,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "21",
			category: "blocked_entrance",
			credibility: "resolved",
			summary:
				"EV main entrance reopened after temporary security screening ended.",
			location: "EV main entrance",
			locationId: "EV_main_entrance",
			building: "EV Building",
			entrance: "EV main entrance",
			severity: "high",
			timestamp: now - 6 * 60 * 60 * 1000,
			lastUpdated: now - 175 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 360, label: "Reported" },
				{ minutesAgo: 332, label: "Confirmed" },
				{ minutesAgo: 295, label: "Verified" },
				{ minutesAgo: 175, label: "Resolved" },
			]),
			savedByUser: false,
			upvotes: 13,
			upvotedByUser: false,
			downvotedByUser: false,
		},
		{
			id: "22",
			category: "construction",
			credibility: "resolved",
			summary:
				"Temporary fencing has been cleared along De Maisonneuve from Guy to St-Mathieu.",
			location: "De Maisonneuve, Guy to St-Mathieu",
			locationId: "demaisonneuve_guy_to_stmathieu",
			building: "De Maisonneuve, Guy to St-Mathieu",
			severity: "medium",
			timestamp: now - 7 * 60 * 60 * 1000,
			lastUpdated: now - 210 * 60 * 1000,
			timeline: buildTimeline(now, [
				{ minutesAgo: 420, label: "Reported" },
				{ minutesAgo: 388, label: "Confirmed" },
				{ minutesAgo: 344, label: "Verified" },
				{ minutesAgo: 210, label: "Resolved" },
			]),
			savedByUser: false,
			upvotes: 9,
			upvotedByUser: false,
			downvotedByUser: false,
		},
	];
}

function seedTemplateChanged(current: Flare, next: Flare) {
	return (
		current.category !== next.category ||
		current.credibility !== next.credibility ||
		current.summary !== next.summary ||
		current.location !== next.location ||
		current.locationId !== next.locationId ||
		current.building !== next.building ||
		current.entrance !== next.entrance ||
		current.severity !== next.severity
	);
}

const INITIAL_FLARE_IDS = new Set(
	buildInitialFlares().map((flare) => flare.id),
);

function shouldRefreshSeedFlares(flares: Flare[], now = Date.now()) {
	const seedFlares = flares.filter((flare) => INITIAL_FLARE_IDS.has(flare.id));
	if (seedFlares.length === 0) return false;
	if (seedFlares.length !== INITIAL_FLARE_IDS.size) return true;

	const freshSeedById = new Map(
		buildInitialFlares(now).map((flare) => [flare.id, flare]),
	);
	const hasTemplateMismatch = seedFlares.some((flare) => {
		const fresh = freshSeedById.get(flare.id);
		return fresh ? seedTemplateChanged(flare, fresh) : true;
	});
	if (hasTemplateMismatch) return true;

	const newestSeedUpdate = Math.max(
		...seedFlares.map((flare) => flare.lastUpdated || flare.timestamp),
	);
	return now - newestSeedUpdate > INITIAL_FLARE_REFRESH_THRESHOLD_MS;
}

async function refreshSeedFlares(flares: Flare[], now = Date.now()) {
	const session = await AppSessionService.getSession();
	const isGuest = session.accessMode === "guest" || !session.userEmail;
	const freshSeeds = buildInitialFlares(now, isGuest);
	const existingSeedById = new Map(
		flares
			.filter((flare) => INITIAL_FLARE_IDS.has(flare.id))
			.map((flare) => [flare.id, flare]),
	);
	const userFlares = flares.filter((flare) => !INITIAL_FLARE_IDS.has(flare.id));

	const refreshedSeeds = freshSeeds.map((fresh) => {
		const existing = existingSeedById.get(fresh.id);
		if (!existing) return fresh;

		return {
			...fresh,
			savedByUser: existing.savedByUser,
			upvotes: existing.upvotes,
			upvotedByUser: existing.upvotedByUser,
			downvotedByUser: existing.downvotedByUser,
		};
	});

	return [...refreshedSeeds, ...userFlares];
}

async function readStoredFlares(): Promise<Flare[]> {
	try {
		const jsonValue = await AsyncStorage.getItem(await getStorageKey());
		if (jsonValue != null) {
			const storedFlares = JSON.parse(jsonValue) as Flare[];
			if (shouldRefreshSeedFlares(storedFlares)) {
				const refreshedFlares = await refreshSeedFlares(storedFlares);
				await writeStoredFlares(refreshedFlares);
				return refreshedFlares;
			}
			return storedFlares;
		}
		const session = await AppSessionService.getSession();
		const isGuest = session.accessMode === "guest" || !session.userEmail;
		const initialFlares = buildInitialFlares(Date.now(), isGuest);
		await AsyncStorage.setItem(
			await getStorageKey(),
			JSON.stringify(initialFlares),
		);
		await AsyncStorage.setItem(await getLastSyncKey(), String(Date.now()));
		return initialFlares;
	} catch (e) {
		console.error("Failed to fetch flares", e);
		return [];
	}
}

async function writeStoredFlares(flares: Flare[]) {
	await AsyncStorage.setItem(await getStorageKey(), JSON.stringify(flares));
}

async function readQueue() {
	try {
		const json = await AsyncStorage.getItem(await getQueueKey());
		return json ? JSON.parse(json) : [];
	} catch {
		return [];
	}
}

async function writeQueue(queue: unknown[]) {
	await AsyncStorage.setItem(await getQueueKey(), JSON.stringify(queue));
}

async function setLastSync(timestamp: number) {
	await AsyncStorage.setItem(await getLastSyncKey(), String(timestamp));
}

function buildFlare(data: CreateFlareInput, mode: "live" | "queued"): Flare {
	const now = Date.now();
	const note = data.note?.trim() || undefined;
	const otherText =
		data.category === "other" ? data.otherText?.trim() || undefined : undefined;
	const locationDetails = data.locationId
		? getLocationDetails(data.locationId)
		: undefined;
	const building =
		data.building?.trim() || locationDetails?.buildingName || "SGW Campus";
	const entrance = data.entrance?.trim() || locationDetails?.entranceName;
	const location =
		locationDetails?.label ??
		(entrance ? `${building}, ${entrance}` : building);
	const summaryLocation = entrance ? entrance : location;

	return {
		id: Math.random().toString(36).substring(2, 11),
		category: data.category,
		credibility: "reported",
		summary:
			otherText ||
			note ||
			`${CATEGORY_LABELS[data.category]} at ${summaryLocation}.`,
		location,
		locationId: data.locationId,
		building,
		entrance,
		severity: data.severity ?? "medium",
		timestamp: now,
		lastUpdated: now,
		timeline: [
			{
				time: formatTime(now),
				label: mode === "queued" ? "Queued offline" : "Reported",
			},
		],
		savedByUser: false,
		note,
		otherText,
		syncStatus: mode === "queued" ? "queued" : undefined,
		upvotes: 1,
		upvotedByUser: false,
		downvotedByUser: false,
	};
}

export const FlareService = {
	async getFlares(): Promise<Flare[]> {
		await wait(SIMULATED_DELAY_MS);
		try {
			const prefs = await PreferencesService.getPreferences();
			const network = await Network.getNetworkStateAsync();
			const isOnline =
				network.isConnected !== false && prefs.offlineCaching !== false;

			if (isOnline) {
				await this.syncQueuedReports();
			}
			return await readStoredFlares();
		} catch (e) {
			console.error("Failed to fetch flares", e);
			return [];
		}
	},

	async getFlareById(id: string): Promise<Flare | undefined> {
		const flares = await this.getFlares();
		return flares.find((f) => f.id === id);
	},

	async createFlare(data: CreateFlareInput): Promise<Flare> {
		await wait(SIMULATED_DELAY_MS);
		try {
			const prefs = await PreferencesService.getPreferences();
			const network = await Network.getNetworkStateAsync();
			const isOnline =
				network.isConnected !== false && prefs.offlineCaching !== false;
			const mode = isOnline ? "live" : "queued";
			const newFlare = buildFlare(data, mode);
			const currentFlares = await readStoredFlares();
			const updatedFlares = [newFlare, ...currentFlares];
			await writeStoredFlares(updatedFlares);
			if (mode === "queued") {
				await this.enqueueReport(data, newFlare.id, newFlare.timestamp);
			} else {
				await setLastSync(Date.now());
			}
			return newFlare;
		} catch (e) {
			console.error("Failed to create flare", e);
			throw e;
		}
	},

	async saveFlare(id: string): Promise<void> {
		try {
			const flares = await readStoredFlares();
			const updated = flares.map((f) =>
				f.id === id ? { ...f, savedByUser: true } : f,
			);
			await writeStoredFlares(updated);
		} catch (e) {
			console.error("Failed to save flare", e);
		}
	},

	async unsaveFlare(id: string): Promise<void> {
		try {
			const flares = await readStoredFlares();
			const updated = flares.map((f) =>
				f.id === id ? { ...f, savedByUser: false } : f,
			);
			await writeStoredFlares(updated);
		} catch (e) {
			console.error("Failed to unsave flare", e);
		}
	},

	async upvoteFlare(id: string): Promise<void> {
		try {
			const flares = await readStoredFlares();
			const updated = flares.map((f) => {
				if (f.id !== id) return f;
				const wasUpvoted = f.upvotedByUser;
				const wasDownvoted = f.downvotedByUser;

				let newUpvotes = f.upvotes;
				let newUpvotedByUser = f.upvotedByUser;
				let newDownvotedByUser = f.downvotedByUser;

				if (wasUpvoted) {
					newUpvotes -= 1;
					newUpvotedByUser = false;
				} else {
					newUpvotes += 1;
					newUpvotedByUser = true;
					if (wasDownvoted) {
						newUpvotes += 1;
						newDownvotedByUser = false;
					}
				}

				// Auto-promote from reported → confirmed at threshold
				let newCredibility = f.credibility;
				const newTimeline = [...f.timeline];

				if (f.credibility === "reported" && newUpvotes >= CONFIRM_THRESHOLD) {
					newCredibility = "confirmed";
					newTimeline.push({
						time: formatTime(Date.now()),
						label: "Confirmed",
					});
				} else if (
					f.credibility === "confirmed" &&
					newUpvotes < CONFIRM_THRESHOLD
				) {
					newCredibility = "reported";
					// Remove the last "Confirmed" entry if it exists
					const confirmedIdx = newTimeline
						.slice()
						.reverse()
						.findIndex((t) => t.label === "Confirmed");
					if (confirmedIdx !== -1) {
						newTimeline.splice(newTimeline.length - 1 - confirmedIdx, 1);
					}
				}

				return {
					...f,
					upvotes: newUpvotes,
					upvotedByUser: newUpvotedByUser,
					downvotedByUser: newDownvotedByUser,
					credibility: newCredibility,
					timeline: newTimeline,
					lastUpdated:
						newCredibility !== f.credibility ? Date.now() : f.lastUpdated,
				};
			});
			await writeStoredFlares(updated);
		} catch (e) {
			console.error("Failed to upvote flare", e);
		}
	},

	async downvoteFlare(id: string): Promise<void> {
		try {
			const flares = await readStoredFlares();
			const updated = flares.map((f) => {
				if (f.id !== id) return f;
				const wasUpvoted = f.upvotedByUser;
				const wasDownvoted = f.downvotedByUser;

				let newUpvotes = f.upvotes;
				let newUpvotedByUser = f.upvotedByUser;
				let newDownvotedByUser = f.downvotedByUser;

				if (wasDownvoted) {
					newUpvotes += 1;
					newDownvotedByUser = false;
				} else {
					newUpvotes -= 1;
					newDownvotedByUser = true;
					if (wasUpvoted) {
						newUpvotes -= 1;
						newUpvotedByUser = false;
					}
				}

				// Handle credibility changes based on score threshold
				let newCredibility = f.credibility;
				const newTimeline = [...f.timeline];

				if (f.credibility === "reported" && newUpvotes >= CONFIRM_THRESHOLD) {
					newCredibility = "confirmed";
					newTimeline.push({
						time: formatTime(Date.now()),
						label: "Confirmed",
					});
				} else if (
					f.credibility === "confirmed" &&
					newUpvotes < CONFIRM_THRESHOLD
				) {
					newCredibility = "reported";
					const confirmedIdx = newTimeline
						.slice()
						.reverse()
						.findIndex((t) => t.label === "Confirmed");
					if (confirmedIdx !== -1) {
						newTimeline.splice(newTimeline.length - 1 - confirmedIdx, 1);
					}
				}

				return {
					...f,
					upvotes: newUpvotes,
					upvotedByUser: newUpvotedByUser,
					downvotedByUser: newDownvotedByUser,
					credibility: newCredibility,
					timeline: newTimeline,
					lastUpdated:
						newCredibility !== f.credibility ? Date.now() : f.lastUpdated,
				};
			});
			await writeStoredFlares(updated);
		} catch (e) {
			console.error("Failed to downvote flare", e);
		}
	},

	async deleteFlare(id: string): Promise<void> {
		try {
			const flares = await readStoredFlares();
			const updated = flares.filter((f) => f.id !== id);
			const queue = await readQueue();
			await writeStoredFlares(updated);
			await writeQueue(
				queue.filter(
					(item: { flareId?: string; id: string }) =>
						item.flareId !== id && item.id !== id,
				),
			);
		} catch (e) {
			console.error("Failed to delete flare", e);
		}
	},

	// ── Offline queue helpers ────────────────────────────────
	async getQueueCount(): Promise<number> {
		try {
			const queue = await readQueue();
			return queue.length;
		} catch {
			return 0;
		}
	},

	async getLastSync(): Promise<number | null> {
		try {
			const raw = await AsyncStorage.getItem(await getLastSyncKey());
			if (!raw) return null;
			const timestamp = Number(raw);
			return Number.isNaN(timestamp) ? null : timestamp;
		} catch {
			return null;
		}
	},

	async enqueueReport(
		data: CreateFlareInput,
		flareId?: string,
		timestamp = Date.now(),
	): Promise<void> {
		try {
			const queue = await readQueue();
			queue.push({
				...data,
				id: Math.random().toString(36).substring(2, 11),
				flareId,
				timestamp,
			});
			await writeQueue(queue);
		} catch (e) {
			console.error("Failed to queue report", e);
		}
	},

	async syncQueuedReports(): Promise<number> {
		try {
			const queue = await readQueue();
			if (queue.length === 0) return 0;

			const flares = await readStoredFlares();
			const syncedAt = Date.now();
			const updated = flares.map((flare) => {
				const queuedMatch = queue.find(
					(item: { flareId?: string }) => item.flareId === flare.id,
				);
				if (!queuedMatch) return flare;

				return {
					...flare,
					syncStatus: undefined,
					lastUpdated: syncedAt,
				};
			});

			await writeStoredFlares(updated);
			await writeQueue([]);
			await setLastSync(syncedAt);
			return queue.length;
		} catch (e) {
			console.error("Failed to sync queued reports", e);
			return 0;
		}
	},
};
