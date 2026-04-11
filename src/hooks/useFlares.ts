import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FlareService } from "../services/FlareService";
import type { CreateFlareInput, Flare } from "../types";

export const useFlares = () => {
	return useQuery({
		queryKey: ["flares"],
		queryFn: () => FlareService.getFlares(),
	});
};

export const useCreateFlare = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateFlareInput) => FlareService.createFlare(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["flares"] });
			queryClient.invalidateQueries({ queryKey: ["offlineSyncStatus"] });
		},
	});
};

export const useOfflineSyncStatus = () => {
	return useQuery({
		queryKey: ["offlineSyncStatus"],
		queryFn: async () => ({
			queueCount: await FlareService.getQueueCount(),
			lastSync: await FlareService.getLastSync(),
		}),
	});
};

export const useSyncQueuedReports = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => FlareService.syncQueuedReports(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["flares"] });
			queryClient.invalidateQueries({ queryKey: ["offlineSyncStatus"] });
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

// Toggle upvote with optimistic update
export const useUpvoteFlare = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await FlareService.upvoteFlare(id);
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ["flares"] });
			const previous = queryClient.getQueryData<Flare[]>(["flares"]);
			queryClient.setQueryData<Flare[]>(["flares"], (old) =>
				old?.map((f) => {
					if (f.id !== id) return f;
					const wasUpvoted = f.upvotedByUser;
					const wasDownvoted = f.downvotedByUser;
					let newUpvotes = f.upvotes;
					let newUpvotedByUser = f.upvotedByUser;
					let newDownvotedByUser = f.downvotedByUser;

					if (wasUpvoted) {
						newUpvotes -= 1;
						newUpvotedByUser = false;
					} else {
						newUpvotes += 1;
						newUpvotedByUser = true;
						if (wasDownvoted) {
							newUpvotes += 1;
							newDownvotedByUser = false;
						}
					}

					return {
						...f,
						upvotes: newUpvotes,
						upvotedByUser: newUpvotedByUser,
						downvotedByUser: newDownvotedByUser,
					};
				}),
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

// Toggle downvote with optimistic update
export const useDownvoteFlare = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await FlareService.downvoteFlare(id);
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ["flares"] });
			const previous = queryClient.getQueryData<Flare[]>(["flares"]);
			queryClient.setQueryData<Flare[]>(["flares"], (old) =>
				old?.map((f) => {
					if (f.id !== id) return f;
					const wasUpvoted = f.upvotedByUser;
					const wasDownvoted = f.downvotedByUser;
					let newUpvotes = f.upvotes;
					let newUpvotedByUser = f.upvotedByUser;
					let newDownvotedByUser = f.downvotedByUser;

					if (wasDownvoted) {
						newUpvotes += 1;
						newDownvotedByUser = false;
					} else {
						newUpvotes -= 1;
						newDownvotedByUser = true;
						if (wasUpvoted) {
							newUpvotes -= 1;
							newUpvotedByUser = false;
						}
					}

					return {
						...f,
						upvotes: newUpvotes,
						upvotedByUser: newUpvotedByUser,
						downvotedByUser: newDownvotedByUser,
					};
				}),
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

// Delete a flare (used for snackbar undo after submission)
export const useDeleteFlare = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			await FlareService.deleteFlare(id);
		},
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: ["flares"] });
			const previous = queryClient.getQueryData<Flare[]>(["flares"]);
			queryClient.setQueryData<Flare[]>(["flares"], (old) =>
				old?.filter((f) => f.id !== id),
			);
			return { previous };
		},
		onError: (_err, _id, context) => {
			queryClient.setQueryData(["flares"], context?.previous);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["flares"] });
			queryClient.invalidateQueries({ queryKey: ["offlineSyncStatus"] });
		},
	});
};
