import type { FlareCategory, FlareSeverity } from "../types";

/**
 * Returns a calm, practical mobility recommendation based on the issue type and severity.
 * Aligning with "calm-tech" campus routing rather than emergency response.
 */
export function getRecommendedAction(
	category: FlareCategory,
	severity: FlareSeverity,
	routeAffected = false,
): string {
	if (routeAffected) {
		switch (category) {
			case "blocked_entrance":
				return severity === "high"
					? "Stay on the suggested path and avoid re-entering through this entrance."
					: "Use the alternate approach shown and avoid this entrance.";
			case "dense_crowd":
				return severity === "high"
					? "Keep moving on the suggested path and avoid stopping near the crowd."
					: "Follow the suggested path and pass through this area calmly.";
			case "construction":
				return severity === "high"
					? "Stay on the rerouted path and do not cut back through the work zone."
					: "Follow the adjusted path and expect a small delay here.";
			case "access_restriction":
				return severity === "high"
					? "Use the accessible alternative shown and avoid the restricted access point."
					: "Continue on the shown path and check access conditions as you approach.";
			default:
				return severity === "high"
					? "Stay on the suggested path and avoid the affected area."
					: "Continue on the suggested path and stay aware nearby.";
		}
	}

	switch (category) {
		case "blocked_entrance":
			return severity === "high"
				? "Use another entrance and do not gather at this doorway."
				: "Expect slower access and use another entrance if needed.";

		case "dense_crowd":
			return severity === "high"
				? "Avoid this area for now and keep moving toward a clearer path."
				: "Continue carefully and expect slower movement in this area.";

		case "construction":
			return severity === "high"
				? "Use another path if available and avoid the work zone."
				: "Expect minor delays and watch for narrowed walkways.";

		case "access_restriction":
			return severity === "high"
				? "Use an alternate accessible route and avoid this access point."
				: "Check access conditions before continuing through this area.";

		default:
			return severity === "high"
				? "Use another path if available and avoid the affected area."
				: "Stay aware and continue carefully.";
	}
}
