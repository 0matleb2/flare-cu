import type { Flare } from "../types";
import { buildingIndex, nodeById } from "./campus";
import { type FormattedRoute, formatRoute } from "./DirectionFormatter";
import {
	type ActiveFlare,
	findRoute,
	type RoutePreference,
} from "./GraphRouter";

export function resolveBuildingId(buildingName: string): string {
	if (nodeById[buildingName]) return buildingName;

	const lower = buildingName.toLowerCase();
	const code = Object.keys(buildingIndex).find(
		(k) =>
			buildingIndex[k].name.toLowerCase().includes(lower) ||
			buildingIndex[k].code.toLowerCase() === lower ||
			lower.includes(buildingIndex[k].code.toLowerCase()),
	);
	return code ? buildingIndex[code].id : "guy_demaisonneuve";
}

export interface GetRouteOptions {
	startId: string;
	endId: string;
	preferences?: RoutePreference[];
	activeFlares?: ActiveFlare[];
	discouragedEdgeIds?: string[];
}

export interface GetRouteResponse {
	ok: boolean;
	message: string;
	route?: FormattedRoute;
}

export function mapFlaresToActiveFlares(flares: Flare[]): ActiveFlare[] {
	return flares
		.filter((f) => f.credibility !== "resolved")
		.map((f) => {
			let severity: ActiveFlare["severity"] = "medium";
			if (f.severity === "low" || f.severity === "medium") {
				severity = f.severity;
			} else if (f.severity === "high") {
				severity = "high";
			} else if (
				f.category === "blocked_entrance" ||
				f.category === "access_restriction"
			) {
				severity = "blocked";
			} else if (f.category === "dense_crowd") {
				severity = "high";
			}

			const fallbackCode = Object.keys(buildingIndex).find(
				(k) =>
					buildingIndex[k].name === f.building ||
					buildingIndex[k].code === f.building,
			);
			const locationId = f.locationId ?? fallbackCode ?? "guy_demaisonneuve";

			return {
				id: f.id,
				category: f.category,
				locationId,
				severity,
				label: f.summary,
				note: f.note,
			};
		});
}

export function getRouteInstructions({
	startId,
	endId,
	preferences = ["shortest"],
	activeFlares = [],
	discouragedEdgeIds = [],
}: GetRouteOptions): GetRouteResponse {
	const route = findRoute({
		startId,
		endId,
		preferences,
		activeFlares,
		discouragedEdgeIds,
	});

	if (!route) {
		return {
			ok: false,
			message: "No safe route is currently available.",
		};
	}

	return {
		ok: true,
		message: "Route found.",
		route: formatRoute(route, activeFlares),
	};
}
