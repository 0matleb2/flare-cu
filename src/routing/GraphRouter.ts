import {
	getAffectedEdgeIdsForLocation,
	getLocationOptionById,
} from "../data/locations";
import type { FlareCategory } from "../types";
import {
	type CampusEdge,
	type CampusNode,
	sgwBidirectionalEdges,
	sgwNodes,
} from "./campus";

export type RoutePreference =
	| "preferIndoor"
	| "accessibleOnly"
	| "avoidCrowds"
	| "shortest";

export type FlareSeverity = "low" | "medium" | "high" | "blocked";

export interface ActiveFlare {
	id: string;
	category: FlareCategory;
	locationId: string;
	severity: FlareSeverity;
	label?: string;
	note?: string;
	tags?: string[];
}

export interface RouteRequest {
	startId: string;
	endId: string;
	preferences?: RoutePreference[];
	activeFlares?: ActiveFlare[];
	discouragedEdgeIds?: string[];
}

export interface RouteResult {
	pathNodeIds: string[];
	pathEdges: CampusEdge[];
	totalCost: number;
	totalDistance: number;
}

interface WeightedEdge extends CampusEdge {
	effectiveCost: number;
}

const OVERLAP_PENALTY = 12;

const nodeMap: Record<string, CampusNode> = Object.fromEntries(
	sgwNodes.map((node) => [node.id, node]),
);

function hasPreference(
	preferences: RoutePreference[] | undefined,
	pref: RoutePreference,
): boolean {
	return !!preferences?.includes(pref);
}

function getAffectedNodeIdsForLocation(locationId: string): string[] {
	const option = getLocationOptionById(locationId);

	if (!option) return [];

	switch (option.type) {
		case "building":
		case "entrance":
		case "intersection":
		case "transit":
		case "connector":
			return [locationId];
		case "street_segment":
			return [];
		default:
			return [];
	}
}

function flareHitsEdge(edge: CampusEdge, flare: ActiveFlare): boolean {
	const affectedEdgeIds = getAffectedEdgeIdsForLocation(flare.locationId);
	if (affectedEdgeIds.includes(edge.id)) {
		return true;
	}

	const affectedNodeIds = getAffectedNodeIdsForLocation(flare.locationId);
	if (
		affectedNodeIds.includes(edge.from) ||
		affectedNodeIds.includes(edge.to)
	) {
		return true;
	}

	return false;
}

function getLocationTypePenaltyMultiplier(locationId: string): number {
	const option = getLocationOptionById(locationId);
	if (!option) return 1;

	switch (option.type) {
		case "building":
			return 0.6;
		case "intersection":
			return 1.1;
		case "street_segment":
			return 1.2;
		case "entrance":
		case "connector":
		case "transit":
			return 1.3;
		default:
			return 1;
	}
}

function getFlarePenalty(edge: CampusEdge, flares: ActiveFlare[] = []): number {
	let penalty = 0;

	for (const flare of flares) {
		if (!flareHitsEdge(edge, flare)) continue;

		const multiplier = getLocationTypePenaltyMultiplier(flare.locationId);

		switch (flare.severity) {
			case "low":
				penalty += 4 * multiplier;
				break;
			case "medium":
				penalty += 10 * multiplier;
				break;
			case "high":
				penalty += 30 * multiplier;
				break;
			case "blocked":
				return Number.POSITIVE_INFINITY;
		}
	}

	return penalty;
}

function getPreferencePenalty(
	edge: CampusEdge,
	preferences: RoutePreference[] = [],
): number {
	let penalty = 0;

	if (
		hasPreference(preferences, "accessibleOnly") &&
		edge.accessible === false
	) {
		return Number.POSITIVE_INFINITY;
	}

	if (hasPreference(preferences, "preferIndoor") && !edge.indoor) {
		penalty += 3;
	}

	if (hasPreference(preferences, "avoidCrowds")) {
		const crowdishTags = edge.tags ?? [];
		if (
			crowdishTags.includes("major") ||
			crowdishTags.includes("transit") ||
			crowdishTags.includes("popular")
		) {
			penalty += 2;
		}
	}

	return penalty;
}

function normalizeEdgeId(edgeId: string) {
	return edgeId.endsWith("_rev") ? edgeId.slice(0, -4) : edgeId;
}

function getOverlapPenalty(
	edge: CampusEdge,
	discouragedEdgeIds: Set<string>,
): number {
	return discouragedEdgeIds.has(normalizeEdgeId(edge.id)) ? OVERLAP_PENALTY : 0;
}

function buildAdjacency(
	edges: CampusEdge[],
	preferences: RoutePreference[] = [],
	flares: ActiveFlare[] = [],
	discouragedEdgeIds: Set<string> = new Set(),
): Record<string, WeightedEdge[]> {
	const adjacency: Record<string, WeightedEdge[]> = {};

	for (const edge of edges) {
		const flarePenalty = getFlarePenalty(edge, flares);
		const prefPenalty = getPreferencePenalty(edge, preferences);
		const overlapPenalty = getOverlapPenalty(edge, discouragedEdgeIds);

		const effectiveCost =
			flarePenalty === Number.POSITIVE_INFINITY ||
			prefPenalty === Number.POSITIVE_INFINITY
				? Number.POSITIVE_INFINITY
				: edge.distance + flarePenalty + prefPenalty + overlapPenalty;

		if (!adjacency[edge.from]) {
			adjacency[edge.from] = [];
		}

		adjacency[edge.from].push({
			...edge,
			effectiveCost,
		});
	}

	return adjacency;
}

export function findRoute({
	startId,
	endId,
	preferences = ["shortest"],
	activeFlares = [],
	discouragedEdgeIds = [],
}: RouteRequest): RouteResult | null {
	if (!nodeMap[startId] || !nodeMap[endId]) {
		throw new Error("Invalid startId or endId");
	}

	const adjacency = buildAdjacency(
		sgwBidirectionalEdges,
		preferences,
		activeFlares,
		new Set(discouragedEdgeIds.map(normalizeEdgeId)),
	);

	const distances: Record<string, number> = {};
	const previousNode: Record<string, string | null> = {};
	const previousEdge: Record<string, CampusEdge | null> = {};
	const unvisited = new Set<string>(sgwNodes.map((n) => n.id));

	for (const node of sgwNodes) {
		distances[node.id] = Number.POSITIVE_INFINITY;
		previousNode[node.id] = null;
		previousEdge[node.id] = null;
	}

	distances[startId] = 0;

	while (unvisited.size > 0) {
		let currentId: string | null = null;
		let smallestDistance = Number.POSITIVE_INFINITY;

		for (const nodeId of unvisited) {
			if (distances[nodeId] < smallestDistance) {
				smallestDistance = distances[nodeId];
				currentId = nodeId;
			}
		}

		if (!currentId || smallestDistance === Number.POSITIVE_INFINITY) {
			break;
		}

		if (currentId === endId) {
			break;
		}

		unvisited.delete(currentId);

		const neighbors = adjacency[currentId] ?? [];

		for (const edge of neighbors) {
			if (edge.effectiveCost === Number.POSITIVE_INFINITY) continue;
			if (!unvisited.has(edge.to)) continue;

			const candidate = distances[currentId] + edge.effectiveCost;

			if (candidate < distances[edge.to]) {
				distances[edge.to] = candidate;
				previousNode[edge.to] = currentId;
				previousEdge[edge.to] = edge;
			}
		}
	}

	if (distances[endId] === Number.POSITIVE_INFINITY) {
		return null;
	}

	const pathNodeIds: string[] = [];
	const pathEdges: CampusEdge[] = [];

	let current: string | null = endId;

	while (current) {
		pathNodeIds.unshift(current);

		const edge = previousEdge[current];
		if (edge) {
			pathEdges.unshift(edge);
		}

		current = previousNode[current];
	}

	const totalDistance = pathEdges.reduce((sum, edge) => sum + edge.distance, 0);

	return {
		pathNodeIds,
		pathEdges,
		totalCost: distances[endId],
		totalDistance,
	};
}
