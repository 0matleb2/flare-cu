import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "@flare_cu_mock_users";

export const AuthService = {
	async getUsers(): Promise<Record<string, string>> {
		try {
			const json = await AsyncStorage.getItem(USERS_KEY);
			if (json) {
				return JSON.parse(json);
			}
			return {};
		} catch {
			return {};
		}
	},

	async register(email: string, password: string): Promise<void> {
		const users = await this.getUsers();
		if (users[email.toLowerCase()]) {
			throw new Error("An account with this email already exists.");
		}
		users[email.toLowerCase()] = password;
		await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
	},

	async login(email: string, password: string): Promise<void> {
		const users = await this.getUsers();
		const storedPassword = users[email.toLowerCase()];
		if (!storedPassword || storedPassword !== password) {
			throw new Error("Invalid email or password.");
		}
	},
};
