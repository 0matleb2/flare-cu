const fs = require("node:fs");
const file = "src/screens/RouteResultsScreen.tsx";
let content = fs.readFileSync(file, "utf8");

const buildRoutesRegex =
	/function buildRoutes\(params: \{([\s\S]*?)\}\): \{([\s\S]*?)\} \{([\s\S]*?)\}export const RouteResultsScreen =/m;

const newBuildRoutes = `import { getRouteInstructions, mapFlaresToActiveFlares, resolveBuildingId } from "../routing/routeHelpers";
import { RoutePreference } from "../routing/GraphRouter";

function buildRoutes(params: {
	from: string;
	to: string;
	avoidHighTension: boolean;
	mobilityFriendly: boolean;
	flares: Flare[];
}): {
	origin: DestinationProfile;
	destination: DestinationProfile;
	hotspots: Flare[];
	routes: DisplayRoute[];
} {
	const origin = getDestinationProfile(params.from);
	const destination = getDestinationProfile(params.to);
	const hotspots = getRelevantHotspots(params.flares, origin, destination);
	const hotspotSummary = summarizeHotspots(hotspots);
	const routes: DisplayRoute[] = [];

	if (origin.name === destination.name) {
		return {
			origin,
			destination,
			hotspots,
			routes: [
				{
					id: "r-already-there",
					label: "fastest_safe",
					summary: \`You are already at \${destination.name}. Use the nearest entrance and continue inside the building.\`,
					highlights: [
						"No exterior walk required",
						params.mobilityFriendly
							? \`Accessible entrance: \${destination.accessibleEntrance}\`
							: \`Nearest entrance: \${destination.mainEntrance}\`,
					],
					exposure: "low",
					supportsMobility: true,
					entrance: params.mobilityFriendly
						? destination.accessibleEntrance
						: destination.mainEntrance,
					steps: [
						{
							instruction: \`You are already at \${destination.name}.\`,
							detail:
								"Stay inside if possible and use the nearest posted entrance or lobby access point.",
						},
						{
							instruction: params.mobilityFriendly
								? \`Use the \${destination.accessibleEntrance}.\`
								: \`Use the \${destination.mainEntrance}.\`,
							warning: hotspotSummary
								? \`Stay clear of \${hotspotSummary} while moving inside the building.\`
								: undefined,
						},
					],
				},
			],
		};
	}

    const startId = resolveBuildingId(origin.name);
    const endId = resolveBuildingId(destination.name);
    const activeFlares = mapFlaresToActiveFlares(params.flares);

    // Build the primary smart route
    const prefs: RoutePreference[] = ["shortest"];
    if (params.mobilityFriendly) prefs.push("accessibleOnly");
    if (params.avoidHighTension) prefs.push("avoidCrowds");

    const smartRouteResponse = getRouteInstructions({
        startId,
        endId,
        activeFlares,
        preferences: prefs
    });

    if (smartRouteResponse.ok && smartRouteResponse.route) {
        routes.push({
            id: "r-smart",
            label: params.avoidHighTension ? "safest" : "fastest_safe",
            summary: params.avoidHighTension ? "Dynamically detoured around active flares." : "Fastest dynamic route considering current conditions.",
            highlights: [
                "Real-time graph navigation",
                params.mobilityFriendly ? "Fully accessible path" : "Shortest valid path",
            ],
            exposure: params.avoidHighTension ? "low" : "medium",
            supportsMobility: params.mobilityFriendly,
            entrance: destination.mainEntrance,
            steps: smartRouteResponse.route.steps.map(s => ({
                instruction: s.text,
                detail: s.indoor ? "Indoor path" : "Outdoor path",
                warning: s.warning,
            }))
        });
    } else {
        routes.push({
            id: "r-failed",
            label: "safest",
            summary: "No fully safe dynamic route found. Please review the map manually.",
            highlights: ["Route blocked"],
            exposure: "high",
            supportsMobility: params.mobilityFriendly,
            entrance: destination.mainEntrance,
            steps: [{
                instruction: "Cannot compute a safe route right now.",
                detail: smartRouteResponse.message
            }]
        });
    }

	return { origin, destination, hotspots, routes };
}

export const RouteResultsScreen =`;

content = content.replace(buildRoutesRegex, newBuildRoutes);

fs.writeFileSync(file, content);
