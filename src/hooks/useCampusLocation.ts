import { useCallback, useEffect, useState } from "react";
import {
	detectCampusLocation,
	type ResolvedCampusLocation,
} from "../services/CampusLocationService";

interface CampusLocationState {
	isDetecting: boolean;
	location?: ResolvedCampusLocation;
	refresh: () => Promise<void>;
}

export const useCampusLocation = (): CampusLocationState => {
	const [isDetecting, setIsDetecting] = useState(true);
	const [location, setLocation] = useState<
		ResolvedCampusLocation | undefined
	>();

	const refresh = useCallback(async () => {
		setIsDetecting(true);
		const nextLocation = await detectCampusLocation();
		setLocation(nextLocation);
		setIsDetecting(false);
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	return { isDetecting, location, refresh };
};
