import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlareService } from "../services/FlareService";
import type { Flare, FlareCategory } from "../types";

export const useFlares = () => {
	return useQuery({
		queryKey: ["flares"],
		queryFn: () => FlareService.getFlares(),
	});
};

export const useCreateFlare = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			category: FlareCategory;
			building: string;
			entrance?: string;
			note?: string;
		}) => FlareService.createFlare(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["flares"] });
		},
	});
};

// Toggle save/unsave with optimistic update
export const useSaveFlare = () => {
	const queryClient = useQueryClient();

	return useMutation({
		// Accept both id and the current saved state so mutationFn
		// knows which service call to make BEFORE optimistic update
		mutationFn: async ({ id, wasSaved }: { id: string; wasSaved: boolean }) => {
			if (wasSaved) {
				await FlareService.unsaveFlare(id);
			} else {
				await FlareService.saveFlare(id);
			}
		},
		onMutate: async ({ id }) => {
			await queryClient.cancelQueries({ queryKey: ["flares"] });
			const previous = queryClient.getQueryData<Flare[]>(["flares"]);
			queryClient.setQueryData<Flare[]>(["flares"], (old) =>
				old?.map((f) =>
					f.id === id ? { ...f, savedByUser: !f.savedByUser } : f,
				),
			);
			return { previous };
		},
		onError: (_err, _vars, context) => {
			queryClient.setQueryData(["flares"], context?.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["flares"] });
		},
	});
};
