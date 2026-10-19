"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "ready" | "running" | "finished";
type Attempt = { id: number; time: number };
type Stats = { count: number; best: number | null; recent: Attempt[] };

const TARGET = 500;
const MAX_TIME_MS = 99_990;
const SEGMENTS = [
	"16,4 66,4 73,11 64,20 18,20 10,12",
	"74,16 81,24 77,65 68,74 61,66 65,25",
	"68,82 75,90 71,132 62,141 55,133 59,91",
	"12,138 55,138 62,146 53,154 7,154 0,147",
	"8,83 15,91 11,132 2,141 -5,133 -1,92",
	"14,17 21,25 17,66 8,74 1,66 5,25",
	"16,71 60,71 67,79 58,87 12,87 5,79",
];
const DIGITS = [
	"abcdef",
	"bc",
	"abdeg",
	"abcdg",
	"bcfg",
	"acdfg",
	"acdefg",
	"abc",
	"abcdefg",
	"abcdfg",
];

function formatTime(centiseconds: number) {
	const seconds = Math.floor(centiseconds / 100)
		.toString()
		.padStart(2, "0");
	const fraction = (centiseconds % 100).toString().padStart(2, "0");
	return `${seconds}.${fraction}`;
}

function Digit({ value }: { value: string }) {
	return (
		<svg className="digit" viewBox="-8 0 94 160" aria-hidden="true">
			{SEGMENTS.map((points, index) => (
				<polygon
					key={points}
					points={points}
					className={
						DIGITS[Number(value)].includes("abcdefg"[index])
							? "segment on"
							: "segment"
					}
				/>
			))}
		</svg>
	);
}

export default function TimingGame() {
	const [phase, setPhase] = useState<Phase>("ready");
	const [time, setTime] = useState(0);
	const [timedOut, setTimedOut] = useState(false);
	const [stats, setStats] = useState<Stats>({
		count: 0,
		best: null,
		recent: [],
	});
	const running = useRef(false);
	const startedAt = useRef(0);
	const frame = useRef<number | null>(null);

	const finish = useCallback((elapsedMs: number, atLimit = false) => {
		if (!running.current) return;
		running.current = false;
		if (frame.current !== null) cancelAnimationFrame(frame.current);
		const result = Math.min(9999, Math.round(elapsedMs / 10));
		setTime(result);
		setTimedOut(atLimit);
		setPhase("finished");
		setStats((previous) => ({
			count: previous.count + 1,
			best:
				previous.best === null ||
				Math.abs(result - TARGET) < Math.abs(previous.best - TARGET)
					? result
					: previous.best,
			recent: [
				{ id: previous.count + 1, time: result },
				...previous.recent,
			].slice(0, 5),
		}));
	}, []);

	const toggle = useCallback(() => {
		const now = performance.now();
		if (running.current) {
			const elapsed = now - startedAt.current;
			finish(elapsed, elapsed >= MAX_TIME_MS);
			return;
		}
		startedAt.current = now;
		running.current = true;
		setTime(0);
		setTimedOut(false);
		setPhase("running");
		const tick = () => {
			if (!running.current) return;
			const elapsed = performance.now() - startedAt.current;
			if (elapsed >= MAX_TIME_MS) {
				finish(MAX_TIME_MS, true);
				return;
			}
			setTime(Math.min(9999, Math.round(elapsed / 10)));
			frame.current = requestAnimationFrame(tick);
		};
		frame.current = requestAnimationFrame(tick);
	}, [finish]);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if (
				(event.code !== "Space" && event.key !== " ") ||
				event.altKey ||
				event.ctrlKey ||
				event.metaKey ||
				event.isComposing
			)
				return;
			if (
				event.target instanceof Element &&
				event.target.closest(
					"input, textarea, select, a, [contenteditable]:not([contenteditable='false'])",
				)
			)
				return;
			event.preventDefault();
			if (!event.repeat) toggle();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			running.current = false;
			if (frame.current !== null) cancelAnimationFrame(frame.current);
		};
	}, [toggle]);

	const perfect = phase === "finished" && time === TARGET;
	const difference = Math.abs(time - TARGET);
	const display = formatTime(time);
	const resultTitle = timedOut
		? "O tempo voou."
		: perfect
			? "No tempo. Na mosca."
			: difference <= 10
				? "Foi por um quase!"
				: difference <= 50
					? "Tá pegando o ritmo."
					: "Vamos acertar esse timing?";
	const buttonLabel =
		phase === "running"
			? "Parar o relógio"
			: phase === "finished"
				? "Tentar de novo"
				: "Começar o jogo";

	return (
		<section
			className={`game ${phase}${perfect ? " perfect" : ""}`}
			aria-label="Jogo dos cinco segundos"
		>
			<div className="clock-housing">
				<span className="screw top-left" aria-hidden="true" />
				<span className="screw top-right" aria-hidden="true" />
				<span className="screw bottom-left" aria-hidden="true" />
				<span className="screw bottom-right" aria-hidden="true" />
				<div className="clock-topline">
					<span>
						<svg
							className="clock-symbol"
							viewBox="0 0 16 16"
							fill="none"
							stroke="currentColor"
							aria-hidden="true"
						>
							<circle cx="8" cy="8" r="6" />
							<path d="M8 4v4l3 2" />
						</svg>{" "}
						Cronômetro
					</span>
					<span className="clock-status">
						<span className="status-dot" />
						{phase === "running"
							? "Contando"
							: phase === "finished"
								? "Finalizado"
								: "Pronto"}
					</span>
				</div>
				<div className="display-window">
					<div
						className="digital-display"
						role="timer"
						aria-live="off"
						aria-label={`${display} segundos`}
					>
						<Digit value={display[0]} />
						<Digit value={display[1]} />
						<span className="decimal" aria-hidden="true" />
						<Digit value={display[3]} />
						<Digit value={display[4]} />
					</div>
				</div>
				<div className="clock-bottomline">
					<span>
						Alvo <strong>05.00</strong>
					</span>
					<span>
						Segundos{" "}
						<span className="precision-mark" aria-hidden="true">
							/ 1:100
						</span>
					</span>
				</div>
			</div>

			<div
				className="feedback"
				role="status"
				aria-live="polite"
				aria-atomic="true"
			>
				{phase === "ready" ? (
					<>
						<p className="feedback-title">
							Tudo no seu tempo. Mas tente em cinco.
						</p>
						<p>O relógio começa quando você quiser.</p>
					</>
				) : phase === "running" ? (
					<>
						<p className="feedback-title">Concentre-se. Sinta o tempo.</p>
						<p>Pare quando o relógio chegar a 05.00.</p>
					</>
				) : (
					<>
						<p className="feedback-title">{resultTitle}</p>
						<p>
							{timedOut ? (
								"O limite é 99.99 segundos. Que tal mais uma?"
							) : perfect ? (
								"05.00 segundos. Um timing impecável."
							) : (
								<>
									<strong>{(difference / 100).toFixed(2)}s</strong>{" "}
									{time < TARGET ? "antes" : "depois"} do alvo. Mais uma?
								</>
							)}
						</p>
					</>
				)}
			</div>
			<button
				className="game-button"
				type="button"
				onClick={toggle}
				aria-keyshortcuts="Space"
			>
				<span
					className={phase === "running" ? "stop-icon" : "play-icon"}
					aria-hidden="true"
				/>
				<span>{buttonLabel}</span>
				<kbd>
					espaço <span aria-hidden="true">␣</span>
				</kbd>
			</button>
			<p className="keyboard-hint">
				Aperte <strong>espaço</strong> ou toque no botão para{" "}
				{phase === "running" ? "parar" : "começar"}.
			</p>
			<section className="session-stats" aria-label="Estatísticas desta sessão">
				<div className="stat">
					<span className="stat-label">Seu melhor tempo</span>
					<strong>
						{stats.best === null ? "— — . — —" : formatTime(stats.best)}
						<span className="stat-unit">s</span>
					</strong>
				</div>
				<span className="stat-divider" aria-hidden="true" />
				<div className="stat">
					<span className="stat-label">Tentativas</span>
					<strong>
						{stats.count.toString().padStart(2, "0")}
						<span className="stat-unit">nesta sessão</span>
					</strong>
				</div>
			</section>
			<div className="history">
				<span className="history-label">Últimas tentativas</span>
				{stats.recent.length === 0 ? (
					<p className="history-empty">
						Sua primeira tentativa está a um espaço de distância.
					</p>
				) : (
					<ol aria-label="Últimas tentativas, da mais recente à mais antiga">
						{stats.recent.map((attempt) => (
							<li
								key={attempt.id}
								className={attempt.time === TARGET ? "exact" : ""}
							>
								<span className="attempt-number">
									{attempt.id.toString().padStart(2, "0")}
								</span>
								<span>{formatTime(attempt.time)}</span>
								<span
									className="attempt-direction"
									role="img"
									aria-label={
										attempt.time === TARGET
											? "Exato"
											: attempt.time < TARGET
												? "Antes do alvo"
												: "Depois do alvo"
									}
								>
									{attempt.time === TARGET
										? "✓"
										: attempt.time < TARGET
											? "−"
											: "+"}
								</span>
							</li>
						))}
					</ol>
				)}
			</div>
			<noscript>Ative o JavaScript no navegador para jogar.</noscript>
		</section>
	);
}
