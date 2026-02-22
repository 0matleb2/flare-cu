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

export const useSaveFlare = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => FlareService.saveFlare(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ["flares"] });
			const previous = queryClient.getQueryData<Flare[]>(["flares"]);
			queryClient.setQueryData<Flare[]>(["flares"], (old) =>
				old?.map((f) => (f.id === id ? { ...f, savedByUser: true } : f)),
			);
			return { previous };
		},
		onError: (_err, _id, context) => {
			queryClient.setQueryData(["flares"], context?.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["flares"] });
		},
	});
};
