import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Flare, FlareCategory } from "../types";
import { CONFIRM_THRESHOLD } from "../types";

const STORAGE_KEY = "@flare_cu_flares_v4";
const QUEUE_KEY = "@flare_cu_offline_queue";
const SIMULATED_DELAY_MS = 600;

const INITIAL_FLARES: Flare[] = [
	// ── Verified ─────────────────────────────────────────────
	{
		id: "1",
		category: "dense_crowd",
		credibility: "verified",
		summary: "Large crowd blocking hallway near atrium.",
		location: "EV Building, 1st Floor Atrium",
		building: "EV Building",
		entrance: "Atrium",
		timestamp: Date.now() - 1000 * 60 * 45,
		lastUpdated: Date.now() - 1000 * 60 * 20,
		timeline: [
			{ time: "09:30", label: "Reported" },
			{ time: "09:38", label: "Confirmed" },
			{ time: "09:55", label: "Verified" },
		],
		savedByUser: false,
		upvotes: 18,
		upvotedByUser: false,
	},
	{
		id: "2",
		category: "construction",
		credibility: "verified",
		summary: "Sidewalk closed, detour via Guy Street.",
		location: "Guy Street, between Hall and EV",
		building: "Guy Street",
		timestamp: Date.now() - 1000 * 60 * 120,
		lastUpdated: Date.now() - 1000 * 60 * 60,
		timeline: [
			{ time: "08:00", label: "Reported" },
			{ time: "08:10", label: "Confirmed" },
			{ time: "08:30", label: "Verified" },
		],
		savedByUser: true,
		upvotes: 16,
		upvotedByUser: true,
	},
	{
		id: "3",
		category: "access_restriction",
		credibility: "verified",
		summary:
			"Tunnel between Hall and EV closed for maintenance until Thursday.",
		location: "Hall Building, Tunnel Level",
		building: "Hall Building",
		entrance: "Tunnel",
		timestamp: Date.now() - 1000 * 60 * 200,
		lastUpdated: Date.now() - 1000 * 60 * 100,
		timeline: [
			{ time: "07:00", label: "Reported" },
			{ time: "07:20", label: "Confirmed" },
			{ time: "07:45", label: "Verified" },
		],
		savedByUser: false,
		upvotes: 21,
		upvotedByUser: false,
	},

	// ── Confirmed ────────────────────────────────────────────
	{
		id: "4",
		category: "blocked_entrance",
		credibility: "confirmed",
		summary: "Main entrance blocked due to delivery truck.",
		location: "Hall Building, Main Entrance on de Maisonneuve",
		building: "Hall Building",
		entrance: "Main Entrance",
		timestamp: Date.now() - 1000 * 60 * 15,
		lastUpdated: Date.now() - 1000 * 60 * 8,
		timeline: [
			{ time: "10:05", label: "Reported" },
			{ time: "10:12", label: "Confirmed" },
		],
		savedByUser: false,
		upvotes: 14,
		upvotedByUser: false,
	},
	{
		id: "5",
		category: "dense_crowd",
		credibility: "confirmed",
		summary: "Event setup causing crowd near LB entrance.",
		location: "LB Building, Main Entrance",
		building: "LB Building",
		entrance: "Main Entrance",
		timestamp: Date.now() - 1000 * 60 * 30,
		lastUpdated: Date.now() - 1000 * 60 * 15,
		timeline: [
			{ time: "10:10", label: "Reported" },
			{ time: "10:25", label: "Confirmed" },
		],
		savedByUser: false,
		upvotes: 11,
		upvotedByUser: false,
	},
	{
		id: "6",
		category: "blocked_entrance",
		credibility: "confirmed",
		summary: "Fire alarm testing — south entrance temporarily locked.",
		location: "GM Building, South Entrance",
		building: "GM Building",
		entrance: "South Entrance",
		timestamp: Date.now() - 1000 * 60 * 25,
		lastUpdated: Date.now() - 1000 * 60 * 12,
		timeline: [
			{ time: "10:15", label: "Reported" },
			{ time: "10:28", label: "Confirmed" },
		],
		savedByUser: false,
		upvotes: 10,
		upvotedByUser: true,
	},

	// ── Reported ─────────────────────────────────────────────
	{
		id: "7",
		category: "access_restriction",
		credibility: "reported",
		summary: "Elevator out of service, use stairs.",
		location: "MB Building, Elevators near 2nd Floor",
		building: "MB Building",
		entrance: "2nd Floor Elevators",
		timestamp: Date.now() - 1000 * 60 * 5,
		lastUpdated: Date.now() - 1000 * 60 * 5,
		timeline: [{ time: "10:37", label: "Reported" }],
		savedByUser: false,
		upvotes: 4,
		upvotedByUser: false,
	},
	{
		id: "8",
		category: "other",
		credibility: "reported",
		summary: "Ice patch near rear exit, use caution.",
		location: "GM Building, Rear Exit",
		building: "GM Building",
		entrance: "Rear Exit",
		timestamp: Date.now() - 1000 * 60 * 10,
		lastUpdated: Date.now() - 1000 * 60 * 10,
		timeline: [{ time: "10:32", label: "Reported" }],
		savedByUser: false,
		upvotes: 1,
		upvotedByUser: false,
	},
	{
		id: "9",
		category: "dense_crowd",
		credibility: "reported",
		summary: "Student protest gathering near main plaza.",
		location: "Hall Building, Main Plaza",
		building: "Hall Building",
		entrance: "Main Plaza",
		timestamp: Date.now() - 1000 * 60 * 3,
		lastUpdated: Date.now() - 1000 * 60 * 3,
		timeline: [{ time: "10:39", label: "Reported" }],
		savedByUser: false,
		upvotes: 3,
		upvotedByUser: true,
	},
	{
		id: "10",
		category: "construction",
		credibility: "reported",
		summary: "Water leak in CL Building basement, avoid lower level.",
		location: "CL Building, Basement Level",
		building: "CL Building",
		timestamp: Date.now() - 1000 * 60 * 8,
		lastUpdated: Date.now() - 1000 * 60 * 8,
		timeline: [{ time: "10:34", label: "Reported" }],
		savedByUser: false,
		upvotes: 1,
		upvotedByUser: false,
	},

	// ── Resolved (bottom) ────────────────────────────────────
	{
		id: "11",
		category: "blocked_entrance",
		credibility: "resolved",
		summary: "Fire drill completed, entrance reopened.",
		location: "Webster Library, Main Entrance",
		building: "Webster Library",
		entrance: "Main Entrance",
		timestamp: Date.now() - 1000 * 60 * 180,
		lastUpdated: Date.now() - 1000 * 60 * 90,
		timeline: [
			{ time: "07:00", label: "Reported" },
			{ time: "07:05", label: "Confirmed" },
			{ time: "07:15", label: "Verified" },
			{ time: "08:30", label: "Resolved" },
		],
		savedByUser: false,
		upvotes: 11,
		upvotedByUser: false,
	},
	{
		id: "12",
		category: "access_restriction",
		credibility: "resolved",
		summary: "Power outage in FG Building resolved, all floors accessible.",
		location: "FG Building, All Floors",
		building: "FG Building",
		timestamp: Date.now() - 1000 * 60 * 240,
		lastUpdated: Date.now() - 1000 * 60 * 150,
		timeline: [
			{ time: "06:30", label: "Reported" },
			{ time: "06:45", label: "Confirmed" },
			{ time: "07:00", label: "Verified" },
			{ time: "09:00", label: "Resolved" },
		],
		savedByUser: false,
		upvotes: 10,
		upvotedByUser: false,
	},
];

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const FlareService = {
	async getFlares(): Promise<Flare[]> {
		await wait(SIMULATED_DELAY_MS);
		try {
			const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
			if (jsonValue != null) {
				return JSON.parse(jsonValue);
			}
			// Initialize with seed data
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FLARES));
			return INITIAL_FLARES;
		} catch (e) {
			console.error("Failed to fetch flares", e);
			return [];
		}
	},

	async getFlareById(id: string): Promise<Flare | undefined> {
		const flares = await this.getFlares();
		return flares.find((f) => f.id === id);
	},

	async createFlare(data: {
		category: FlareCategory;
		building: string;
		entrance?: string;
		note?: string;
	}): Promise<Flare> {
		await wait(SIMULATED_DELAY_MS);
		const now = Date.now();
		const timeStr = new Date(now).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});

		const newFlare: Flare = {
			id: Math.random().toString(36).substring(2, 11),
			category: data.category,
			credibility: "reported",
			summary:
				data.note || `${data.category.replace(/_/g, " ")} at ${data.building}.`,
			location: data.entrance
				? `${data.building}, ${data.entrance}`
				: data.building,
			building: data.building,
			entrance: data.entrance,
			timestamp: now,
			lastUpdated: now,
			timeline: [{ time: timeStr, label: "Reported" }],
			savedByUser: false,
			note: data.note,
			upvotes: 1,
			upvotedByUser: false,
		};

		try {
			const currentFlares = await this.getFlares();
			const updatedFlares = [newFlare, ...currentFlares];
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFlares));
			return newFlare;
		} catch (e) {
			console.error("Failed to create flare", e);
			throw e;
		}
	},

	async saveFlare(id: string): Promise<void> {
		try {
			const flares = await this.getFlares();
			const updated = flares.map((f) =>
				f.id === id ? { ...f, savedByUser: true } : f,
			);
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		} catch (e) {
			console.error("Failed to save flare", e);
		}
	},

	async unsaveFlare(id: string): Promise<void> {
		try {
			const flares = await this.getFlares();
			const updated = flares.map((f) =>
				f.id === id ? { ...f, savedByUser: false } : f,
			);
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		} catch (e) {
			console.error("Failed to unsave flare", e);
		}
	},

	async upvoteFlare(id: string): Promise<void> {
		try {
			const flares = await this.getFlares();
			const updated = flares.map((f) => {
				if (f.id !== id) return f;
				const wasUpvoted = f.upvotedByUser;
				const newUpvotes = wasUpvoted
					? Math.max(0, f.upvotes - 1)
					: f.upvotes + 1;

				// Auto-promote from reported → confirmed at threshold
				let newCredibility = f.credibility;
				const newTimeline = [...f.timeline];
				if (
					!wasUpvoted &&
					f.credibility === "reported" &&
					newUpvotes >= CONFIRM_THRESHOLD
				) {
					newCredibility = "confirmed";
					const timeStr = new Date().toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					});
					newTimeline.push({ time: timeStr, label: "Confirmed" });
				}

				return {
					...f,
					upvotes: newUpvotes,
					upvotedByUser: !wasUpvoted,
					credibility: newCredibility,
					timeline: newTimeline,
					lastUpdated:
						newCredibility !== f.credibility ? Date.now() : f.lastUpdated,
				};
			});
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
		} catch (e) {
			console.error("Failed to upvote flare", e);
		}
	},

	// ── Offline queue helpers ────────────────────────────────
	async getQueueCount(): Promise<number> {
		try {
			const json = await AsyncStorage.getItem(QUEUE_KEY);
			if (json) return JSON.parse(json).length;
			return 0;
		} catch {
			return 0;
		}
	},

	async enqueueReport(data: {
		category: FlareCategory;
		building: string;
		entrance?: string;
		note?: string;
	}): Promise<void> {
		try {
			const json = await AsyncStorage.getItem(QUEUE_KEY);
			const queue = json ? JSON.parse(json) : [];
			queue.push({
				...data,
				id: Math.random().toString(36).substring(2, 11),
				timestamp: Date.now(),
			});
			await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
		} catch (e) {
			console.error("Failed to queue report", e);
		}
	},
};
