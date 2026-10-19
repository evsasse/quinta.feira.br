import TimingGame from "./timing-game";

export default function Home() {
	return (
		<div className="site-shell">
			<header className="site-header">
				<a className="wordmark" href="/" aria-label="Quinta, página inicial">
					<span className="brand-mark" aria-hidden="true" />
					quinta<span className="wordmark-dot">.</span>
				</a>
				<span className="header-note">Um jogo de precisão</span>
			</header>
			<main>
				<div className="intro">
					<p className="eyebrow">
						<span /> O desafio dos 5 segundos
					</p>
					<h1>
						Você tem o <em>timing?</em>
					</h1>
					<p className="intro-copy">
						Parece fácil. Até você tentar.
						<br />
						Pare o relógio em <strong>05.00</strong> segundos. Exatamente.
					</p>
				</div>
				<TimingGame />
			</main>
			<footer className="site-footer">
				<span>Feito para perder a noção do tempo.</span>
				<span>
					quinta.feira.br <span aria-hidden="true">↗</span>
				</span>
			</footer>
		</div>
	);
}
