import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserPreferences } from "../types";
import { DEFAULT_PREFERENCES } from "../types";

const PREFS_KEY = "@flare_cu_preferences";

export const PreferencesService = {
	async getPreferences(): Promise<UserPreferences> {
		try {
			const json = await AsyncStorage.getItem(PREFS_KEY);
			if (json) return { ...DEFAULT_PREFERENCES, ...JSON.parse(json) };
			return DEFAULT_PREFERENCES;
		} catch {
			return DEFAULT_PREFERENCES;
		}
	},

	async savePreferences(prefs: Partial<UserPreferences>): Promise<void> {
		try {
			const current = await this.getPreferences();
			const updated = { ...current, ...prefs };
			await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(updated));
		} catch (e) {
			console.error("Failed to save preferences", e);
		}
	},

	async resetPreferences(): Promise<void> {
		try {
			await AsyncStorage.setItem(
				PREFS_KEY,
				JSON.stringify(DEFAULT_PREFERENCES),
			);
		} catch (e) {
			console.error("Failed to reset preferences", e);
		}
	},
};
