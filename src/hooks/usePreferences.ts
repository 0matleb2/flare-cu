import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PreferencesService } from "../services/PreferencesService";
import type { UserPreferences } from "../types";

export const usePreferences = () => {
	return useQuery({
		queryKey: ["preferences"],
		queryFn: () => PreferencesService.getPreferences(),
	});
};

export const useUpdatePreferences = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (prefs: Partial<UserPreferences>) =>
			PreferencesService.savePreferences(prefs),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["preferences"] });
		},
	});
};

export const useResetPreferences = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => PreferencesService.resetPreferences(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["preferences"] });
		},
	});
};
