import type { FlareCategory } from "../types";

export type CampusLocationType =
	| "building"
	| "entrance"
	| "intersection"
	| "street_segment"
	| "transit"
	| "connector";

export interface CampusLocationOption {
	id: string;
	label: string;
	type: CampusLocationType;
}

export interface CampusLocationGroup {
	title: string;
	type: CampusLocationType;
	options: CampusLocationOption[];
}

export const buildingOptions: CampusLocationOption[] = [
	{ id: "H", label: "Hall Building (H)", type: "building" },
	{ id: "EV", label: "EV Building", type: "building" },
	{ id: "MB", label: "John Molson Building (MB)", type: "building" },
	{ id: "LB", label: "Library Building (LB)", type: "building" },
	{ id: "GM", label: "Guy-De Maisonneuve Building (GM)", type: "building" },
	{ id: "LS", label: "Learning Square (LS)", type: "building" },
	{ id: "FB", label: "Faubourg Building (FB)", type: "building" },
	{ id: "FG", label: "Faubourg Ste-Catherine (FG)", type: "building" },
	{ id: "GN", label: "Grey Nuns Building (GN)", type: "building" },
	{ id: "GA", label: "Grey Nuns Annex (GA)", type: "building" },
	{ id: "VA", label: "Visual Arts Building (VA)", type: "building" },
];

export const entranceOptions: CampusLocationOption[] = [
	{ id: "H_main_entrance", label: "Hall main entrance", type: "entrance" },
	{ id: "EV_main_entrance", label: "EV main entrance", type: "entrance" },
	{ id: "MB_main_entrance", label: "MB main entrance", type: "entrance" },
	{ id: "LB_main_entrance", label: "LB main entrance", type: "entrance" },
	{ id: "GM_main_entrance", label: "GM main entrance", type: "entrance" },
	{ id: "LS_main_entrance", label: "LS main entrance", type: "entrance" },
	{ id: "FB_main_entrance", label: "FB main entrance", type: "entrance" },
	{ id: "FG_main_entrance", label: "FG main entrance", type: "entrance" },
	{ id: "GN_main_entrance", label: "GN main entrance", type: "entrance" },
	{ id: "GA_main_entrance", label: "GA main entrance", type: "entrance" },
	{ id: "VA_main_entrance", label: "VA main entrance", type: "entrance" },
];

export const intersectionOptions: CampusLocationOption[] = [
	{ id: "guy_sherbrooke", label: "Guy / Sherbrooke", type: "intersection" },
	{
		id: "mackay_sherbrooke",
		label: "Mackay / Sherbrooke",
		type: "intersection",
	},
	{
		id: "bishop_sherbrooke",
		label: "Bishop / Sherbrooke",
		type: "intersection",
	},
	{
		id: "guy_demaisonneuve",
		label: "Guy / De Maisonneuve",
		type: "intersection",
	},
	{
		id: "stmathieu_demaisonneuve",
		label: "St-Mathieu / De Maisonneuve",
		type: "intersection",
	},
	{
		id: "mackay_demaisonneuve",
		label: "Mackay / De Maisonneuve",
		type: "intersection",
	},
	{
		id: "bishop_demaisonneuve",
		label: "Bishop / De Maisonneuve",
		type: "intersection",
	},
	{
		id: "guy_stecatherine",
		label: "Guy / Sainte-Catherine",
		type: "intersection",
	},
	{
		id: "stmathieu_stecatherine",
		label: "St-Mathieu / Sainte-Catherine",
		type: "intersection",
	},
	{
		id: "mackay_stecatherine",
		label: "Mackay / Sainte-Catherine",
		type: "intersection",
	},
	{
		id: "bishop_stecatherine",
		label: "Bishop / Sainte-Catherine",
		type: "intersection",
	},
	{
		id: "guy_renelevesque",
		label: "Guy / René-Lévesque",
		type: "intersection",
	},
	{
		id: "stmathieu_renelevesque",
		label: "St-Mathieu / René-Lévesque",
		type: "intersection",
	},
	{
		id: "bishop_renelevesque",
		label: "Bishop / René-Lévesque",
		type: "intersection",
	},
];

export const streetSegmentOptions: CampusLocationOption[] = [
	{
		id: "guy_sherbrooke_to_demaisonneuve",
		label: "Guy, Sherbrooke to De Maisonneuve",
		type: "street_segment",
	},
	{
		id: "guy_demaisonneuve_to_stecatherine",
		label: "Guy, De Maisonneuve to Sainte-Catherine",
		type: "street_segment",
	},
	{
		id: "guy_stecatherine_to_renelevesque",
		label: "Guy, Sainte-Catherine to René-Lévesque",
		type: "street_segment",
	},
	{
		id: "mackay_sherbrooke_to_demaisonneuve",
		label: "Mackay, Sherbrooke to De Maisonneuve",
		type: "street_segment",
	},
	{
		id: "mackay_demaisonneuve_to_stecatherine",
		label: "Mackay, De Maisonneuve to Sainte-Catherine",
		type: "street_segment",
	},
	{
		id: "bishop_sherbrooke_to_demaisonneuve",
		label: "Bishop, Sherbrooke to De Maisonneuve",
		type: "street_segment",
	},
	{
		id: "bishop_demaisonneuve_to_stecatherine",
		label: "Bishop, De Maisonneuve to Sainte-Catherine",
		type: "street_segment",
	},
	{
		id: "bishop_stecatherine_to_renelevesque",
		label: "Bishop, Sainte-Catherine to René-Lévesque",
		type: "street_segment",
	},
	{
		id: "stmathieu_demaisonneuve_to_stecatherine",
		label: "St-Mathieu, De Maisonneuve to Sainte-Catherine",
		type: "street_segment",
	},
	{
		id: "stmathieu_stecatherine_to_renelevesque",
		label: "St-Mathieu, Sainte-Catherine to René-Lévesque",
		type: "street_segment",
	},
	{
		id: "demaisonneuve_guy_to_stmathieu",
		label: "De Maisonneuve, Guy to St-Mathieu",
		type: "street_segment",
	},
	{
		id: "demaisonneuve_stmathieu_to_mackay",
		label: "De Maisonneuve, St-Mathieu to Mackay",
		type: "street_segment",
	},
	{
		id: "demaisonneuve_mackay_to_bishop",
		label: "De Maisonneuve, Mackay to Bishop",
		type: "street_segment",
	},
	{
		id: "stecatherine_guy_to_stmathieu",
		label: "Sainte-Catherine, Guy to St-Mathieu",
		type: "street_segment",
	},
	{
		id: "stecatherine_stmathieu_to_mackay",
		label: "Sainte-Catherine, St-Mathieu to Mackay",
		type: "street_segment",
	},
	{
		id: "stecatherine_mackay_to_bishop",
		label: "Sainte-Catherine, Mackay to Bishop",
		type: "street_segment",
	},
	{
		id: "renelevesque_guy_to_stmathieu",
		label: "René-Lévesque, Guy to St-Mathieu",
		type: "street_segment",
	},
	{
		id: "renelevesque_stmathieu_to_bishop",
		label: "René-Lévesque, St-Mathieu to Bishop",
		type: "street_segment",
	},
];

export const connectorOptions: CampusLocationOption[] = [
	{ id: "guy_concordia_metro", label: "Guy-Concordia Metro", type: "transit" },
	{ id: "H_MB_tunnel", label: "Hall to MB connector", type: "connector" },
	{ id: "H_GM_tunnel", label: "Hall to GM connector", type: "connector" },
	{ id: "GM_LB_tunnel", label: "GM to LB connector", type: "connector" },
];

export const flareLocationOptions: CampusLocationOption[] = [
	...buildingOptions,
	...entranceOptions,
	...intersectionOptions,
	...streetSegmentOptions,
	...connectorOptions,
];

export const flareCategoryToAllowedTypes: Record<
	FlareCategory,
	CampusLocationType[]
> = {
	blocked_entrance: ["entrance", "connector", "transit"],
	dense_crowd: [
		"entrance",
		"intersection",
		"street_segment",
		"connector",
		"transit",
		"building",
	],
	access_restriction: ["building", "entrance", "connector"],
	construction: ["street_segment", "intersection", "entrance", "building"],
	other: [
		"building",
		"entrance",
		"intersection",
		"street_segment",
		"connector",
		"transit",
	],
};

const LOCATION_GROUP_LABELS: Record<CampusLocationType, string> = {
	building: "Buildings",
	entrance: "Entrances",
	intersection: "Intersections",
	street_segment: "Street segments",
	transit: "Transit",
	connector: "Connectors",
};

const LOCATION_GROUP_ORDER: CampusLocationType[] = [
	"entrance",
	"intersection",
	"street_segment",
	"connector",
	"transit",
	"building",
];

const POPULAR_LOCATION_IDS = [
	"H_main_entrance",
	"EV_main_entrance",
	"guy_demaisonneuve",
	"guy_concordia_metro",
] as const;

const STREET_SEGMENT_EDGE_IDS: Record<string, string[]> = {
	guy_sherbrooke_to_demaisonneuve: ["e_guy_1", "e_guy_2"],
	guy_demaisonneuve_to_stecatherine: ["e_guy_3"],
	guy_stecatherine_to_renelevesque: ["e_guy_4"],
	mackay_sherbrooke_to_demaisonneuve: ["e_mk_1", "e_mk_2"],
	mackay_demaisonneuve_to_stecatherine: ["e_mk_3"],
	bishop_sherbrooke_to_demaisonneuve: ["e_bp_1", "e_bp_2"],
	bishop_demaisonneuve_to_stecatherine: ["e_bp_3"],
	bishop_stecatherine_to_renelevesque: ["e_bp_4"],
	stmathieu_demaisonneuve_to_stecatherine: ["e_sm_1"],
	stmathieu_stecatherine_to_renelevesque: ["e_sm_2"],
	demaisonneuve_guy_to_stmathieu: ["e_dm_1"],
	demaisonneuve_stmathieu_to_mackay: ["e_dm_2"],
	demaisonneuve_mackay_to_bishop: ["e_dm_3"],
	stecatherine_guy_to_stmathieu: ["e_sc_1"],
	stecatherine_stmathieu_to_mackay: ["e_sc_2"],
	stecatherine_mackay_to_bishop: ["e_sc_3"],
	renelevesque_guy_to_stmathieu: ["e_rl_1"],
	renelevesque_stmathieu_to_bishop: ["e_rl_2"],
};

function stripBuildingCode(label: string) {
	return label.replace(/\s*\([A-Z]+\)\s*$/, "");
}

function expandBidirectionalEdgeIds(edgeIds: string[]) {
	return edgeIds.flatMap((edgeId) => [edgeId, `${edgeId}_rev`]);
}

export function getLocationOptionsForCategory(
	category: FlareCategory,
): CampusLocationOption[] {
	const allowedTypes = flareCategoryToAllowedTypes[category];
	return flareLocationOptions.filter((option) =>
		allowedTypes.includes(option.type),
	);
}

export function getPopularLocationOptionsForCategory(
	category: FlareCategory,
): CampusLocationOption[] {
	const allowedTypes = new Set(flareCategoryToAllowedTypes[category]);
	return flareLocationOptions.filter(
		(option) =>
			POPULAR_LOCATION_IDS.includes(
				option.id as (typeof POPULAR_LOCATION_IDS)[number],
			) && allowedTypes.has(option.type),
	);
}

export function groupLocationOptions(
	options: CampusLocationOption[],
): CampusLocationGroup[] {
	return LOCATION_GROUP_ORDER.map((type) => ({
		title: LOCATION_GROUP_LABELS[type],
		type,
		options: options.filter((option) => option.type === type),
	})).filter((group) => group.options.length > 0);
}

export function getLocationOptionById(locationId: string) {
	return flareLocationOptions.find((option) => option.id === locationId);
}

export function getDefaultLocationIdForCategory(
	category: FlareCategory,
	buildingCode?: string,
): string | undefined {
	if (!buildingCode) {
		return undefined;
	}

	const allowedTypes = new Set(flareCategoryToAllowedTypes[category]);
	const mainEntranceId = `${buildingCode}_main_entrance`;

	if (
		allowedTypes.has("entrance") &&
		entranceOptions.some((option) => option.id === mainEntranceId)
	) {
		return mainEntranceId;
	}

	if (
		allowedTypes.has("building") &&
		buildingOptions.some((option) => option.id === buildingCode)
	) {
		return buildingCode;
	}

	return undefined;
}

export function getAffectedEdgeIdsForLocation(locationId: string): string[] {
	const edgeIds = STREET_SEGMENT_EDGE_IDS[locationId];
	return edgeIds ? expandBidirectionalEdgeIds(edgeIds) : [];
}

export function getLocationDetails(locationId: string): {
	label: string;
	buildingCode?: string;
	buildingName?: string;
	entranceName?: string;
} {
	const option = getLocationOptionById(locationId);

	if (!option) {
		return { label: locationId, buildingName: locationId };
	}

	if (option.type === "building") {
		return {
			label: option.label,
			buildingCode: option.id,
			buildingName: stripBuildingCode(option.label),
		};
	}

	if (option.type === "entrance") {
		const buildingCode = option.id.split("_")[0];
		const buildingOption = buildingOptions.find(
			(candidate) => candidate.id === buildingCode,
		);

		return {
			label: option.label,
			buildingCode,
			buildingName: buildingOption
				? stripBuildingCode(buildingOption.label)
				: buildingCode,
			entranceName: option.label,
		};
	}

	return { label: option.label, buildingName: option.label };
}
