export interface SgwBuilding {
	code: string;
	name: string;
	officialName: string;
	address: string;
	latitude?: number;
	longitude?: number;
}

const ALL_SGW_BUILDINGS: SgwBuilding[] = [
	{
		code: "B",
		name: "B Annex",
		officialName: "B Annex",
		address: "2160 Bishop St.",
	},
	{
		code: "CI",
		name: "CI Annex",
		officialName: "CI Annex",
		address: "2149 Mackay St.",
	},
	{
		code: "CL",
		name: "CL Building",
		officialName: "CL Annex",
		address: "1665 Ste-Catherine St. W.",
		latitude: 45.49491,
		longitude: -73.57942,
	},
	{
		code: "D",
		name: "D Annex",
		officialName: "D Annex",
		address: "2140 Bishop St.",
	},
	{
		code: "EN",
		name: "EN Annex",
		officialName: "EN Annex",
		address: "2070 Mackay St.",
	},
	{
		code: "ER",
		name: "ER Building",
		officialName: "ER Building",
		address: "2155 Guy St.",
		latitude: 45.4931,
		longitude: -73.58105,
	},
	{
		code: "EV",
		name: "EV Building",
		officialName:
			"Engineering, Computer Science and Visual Arts Integrated Complex",
		address: "1515 Ste-Catherine St. W.",
		latitude: 45.49603,
		longitude: -73.57755,
	},
	{
		code: "FA",
		name: "FA Annex",
		officialName: "FA Annex",
		address: "2060 Mackay St.",
	},
	{
		code: "FB",
		name: "FB Building",
		officialName: "Faubourg Building",
		address: "1250 Guy St. and 1600 Ste-Catherine St. W.",
	},
	{
		code: "FG",
		name: "FG Building",
		officialName: "Faubourg Ste-Catherine Building",
		address: "1610 Ste-Catherine St. W.",
		latitude: 45.49509,
		longitude: -73.57683,
	},
	{
		code: "GA",
		name: "GA Annex",
		officialName: "Grey Nuns Annex",
		address: "1211-1215 St-Mathieu St.",
	},
	{
		code: "GM",
		name: "GM Building",
		officialName: "Guy-De Maisonneuve Building",
		address: "1550 De Maisonneuve Blvd. W.",
		latitude: 45.49667,
		longitude: -73.57905,
	},
	{
		code: "GN",
		name: "GN Building",
		officialName: "Grey Nuns Building",
		address: "1190 Guy St. and 1175 St-Mathieu St.",
	},
	{
		code: "GS",
		name: "GS Building",
		officialName: "GS Building",
		address: "1538 Sherbrooke St. W.",
	},
	{
		code: "H",
		name: "Hall Building",
		officialName: "Henry F. Hall Building",
		address: "1455 De Maisonneuve Blvd. W.",
		latitude: 45.49712,
		longitude: -73.57875,
	},
	{
		code: "K",
		name: "K Annex",
		officialName: "K Annex",
		address: "2150 Bishop St.",
	},
	{
		code: "LB",
		name: "LB Building",
		officialName: "J.W. McConnell Building",
		address: "1400 De Maisonneuve Blvd. W.",
		latitude: 45.49754,
		longitude: -73.57947,
	},
	{
		code: "LD",
		name: "LD Building",
		officialName: "LD Building",
		address: "1424 Bishop St.",
	},
	{
		code: "LS",
		name: "Learning Square",
		officialName: "Learning Square",
		address: "1535 De Maisonneuve Blvd. W.",
	},
	{
		code: "M",
		name: "M Annex",
		officialName: "M Annex",
		address: "2135 Mackay St.",
	},
	{
		code: "MB",
		name: "MB Building",
		officialName: "John Molson Building",
		address: "1450 Guy St.",
		latitude: 45.49574,
		longitude: -73.57981,
	},
	{
		code: "MI",
		name: "MI Annex",
		officialName: "MI Annex",
		address: "2130 Bishop St.",
	},
	{
		code: "MU",
		name: "MU Annex",
		officialName: "MU Annex",
		address: "2170 Bishop St.",
	},
	{
		code: "P",
		name: "P Annex",
		officialName: "P Annex",
		address: "2020 Mackay St.",
	},
	{
		code: "PR",
		name: "PR Annex",
		officialName: "PR Annex",
		address: "2100 Mackay St.",
	},
	{
		code: "Q",
		name: "Q Annex",
		officialName: "Q Annex",
		address: "2010 Mackay St.",
	},
	{
		code: "R",
		name: "R Annex",
		officialName: "R Annex",
		address: "2050 Mackay St.",
	},
	{
		code: "RR",
		name: "RR Annex",
		officialName: "RR Annex",
		address: "2040 Mackay St.",
	},
	{
		code: "S",
		name: "S Annex",
		officialName: "S Annex",
		address: "2145 Mackay St.",
	},
	{
		code: "SB",
		name: "SB Building",
		officialName: "Samuel Bronfman Building",
		address: "1590 Docteur-Penfield.",
	},
	{
		code: "T",
		name: "T Annex",
		officialName: "T Annex",
		address: "2030 Mackay St.",
	},
	{
		code: "TD",
		name: "TD Building",
		officialName: "Toronto-Dominion Building",
		address: "1410 Guy St.",
	},
	{
		code: "V",
		name: "V Annex",
		officialName: "V Annex",
		address: "2110 Mackay St.",
	},
	{
		code: "VA",
		name: "VA Building",
		officialName: "Visual Arts Building",
		address: "1395 Rene-Levesque Blvd. W.",
	},
	{
		code: "X",
		name: "X Annex",
		officialName: "X Annex",
		address: "2080 Mackay St.",
	},
	{
		code: "Z",
		name: "Z Annex",
		officialName: "Z Annex",
		address: "2090 Mackay St.",
	},
];

export const APP_SGW_BUILDING_CODES = [
	"H",
	"EV",
	"MB",
	"LB",
	"GM",
	"LS",
	"FB",
	"FG",
	"GN",
	"GA",
	"VA",
] as const;

export const SGW_BUILDINGS = APP_SGW_BUILDING_CODES.flatMap((code) =>
	ALL_SGW_BUILDINGS.filter((building) => building.code === code),
);

export const PRIMARY_SGW_BUILDING_CODES = APP_SGW_BUILDING_CODES;

export const PRIMARY_SGW_BUILDINGS = PRIMARY_SGW_BUILDING_CODES.flatMap(
	(code) => ALL_SGW_BUILDINGS.filter((building) => building.code === code),
);

export const ROUTE_QUICK_BUILDING_CODES = [
	"MB",
	"H",
	"EV",
	"LB",
	"GM",
	"LS",
	"FG",
	"FB",
	"GN",
] as const;

export const ROUTE_QUICK_BUILDINGS = ROUTE_QUICK_BUILDING_CODES.flatMap(
	(code) => ALL_SGW_BUILDINGS.filter((building) => building.code === code),
);

export const SGW_BUILDING_NAMES = SGW_BUILDINGS.map(
	(building) => building.name,
);
