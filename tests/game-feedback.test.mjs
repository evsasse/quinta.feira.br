import assert from "node:assert/strict";
import test from "node:test";
import {
	createFeedbackPicker,
	feedbackCategory,
	feedbackMessages,
} from "../app/game-feedback.ts";

test("100 unique messages, with 20 choices in each result range", () => {
	const messages = Object.values(feedbackMessages).flat();
	assert.equal(messages.length, 100);
	assert.equal(new Set(messages).size, 100);
	for (const pool of Object.values(feedbackMessages)) {
		assert.equal(pool.length, 20);
		assert.ok(pool.every((message) => message.trim().length > 0));
	}
});

test("feedback ranges respect exact and early/late boundaries", () => {
	for (const [time, category] of [
		[0, "early"], [449, "early"], [450, "close"], [489, "close"],
		[490, "almost"], [499, "almost"], [500, "perfect"],
		[501, "almost"], [510, "almost"], [511, "close"],
		[550, "close"], [551, "late"], [9999, "late"],
	]) assert.equal(feedbackCategory(time), category, `Time: ${time}`);
});

test("every category exhausts its deck before repeating, across multiple cycles", () => {
	for (const time of [500, 499, 470, 0, 9999]) {
		const pick = createFeedbackPicker(() => 0.37);
		let previous;
		for (let cycle = 0; cycle < 4; cycle++) {
			const drawn = [];
			for (let round = 0; round < 20; round++) {
				const message = pick(time);
				assert.ok(feedbackMessages[feedbackCategory(time)].includes(message));
				assert.notEqual(message, previous);
				drawn.push(message);
				previous = message;
			}
			assert.equal(new Set(drawn).size, 20);
		}
	}
});

test("interleaved results keep independent decks and fresh sessions start clean", () => {
	const firstSession = createFeedbackPicker(() => 0);
	const perfect = [];
	for (let round = 0; round < 20; round++) {
		perfect.push(firstSession(500));
		firstSession(round % 2 ? 100 : 900);
	}
	assert.equal(new Set(perfect).size, 20);
	const secondSession = createFeedbackPicker(() => 0);
	assert.equal(secondSession(500), perfect[0]);
});
