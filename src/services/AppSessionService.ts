import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_SESSION_KEY = "@flare_cu_app_session";

export type SessionAccessMode = "guest" | "account";
export interface AppSession {
	isOnboarded: boolean;
	accessMode: SessionAccessMode;
	userEmail?: string;
}

export const DEFAULT_APP_SESSION: AppSession = {
	isOnboarded: false,
	accessMode: "guest",
};

export const AppSessionService = {
	async getSession(): Promise<AppSession> {
		try {
			const json = await AsyncStorage.getItem(APP_SESSION_KEY);
			if (json) {
				return { ...DEFAULT_APP_SESSION, ...JSON.parse(json) };
			}
			return DEFAULT_APP_SESSION;
		} catch {
			return DEFAULT_APP_SESSION;
		}
	},

	async saveSession(session: Partial<AppSession>): Promise<void> {
		try {
			const current = await this.getSession();
			const updated = { ...current, ...session };
			await AsyncStorage.setItem(APP_SESSION_KEY, JSON.stringify(updated));
		} catch (e) {
			console.error("Failed to save app session", e);
		}
	},

	async clearSession(): Promise<void> {
		try {
			await AsyncStorage.removeItem(APP_SESSION_KEY);
		} catch (e) {
			console.error("Failed to clear app session", e);
		}
	},
};
