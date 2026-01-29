export type FlareType = "safety" | "maintenance" | "medical" | "other";

export interface Flare {
	id: string;
	type: FlareType;
	description: string;
	location: string;
	timestamp: number;
	status: "active" | "resolved";
	confirmations: number;
}
