import { getAffectedEdgeIdsForLocation } from "../data/locations";
import { nodeById, sgwEdges } from "../routing/campus";
import { findRoute } from "../routing/GraphRouter";
import { resolveBuildingId } from "../routing/routeHelpers";
import type { Flare } from "../types";

const EDGE_BY_ID = new Map(sgwEdges.map((edge) => [edge.id, edge]));

function normalizeEdgeId(edgeId: string) {
	return edgeId.endsWith("_rev") ? edgeId.slice(0, -4) : edgeId;
}

export function getShortestGraphDistance(startId: string, endId: string) {
	if (startId === endId) {
		return 0;
	}

	try {
		return (
			findRoute({
				startId,
				endId,
				preferences: ["shortest"],
			})?.totalDistance ?? Number.POSITIVE_INFINITY
		);
	} catch {
		return Number.POSITIVE_INFINITY;
	}
}

export function getFlareGraphDistance(startId: string, flare: Flare) {
	if (flare.locationId && nodeById[flare.locationId]) {
		return getShortestGraphDistance(startId, flare.locationId);
	}

	const affectedEdges = flare.locationId
		? [...new Set(getAffectedEdgeIdsForLocation(flare.locationId))]
				.map(normalizeEdgeId)
				.map((edgeId) => EDGE_BY_ID.get(edgeId))
				.filter((edge) => edge !== undefined)
		: [];

	if (affectedEdges.length > 0) {
		return affectedEdges.reduce((shortestDistance, edge) => {
			const distanceToEdge = Math.min(
				getShortestGraphDistance(startId, edge.from),
				getShortestGraphDistance(startId, edge.to),
			);
			return Math.min(shortestDistance, distanceToEdge + edge.distance / 2);
		}, Number.POSITIVE_INFINITY);
	}

	return getShortestGraphDistance(startId, resolveBuildingId(flare.building));
}
