import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PreferencesService } from "../services/PreferencesService";
import { DEFAULT_PREFERENCES, type UserPreferences } from "../types";

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
		onMutate: async (prefs) => {
			await queryClient.cancelQueries({ queryKey: ["preferences"] });
			const previous = queryClient.getQueryData<UserPreferences>([
				"preferences",
			]);
			const current = previous ?? DEFAULT_PREFERENCES;
			queryClient.setQueryData<UserPreferences>(["preferences"], {
				...current,
				...prefs,
			});
			return { previous };
		},
		onError: (_error, _prefs, context) => {
			queryClient.setQueryData(["preferences"], context?.previous);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["preferences"] });
		},
	});
};

export const useResetPreferences = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => PreferencesService.resetPreferences(),
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ["preferences"] });
			const previous = queryClient.getQueryData<UserPreferences>([
				"preferences",
			]);
			queryClient.setQueryData<UserPreferences>(
				["preferences"],
				DEFAULT_PREFERENCES,
			);
			return { previous };
		},
		onError: (_error, _vars, context) => {
			queryClient.setQueryData(["preferences"], context?.previous);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["preferences"] });
		},
	});
};
