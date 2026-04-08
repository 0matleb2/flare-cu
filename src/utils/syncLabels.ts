export function formatLastSyncLabel(lastSync?: number | null): string {
	if (!lastSync) return "Not synced yet on this device";

	const syncDate = new Date(lastSync);
	if (Number.isNaN(syncDate.getTime())) {
		return "Not synced yet on this device";
	}

	const now = new Date();
	const syncTime = syncDate.toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
	});

	const startOfToday = new Date(
		now.getFullYear(),
		now.getMonth(),
		now.getDate(),
	).getTime();
	const startOfSyncDay = new Date(
		syncDate.getFullYear(),
		syncDate.getMonth(),
		syncDate.getDate(),
	).getTime();
	const dayDiff = Math.round(
		(startOfToday - startOfSyncDay) / (24 * 60 * 60 * 1000),
	);

	if (dayDiff === 0) {
		return `Today at ${syncTime}`;
	}

	if (dayDiff === 1) {
		return `Yesterday at ${syncTime}`;
	}

	const dateLabel = syncDate.toLocaleDateString([], {
		month: "short",
		day: "numeric",
		year: syncDate.getFullYear() === now.getFullYear() ? undefined : "numeric",
	});

	return `${dateLabel} at ${syncTime}`;
}
