import assert from "node:assert/strict";
import test from "node:test";
import {
	emptyStats,
	restoreStats,
	serializeStats,
} from "../app/game-history.ts";

const stats = {
	count: 4,
	best: { normal: 499, hard: 500 },
	history: [
		{
			id: 4,
			time: 501,
			feedback: "Quase! O cinco mandou um oi.",
			mode: "normal",
		},
		{ id: 3, time: 0, feedback: "Calma, calabreso.", mode: "hard" },
		{ id: 2, time: 499, feedback: "Faltou um tiquinho…", mode: "normal" },
		{
			id: 1,
			time: 500,
			feedback: 'Na mosca!\nPode mandar no grupo: "acertei".',
			mode: "hard",
		},
	],
};

test("restores times, original messages, order, count, and separate mode records", () => {
	assert.deepEqual(restoreStats(serializeStats(stats)), stats);
});

test("only result history is serialized, never the current mode or active timer", () => {
	const saved = JSON.parse(
		serializeStats({ ...stats, mode: "hard", time: 250, phase: "running" }),
	);
	assert.deepEqual(Object.keys(saved).sort(), ["history", "version"]);
	assert.equal(saved.history[0].mode, "normal");
	assert.equal(saved.history[1].mode, "hard");
});

test("records are recalculated from history, preserving the older winner on ties", () => {
	const saved = JSON.stringify({
		version: 1,
		history: stats.history,
		count: 999,
		best: { normal: 500, hard: 1 },
	});
	const restored = restoreStats(saved);
	assert.equal(restored.count, 4);
	assert.deepEqual(restored.best, { normal: 499, hard: 500 });
});

test("missing, corrupt, and unsupported saved data fall back to an empty history", () => {
	for (const raw of [
		null,
		"",
		"broken JSON",
		"null",
		"[]",
		"42",
		"{}",
		'{"version":2,"history":[]}',
		'{"version":1,"history":{}}',
	]) {
		assert.deepEqual(restoreStats(raw), emptyStats());
	}
});

test("invalid attempts are skipped while valid results and unique numbering survive", () => {
	const history = [
		null,
		42,
		{},
		...stats.history,
		{ time: -1, feedback: "Invalido", mode: "normal" },
		{ time: 10000, feedback: "Invalido", mode: "normal" },
		{ time: 1.5, feedback: "Invalido", mode: "normal" },
		{ time: "500", feedback: "Invalido", mode: "normal" },
		{ time: 500, feedback: "  ", mode: "normal" },
		{ time: 500, feedback: 42, mode: "normal" },
		{ time: 500, feedback: "Invalido", mode: "unknown" },
	];
	assert.deepEqual(
		restoreStats(JSON.stringify({ version: 1, history })),
		stats,
	);
});

test("zero and the 99.99-second time limit are valid persisted results", () => {
	const restored = restoreStats(
		JSON.stringify({
			version: 1,
			history: [
				{ time: 9999, feedback: "O tempo voou.", mode: "hard" },
				{ time: 0, feedback: "Que pressa!", mode: "normal" },
			],
		}),
	);
	assert.equal(restored.count, 2);
	assert.deepEqual(restored.best, { normal: 0, hard: 9999 });
});

test("resetting to empty stats produces no attempts or records to restore", () => {
	assert.deepEqual(restoreStats(serializeStats(emptyStats())), emptyStats());
});
