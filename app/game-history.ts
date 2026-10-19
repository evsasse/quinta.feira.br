export type Mode = "normal" | "hard";
export type Attempt = {
	id: number;
	time: number;
	feedback: string;
	mode: Mode;
};
export type Stats = {
	count: number;
	best: Record<Mode, number | null>;
	history: Attempt[];
};
type SavedAttempt = Omit<Attempt, "id">;

export const HISTORY_STORAGE_KEY = "quinta:history:v1";

export function emptyStats(): Stats {
	return { count: 0, best: { normal: null, hard: null }, history: [] };
}

function isSavedAttempt(value: unknown): value is SavedAttempt {
	if (typeof value !== "object" || value === null) return false;
	const attempt = value as Partial<SavedAttempt>;
	return (
		typeof attempt.time === "number" &&
		Number.isInteger(attempt.time) &&
		attempt.time >= 0 &&
		attempt.time <= 9999 &&
		typeof attempt.feedback === "string" &&
		attempt.feedback.trim().length > 0 &&
		(attempt.mode === "normal" || attempt.mode === "hard")
	);
}

export function restoreStats(raw: string | null): Stats {
	const stats = emptyStats();
	if (!raw) return stats;
	try {
		const saved: unknown = JSON.parse(raw);
		if (
			typeof saved !== "object" ||
			saved === null ||
			!("version" in saved) ||
			saved.version !== 1 ||
			!("history" in saved) ||
			!Array.isArray(saved.history)
		)
			return stats;
		const attempts = saved.history.filter(isSavedAttempt);
		stats.history = attempts.map((attempt, index) => ({
			id: attempts.length - index,
			time: attempt.time,
			feedback: attempt.feedback,
			mode: attempt.mode,
		}));
		stats.count = stats.history.length;
		// Rebuild records oldest first, keeping the original winner when errors tie.
		for (let index = stats.history.length - 1; index >= 0; index--) {
			const { time, mode } = stats.history[index];
			const best = stats.best[mode];
			if (best === null || Math.abs(time - 500) < Math.abs(best - 500))
				stats.best[mode] = time;
		}
	} catch {
		// Invalid browser data must not prevent someone from playing.
		return emptyStats();
	}
	return stats;
}

export function serializeStats(stats: Stats): string {
	// The selected mode and active round are intentionally not persisted.
	return JSON.stringify({
		version: 1,
		history: stats.history.map(({ time, feedback, mode }) => ({
			time,
			feedback,
			mode,
		})),
	});
}
