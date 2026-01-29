import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Flare } from "../types";

const STORAGE_KEY = "@flare_cu_flares";
const SIMULATED_DELAY_MS = 800;

const INITIAL_FLARES: Flare[] = [
	// SGW Campus - Hall Building
	{
		id: "1",
		type: "safety",
		location: "Hall Building, 8th Floor Escalators",
		description: "Escalator stopped suddenly, potential trip hazard.",
		timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
		status: "active",
		confirmations: 3,
	},
	{
		id: "4",
		type: "maintenance",
		location: "Hall Building, 4th Floor Bathrooms",
		description: "Water leak near the sinks, floor is very slippery.",
		timestamp: Date.now() - 1000 * 60 * 45, // 45 mins ago
		status: "active",
		confirmations: 2,
	},
	{
		id: "5",
		type: "medical",
		location: "Hall Building, 12th Floor Labs",
		description: "Student feeling dizzy in H-1220, first aid requested.",
		timestamp: Date.now() - 1000 * 60 * 10, // 10 mins ago
		status: "active",
		confirmations: 6,
	},

	// SGW Campus - EV Building
	{
		id: "2",
		type: "maintenance",
		location: "EV Building, Main Entrance",
		description: "Automatic door stuck open, very cold in lobby.",
		timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
		status: "active",
		confirmations: 12,
	},
	{
		id: "6",
		type: "safety",
		location: "EV Building, 2nd Floor Walkway",
		description: "Loose railing on the walkway to JMSB.",
		timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
		status: "active",
		confirmations: 8,
	},

	// SGW Campus - JMSB (MB Building)
	{
		id: "3",
		type: "medical",
		location: "JMSB, 2nd Floor Study Area",
		description: "Student feeling faint, security notified.",
		timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
		status: "resolved",
		confirmations: 5,
	},
	{
		id: "7",
		type: "other",
		location: "JMSB, S2.105",
		description: "Lost backpack found near the vending machines.",
		timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
		status: "active",
		confirmations: 1,
	},

	// SGW Campus - LB Building (Library)
	{
		id: "8",
		type: "safety",
		location: "Webster Library, 3rd Floor Quiet Zone",
		description: "Unattended bag left on table for over an hour.",
		timestamp: Date.now() - 1000 * 60 * 20, // 20 mins ago
		status: "active",
		confirmations: 4,
	},

	// Loyola Campus - SP Building (Science Pavilion)
	{
		id: "9",
		type: "maintenance",
		location: "SP Building, 1st Floor Hallway",
		description: "Light fixture flickering rapidly, causing headaches.",
		timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
		status: "active",
		confirmations: 15,
	},
	{
		id: "10",
		type: "medical",
		location: "SP Building, Cafeteria",
		description: "Allergic reaction reported, EpiPen administered.",
		timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
		status: "resolved",
		confirmations: 20,
	},

	// Loyola Campus - CJ Building (Communication Studies)
	{
		id: "11",
		type: "safety",
		location: "CJ Building, Rear Exit",
		description: "Ice patch on the stairs leading to the parking lot.",
		timestamp: Date.now() - 1000 * 60 * 60 * 4, // 4 hours ago
		status: "active",
		confirmations: 7,
	},

	// Loyola Campus - AD Building (Administration)
	{
		id: "12",
		type: "other",
		location: "AD Building, Front Desk",
		description: "Found student ID card, turned in to security.",
		timestamp: Date.now() - 1000 * 60 * 60 * 1, // 1 hour ago
		status: "active",
		confirmations: 0,
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
			} else {
				// Initialize with seed data if empty
				await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FLARES));
				return INITIAL_FLARES;
			}
		} catch (e) {
			console.error("Failed to fetch flares", e);
			return [];
		}
	},

	async createFlare(
		flareData: Omit<Flare, "id" | "timestamp" | "confirmations" | "status">,
	): Promise<Flare> {
		await wait(SIMULATED_DELAY_MS);
		const newFlare: Flare = {
			...flareData,
			id: Math.random().toString(36).substr(2, 9),
			timestamp: Date.now(),
			status: "active",
			confirmations: 0,
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

	async confirmFlare(id: string): Promise<void> {
		await wait(SIMULATED_DELAY_MS / 2); // Faster than full fetch
		try {
			const currentFlares = await this.getFlares();
			const updatedFlares = currentFlares.map((flare) =>
				flare.id === id
					? { ...flare, confirmations: flare.confirmations + 1 }
					: flare,
			);
			await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFlares));
		} catch (e) {
			console.error("Failed to confirm flare", e);
			throw e;
		}
	},
};
