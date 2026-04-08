import { useMemo } from "react";
import { getAccentColors } from "../theme";
import { useLowStim } from "./useLowStim";

export const useAccentColors = () => {
	const lowStim = useLowStim();
	return useMemo(() => getAccentColors(lowStim), [lowStim]);
};
