const fs = require("node:fs");
const file = "src/screens/RouteResultsScreen.tsx";
let content = fs.readFileSync(file, "utf8");

const importRegex =
	/import type \{ RouteLabel \} from "\.\.\/types";\nimport \{ ROUTE_LABEL_DISPLAY \} from "\.\.\/types";/m;
content = content.replace(
	importRegex,
	`import type { RouteLabel } from "../types";
import { ROUTE_LABEL_DISPLAY } from "../types";
import { getRouteInstructions, mapFlaresToActiveFlares, resolveBuildingId } from "../routing/routeHelpers";
import { useFlares } from "../hooks/useFlares";`,
);

const buildRoutesReplacement = `
export const RouteResultsScreen = () => {
	const navigation = useNavigation<RouteResultsNavProp>();
	const route = useRoute<ResultsRoute>();
	const insets = useSafeAreaInsets();
	const { data: flares = [] } = useFlares();

	const activeFlares = mapFlaresToActiveFlares(flares);
	const startId = resolveBuildingId(route.params.from || "guy_concordia_metro");
	const endId = resolveBuildingId(route.params.to || "H");

	// Generate dynamic routes for the 3 categories
	const fastestRoute = getRouteInstructions({ startId, endId, activeFlares, preferences: ["shortest"] });
	const safestRoute = getRouteInstructions({ startId, endId, activeFlares, preferences: ["avoidCrowds", "shortest"] });
	const accessibleRoute = getRouteInstructions({ startId, endId, activeFlares, preferences: ["accessibleOnly", "shortest"] });

	const dynamicRoutes = [
		{
			id: "r-fastest",
			label: "fastest_safe" as RouteLabel,
			steps: fastestRoute.ok && fastestRoute.route ? fastestRoute.route.steps.map(s => ({
				instruction: s.text,
				warning: s.warning
			})) : [{ instruction: "Cannot calculate fastest route." }]
		},
		{
			id: "r-safest",
			label: "safest" as RouteLabel,
			steps: safestRoute.ok && safestRoute.route ? safestRoute.route.steps.map(s => ({
				instruction: s.text,
				warning: s.warning
			})) : [{ instruction: "Cannot calculate safest route." }]
		},
		{
			id: "r-accessible",
			label: "accessible" as RouteLabel,
			steps: accessibleRoute.ok && accessibleRoute.route ? accessibleRoute.route.steps.map(s => ({
				instruction: s.text,
				warning: s.warning
			})) : [{ instruction: "Cannot calculate accessible route." }]
		}
	];

	const orderedRoutes = orderRoutes(dynamicRoutes, {
		mobilityFriendly: route.params.mobilityFriendly,
		lowStimulation: route.params.lowStimulation,
	});

	return (
`;

const exportRegex =
	/export const RouteResultsScreen = \(\) => \{[\s\S]*?return \(/m;
content = content.replace(exportRegex, buildRoutesReplacement);

// remove ALL_ROUTES mock
const mockRouteRegex = /const ALL_ROUTES: MockRoute\[\] = \[[\s\S]*?\];/m;
content = content.replace(mockRouteRegex, "");

fs.writeFileSync(file, content);
