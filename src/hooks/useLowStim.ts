import { usePreferences } from "./usePreferences";

/**
 * Convenience hook for low stimulation mode.
 * Returns true when the user has enabled the low stimulation preference.
 * Use this to conditionally reduce motion, mute colors, collapse
 * secondary info, and minimize attention-grabbing UI.
 */
export const useLowStim = (): boolean => {
	const { data: prefs } = usePreferences();
	return prefs?.lowStimulation ?? false;
};
