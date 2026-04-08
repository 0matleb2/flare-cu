import { getAffectedEdgeIdsForLocation } from "../data/locations";
import { getRecommendedAction } from "../utils/recommendations";
import { type CampusNode, sgwNodes } from "./campus";
import type { ActiveFlare, RouteResult } from "./GraphRouter";

export interface RouteStep {
	stepNumber: number;
	text: string;
	fromNodeId: string;
	toNodeId: string;
	distance: number;
	indoor?: boolean;
	accessible?: boolean;
	warning?: string;
	flareId?: string;
}

export interface FormattedRoute {
	summary: string;
	steps: RouteStep[];
	edgeIds: string[];
}

const nodeMap: Record<string, CampusNode> = Object.fromEntries(
	sgwNodes.map((node) => [node.id, node]),
);

function getNodeLabel(nodeId: string): string {
	return nodeMap[nodeId]?.label ?? nodeId;
}

function flareAffectsStep(
	edgeId: string,
	fromNodeId: string,
	toNodeId: string,
	flares: ActiveFlare[] = [],
): ActiveFlare | null {
	for (const flare of flares) {
		const affectedEdgeIds = getAffectedEdgeIdsForLocation(flare.locationId);
		if (affectedEdgeIds.includes(edgeId)) return flare;

		if (flare.locationId === fromNodeId || flare.locationId === toNodeId) {
			return flare;
		}
	}
	return null;
}

function buildStepWarning(flare: ActiveFlare | null): string | undefined {
	if (!flare) return undefined;

	const severity = flare.severity === "blocked" ? "high" : flare.severity;
	const recommendation = getRecommendedAction(flare.category, severity);

	return recommendation;
}

export function formatRoute(
	route: RouteResult,
	activeFlares: ActiveFlare[] = [],
): FormattedRoute {
	const steps: RouteStep[] = route.pathEdges.map((edge, index) => {
		const flare = flareAffectsStep(edge.id, edge.from, edge.to, activeFlares);

		return {
			stepNumber: index + 1,
			text:
				edge.instruction ??
				`Move from ${getNodeLabel(edge.from)} to ${getNodeLabel(edge.to)}.`,
			fromNodeId: edge.from,
			toNodeId: edge.to,
			distance: edge.distance,
			indoor: edge.indoor,
			accessible: edge.accessible,
			warning: buildStepWarning(flare),
			flareId: flare?.id,
		};
	});

	const startLabel = getNodeLabel(route.pathNodeIds[0]);
	const endLabel = getNodeLabel(
		route.pathNodeIds[route.pathNodeIds.length - 1],
	);

	const summary = `Route from ${startLabel} to ${endLabel}, ${route.totalDistance} distance units, ${steps.length} steps.`;

	return {
		summary,
		steps,
		edgeIds: route.pathEdges.map((edge) => edge.id),
	};
}
