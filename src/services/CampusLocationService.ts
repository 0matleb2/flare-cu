import * as Location from "expo-location";
import { SGW_BUILDINGS, type SgwBuilding } from "../data/sgwBuildings";

export type CampusBuilding = SgwBuilding;
type LocatableCampusBuilding = SgwBuilding & {
	latitude: number;
	longitude: number;
};

export interface ResolvedCampusLocation {
	building: CampusBuilding;
	source: "gps" | "fallback";
	message: string;
	accuracyMeters?: number;
}

const CAMPUS_BUILDINGS = SGW_BUILDINGS.filter(
	(building): building is LocatableCampusBuilding =>
		building.latitude !== undefined && building.longitude !== undefined,
);

export const DEFAULT_CAMPUS_BUILDING =
	SGW_BUILDINGS.find((building) => building.code === "MB") ??
	CAMPUS_BUILDINGS[0];

const CAMPUS_MATCH_RADIUS_METERS = 140;
const GPS_CONFIDENCE_THRESHOLD_METERS = 70;

function toRadians(value: number) {
	return (value * Math.PI) / 180;
}

function getDistanceMeters(
	latitudeA: number,
	longitudeA: number,
	latitudeB: number,
	longitudeB: number,
) {
	const earthRadiusMeters = 6371000;
	const deltaLatitude = toRadians(latitudeB - latitudeA);
	const deltaLongitude = toRadians(longitudeB - longitudeA);
	const startLatitude = toRadians(latitudeA);
	const endLatitude = toRadians(latitudeB);

	const a =
		Math.sin(deltaLatitude / 2) ** 2 +
		Math.cos(startLatitude) *
			Math.cos(endLatitude) *
			Math.sin(deltaLongitude / 2) ** 2;

	return 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearestCampusBuilding(latitude: number, longitude: number) {
	return CAMPUS_BUILDINGS.map((building) => ({
		building,
		distanceMeters: getDistanceMeters(
			latitude,
			longitude,
			building.latitude,
			building.longitude,
		),
	})).sort((a, b) => a.distanceMeters - b.distanceMeters)[0];
}

function getFallbackResult(message: string): ResolvedCampusLocation {
	return {
		building: DEFAULT_CAMPUS_BUILDING,
		source: "fallback",
		message,
	};
}

export async function detectCampusLocation(): Promise<ResolvedCampusLocation> {
	const permission = await Location.requestForegroundPermissionsAsync();

	if (permission.status !== "granted") {
		return getFallbackResult(
			"Location access was skipped. Defaulted to MB Building. You can edit it manually.",
		);
	}

	try {
		const position = await Location.getCurrentPositionAsync({
			accuracy: Location.Accuracy.Balanced,
		});
		const nearest = findNearestCampusBuilding(
			position.coords.latitude,
			position.coords.longitude,
		);
		const accuracyMeters = position.coords.accuracy ?? undefined;
		const isPreciseEnough =
			nearest.distanceMeters <= CAMPUS_MATCH_RADIUS_METERS &&
			(accuracyMeters === undefined ||
				accuracyMeters <= GPS_CONFIDENCE_THRESHOLD_METERS);

		if (isPreciseEnough) {
			return {
				building: nearest.building,
				source: "gps",
				accuracyMeters,
				message: `Detected nearby campus location: ${nearest.building.name}.`,
			};
		}

		return getFallbackResult(
			"Indoor GPS was not precise enough. Defaulted to MB Building. You can edit it manually.",
		);
	} catch {
		return getFallbackResult(
			"Location lookup was unavailable. Defaulted to MB Building. You can edit it manually.",
		);
	}
}
