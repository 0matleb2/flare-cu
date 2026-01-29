import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlareService } from "../services/FlareService";
import type { Flare, FlareType } from "../types";

export const useFlares = () => {
	return useQuery({
		queryKey: ["flares"],
		queryFn: () => FlareService.getFlares(),
	});
};

export const useCreateFlare = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (newFlare: {
			type: FlareType;
			location: string;
			description: string;
		}) => FlareService.createFlare(newFlare),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["flares"] });
		},
	});
};

export const useConfirmFlare = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => FlareService.confirmFlare(id),
		onMutate: async (id) => {
			// Cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["flares"] });

			// Snapshot the previous value
			const previousFlares = queryClient.getQueryData<Flare[]>(["flares"]);

			// Optimistically update to the new value
			queryClient.setQueryData<Flare[]>(["flares"], (old) =>
				old?.map((flare) =>
					flare.id === id
						? { ...flare, confirmations: flare.confirmations + 1 }
						: flare,
				),
			);

			// Return a context object with the snapshotted value
			return { previousFlares };
		},
		onError: (_err, _id, context) => {
			// If the mutation fails, use the context returned from onMutate to roll back
			queryClient.setQueryData(["flares"], context?.previousFlares);
		},
		onSettled: () => {
			// Always refetch after error or success:
			queryClient.invalidateQueries({ queryKey: ["flares"] });
		},
	});
};
